import { ContactSettings, SiteSettings } from '@/features/settings/schema/settingsSchema';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand?: string;
  reference?: string;
  images?: Array<{
    path: string;
    alt?: string;
  }>;
  categories?: Array<{
    name: string;
  }>;
}

export const generateBusinessSchema = (contactSettings: ContactSettings, siteSettings: SiteSettings) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "Optician",
    "name": siteSettings.siteName || "Optique",
    "description": siteSettings.slogan || "Professional eyewear and optical services",
    "url": baseUrl,
    "logo": siteSettings.logoUrl ? `${baseUrl}${siteSettings.logoUrl}` : undefined,
    "image": siteSettings.heroBackgroundImg ? `${baseUrl}${siteSettings.heroBackgroundImg}` : undefined,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": contactSettings.address || "",
      "addressLocality": contactSettings.city || "",
      "addressCountry": "FR"
    },
    "telephone": contactSettings.phone,
    "email": contactSettings.contactEmail,
    "openingHours": contactSettings.openingHours,
    "sameAs": [
      contactSettings.instagramLink,
      contactSettings.facebookLink
    ].filter(Boolean),
    "serviceArea": {
      "@type": "City",
      "name": contactSettings.city || "Local Area"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Optical Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Eye Examination",
            "description": "Comprehensive eye examination and vision testing"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Eyewear Fitting",
            "description": "Professional fitting and adjustment of eyewear"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Prescription Lenses",
            "description": "Custom prescription lenses and lens treatments"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
};

export const generateProductSchema = (product: Product) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "sku": product.reference,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Optique"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Optique"
      },
      "url": `${baseUrl}/products/${product.id}`
    },
    "image": product.images?.map(img => `${baseUrl}${img.path}`) || [],
    "category": product.categories?.map(cat => cat.name).join(", ") || "Eyewear",
    "url": `${baseUrl}/products/${product.id}`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "25",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
};

export const generateOrganizationSchema = (contactSettings: ContactSettings, siteSettings: SiteSettings) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteSettings.siteName || "Optique",
    "url": baseUrl,
    "logo": siteSettings.logoUrl ? `${baseUrl}${siteSettings.logoUrl}` : undefined,
    "description": siteSettings.slogan || "Professional eyewear and optical services",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": contactSettings.address || "",
      "addressLocality": contactSettings.city || "",
      "addressCountry": "FR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": contactSettings.phone,
      "contactType": "customer service",
      "email": contactSettings.contactEmail
    },
    "sameAs": [
      contactSettings.instagramLink,
      contactSettings.facebookLink
    ].filter(Boolean)
  };
};

export const generateLocalBusinessSchema = (contactSettings: ContactSettings, siteSettings: SiteSettings) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}#localbusiness`,
    "name": siteSettings.siteName || "Optique",
    "description": siteSettings.slogan || "Professional eyewear and optical services",
    "url": baseUrl,
    "telephone": contactSettings.phone,
    "email": contactSettings.contactEmail,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": contactSettings.address || "",
      "addressLocality": contactSettings.city || "",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "48.8566", // You can make this dynamic based on actual location
      "longitude": "2.3522"
    },
    "openingHours": contactSettings.openingHours,
    "image": siteSettings.heroBackgroundImg ? `${baseUrl}${siteSettings.heroBackgroundImg}` : undefined,
    "logo": siteSettings.logoUrl ? `${baseUrl}${siteSettings.logoUrl}` : undefined,
    "sameAs": [
      contactSettings.instagramLink,
      contactSettings.facebookLink
    ].filter(Boolean),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Optical Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Eye Examination"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Eyewear Fitting"
          }
        }
      ]
    }
  };
};

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};
