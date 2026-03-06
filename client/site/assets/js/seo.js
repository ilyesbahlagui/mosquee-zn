(function() {
  const mosqueSchema = {
    "@context": "https://schema.org",
    "@type": "Mosque",
    "@id": "https://mosquee-lumiere-piete.fr/#mosquee",
    "name": "Mosquée Lumière et Piété Nîmes ZN",
    "description": "Mosquée Lumière et Piété Nîmes ZN (ZUP Nord/Valdegour). Centre cultuel ZN Nîmes Ouest accueillant hommes, femmes et enfants. Salat Janaza, prières quotidiennes et Jumu'ah.",
    "image": "https://mosquee-lumiere-piete.fr/assets/images/header.webp",
    "logo": "https://mosquee-lumiere-piete.fr/assets/images/favicon.png",
    "hasMap": "https://www.google.com/maps?q=43.82993600887529,4.331689257003327",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1 rue Jacques Monod ZUP Nord",
      "addressLocality": "Nîmes ZN",
      "postalCode": "30900",
      "addressRegion": "Occitanie",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.829936,
      "longitude": 4.331689
    },
    "email": "contact@mosquee-lumiere-piete.fr",
    "url": "https://mosquee-lumiere-piete.fr",
    "areaServed": "ZN Nîmes Ouest, Valdegour, ZUP Nord",
    "sameAs": [
      "https://mawaqit.net/fr/m/nour-nimes",
      "https://www.facebook.com/mlpnimes"
    ],
    "publicAccess": true,
    "priceRange": "$$",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Espaces séparés hommes/femmes",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Prières quotidiennes et Jumu'ah (13:30 été/12:40 hiver)",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Salat Janaza",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Centre d'apprentissage et solidarité",
        "value": true
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://mosquee-lumiere-piete.fr/#faq",
    "mainEntity": [{
      "@type": "Question",
      "name": "Quelles sont les heures de prière à Nîmes ZN (Mosquée Lumière et Piété) ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Horaires des prières quotidiennes (Fajr, Dhuhr, Asr, Maghrib, Isha) à Nîmes ZN via Mawaqit Nour Nîmes. Jumu'ah : 13:30 été / 12:40 hiver."
      }
    }, {
      "@type": "Question",
      "name": "À quelle heure est la prière du vendredi Jumu'ah Mosquée Lumière et Piété Nîmes ZN ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Prière Jumu'ah à Nîmes ZN : 13:30 (été) / 12:40 (hiver). Horaires quotidiens via widget Mawaqit officiel."
      }
    }, {
      "@type": "Question",
      "name": "Comment faire un don à la Mosquée Lumière et Piété Nîmes ZN ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Dons via Cotizup (parking) ou virement : IBAN FR76 1027 8089 6500 0210 2920 165 (UNION IMANOPAIX NIMOISE, BIC CMCIFR2A, ref: DON UNION IMANOPAIX NIMOISE). RIB PDF dispo."
      }
    }, {
      "@type": "Question",
      "name": "Où se trouve la Mosquée Lumière et Piété Nîmes ZN ZUP Nord ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "1 rue Jacques Monod, 30900 Nîmes ZN (ZUP Nord/Valdegour Nîmes Ouest). Email : contact@mosquee-lumiere-piete.fr. Entrées séparées H/F."
      }
    }]
  };

  function injectSchema(schema) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  injectSchema(mosqueSchema);
  injectSchema(faqSchema);
})();
