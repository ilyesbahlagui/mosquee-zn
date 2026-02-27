import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const TARGET_URL = 'https://www.cotizup.com/parkingmosquee';
const OUT_FILE = path.join(process.cwd(), 'amount.json');

async function fetchAmount() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
    );

    await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.waitForSelector('body', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 5000));

    const amount = await page.evaluate(() => {
      // 🎯 1. data-collected (principal sur CotizUp)
      const dataCollected = document.querySelector('[data-collected]');
      if (dataCollected) {
        const raw = dataCollected.getAttribute('data-collected');
        const num = parseFloat(raw.replace(/[^\d,.]/g, '').replace(',', '.'));
        if (!isNaN(num)) return num;
      }

      // 🎯 2. span.count data-to
      const countEl = document.querySelector('.count[data-to]');
      if (countEl) {
        const raw = countEl.getAttribute('data-to');
        const num = parseFloat(raw.replace(/[^\d,.]/g, '').replace(',', '.'));
        if (!isNaN(num)) return num;
      }

      // 🎯 3. Texte € visible
      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        const text = el.innerText;
        const match = text.match(/([\d\s,.]+)\s*€/i);
        if (match) {
          const num = parseFloat(match[1].replace(/\s/g, '').replace(',', '.'));
          if (!isNaN(num) && num > 0) return num;
        }
      }

      return null;
    });

    return amount;
  } finally {
    await browser.close();
  }
}

function formatDate() {
  const now = new Date();
  const options = {
    timeZone: 'Europe/Paris',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  };
  const parts = new Intl.DateTimeFormat('fr-FR', options).formatToParts(now);
  const get = type => parts.find(p => p.type === type)?.value;
  return `${get('day')}-${get('month')}-${get('year')} ${get('hour')}:${get('minute')}:${get('second')}`;
}

async function update() {
  try {
    const amount = await fetchAmount();

    let data = {};
    if (fs.existsSync(OUT_FILE)) {
      try {
        data = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8').trim()) || {};
      } catch { }
    }

    data.cotizup = { ok: !!amount, amount: amount || 0, updatedAt: formatDate() };
    data.banque ||= { ok: true, amount: 0, updatedAt: formatDate() };

    fs.writeFileSync(OUT_FILE, JSON.stringify(data, null, 2));
  } catch { }
}

update();
