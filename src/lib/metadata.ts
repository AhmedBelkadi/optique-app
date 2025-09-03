import { Metadata } from 'next';
import { getSiteSettings } from '@/features/settings/services/siteSettings';
import { getSEOSettings } from '@/features/settings/services/seoSettings';

export interface SEOData {
  title?: string;
  description?: string;
  ogImage?: string;
  productName?: string;
  productBrand?: string;
  categoryName?: string;
}

export async function generateMetadata(
  seoData: SEOData = {},
  pageType: 'homepage' | 'product' | 'category' = 'homepage'
): Promise<Metadata> {
  // Fetch settings from separate services
  const [siteResult, seoResult] = await Promise.all([
    getSiteSettings(),
    getSEOSettings(),
  ]);
  
  const siteSettings = siteResult.data;
  const seoSettings = seoResult.data;

  // Default values
  const defaultTitle = seoSettings?.metaTitle || 'Optique - Your Vision, Our Expertise';
  const defaultDescription = seoSettings?.metaDescription || 'Professional eyewear and optical services tailored to your unique needs. Experience the perfect blend of style, comfort, and precision.';
  const defaultOgImage = seoSettings?.ogImage || siteSettings?.logoUrl;

  let title = defaultTitle;
  let description = defaultDescription;

  // Generate title and description based on page type
  switch (pageType) {
    case 'product':
      if (seoData.productName && seoData.productBrand) {
        title = seoSettings?.productMetaTitle
          ?.replace('{product_name}', seoData.productName)
          ?.replace('{brand}', seoData.productBrand) || `${seoData.productName} - ${seoData.productBrand} | Optique`;
        
        description = seoSettings?.productMetaDescription
          ?.replace('{product_name}', seoData.productName)
          ?.replace('{brand}', seoData.productBrand) || `Discover ${seoData.productName} by ${seoData.productBrand}. Premium eyewear with exceptional quality and style. Shop now at Optique.`;
      }
      break;
    
    case 'category':
      if (seoData.categoryName) {
        title = seoSettings?.categoryMetaTitle
          ?.replace('{category_name}', seoData.categoryName) || `${seoData.categoryName} Eyewear | Optique`;
        
        description = seoSettings?.categoryMetaDescription
          ?.replace('{category_name}', seoData.categoryName) || `Browse our collection of ${seoData.categoryName} eyewear. Find the perfect frames and lenses for your style and vision needs.`;
      }
      break;
    
    default:
      // Use custom title/description if provided, otherwise use defaults
      title = seoData.title || defaultTitle;
      description = seoData.description || defaultDescription;
  }

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      images: seoData.ogImage || defaultOgImage ? [
        {
          url: seoData.ogImage || defaultOgImage!,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : undefined,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: seoData.ogImage || defaultOgImage ? [seoData.ogImage || defaultOgImage!] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code', // Add your Google verification code
    },
  };

  return metadata;
} 