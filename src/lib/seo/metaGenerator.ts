import { Metadata } from 'next';
import { SEOSettings } from '@/features/settings/schema/settingsSchema';

export interface PageData {
  siteSettings?: any;
  contactSettings?: any;
  product?: any;
  category?: any;
  [key: string]: any;
}

export class MetaGenerator {
  private static baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

  static generatePageMeta(pageType: string, data: PageData, seoSettings: SEOSettings): Metadata {
    switch (pageType) {
      case 'homepage':
        return this.generateHomepageMeta(seoSettings, data);
      case 'about':
        return this.generateAboutMeta(seoSettings, data);
      case 'contact':
        return this.generateContactMeta(seoSettings, data);
      case 'appointment':
        return this.generateAppointmentMeta(seoSettings, data);
      case 'faq':
        return this.generateFAQMeta(seoSettings, data);
      case 'testimonials':
        return this.generateTestimonialsMeta(seoSettings, data);
      case 'products':
        return this.generateProductsMeta(seoSettings, data);
      case 'product':
        return this.generateProductMeta(data, seoSettings);
      default:
        return this.generateDefaultMeta(seoSettings);
    }
  }

  private static generateHomepageMeta(seoSettings: SEOSettings, data: PageData): Metadata {
    const pageSettings = seoSettings.homepage;
    const siteSettings = data.siteSettings;
    const contactSettings = data.contactSettings;

    const title = pageSettings?.title || seoSettings.metaTitle || `${siteSettings?.siteName || 'Optique'} - Votre Vision, Notre Expertise`;
    const description = pageSettings?.description || seoSettings.metaDescription || 
      `Services optiques professionnels adaptés à vos besoins uniques. Découvrez le parfait équilibre entre style, confort et précision${contactSettings?.city ? ` à ${contactSettings.city}` : ''}.`;

    return {
      title,
      description,
      keywords: pageSettings?.keywords || ['optique', 'lunettes', 'montures', 'verres', 'opticien', contactSettings?.city].filter(Boolean),
      openGraph: {
        title,
        description,
        images: seoSettings.ogImage ? [{ url: seoSettings.ogImage }] : undefined,
        type: 'website',
        url: this.baseUrl,
        siteName: siteSettings?.siteName || 'Optique',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: seoSettings.ogImage ? [seoSettings.ogImage] : undefined,
      },
      robots: {
        index: seoSettings.robotsIndex,
        follow: seoSettings.robotsFollow,
        googleBot: {
          index: seoSettings.robotsIndex,
          follow: seoSettings.robotsFollow,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: this.baseUrl,
      },
    };
  }

  private static generateAboutMeta(seoSettings: SEOSettings, data: PageData): Metadata {
    const pageSettings = seoSettings.about;
    const siteSettings = data.siteSettings;
    const contactSettings = data.contactSettings;

    const title = pageSettings?.title || `About ${siteSettings?.siteName || 'Us'} - ${contactSettings?.city || 'Local'} Optician`;
    const description = pageSettings?.description || 
      `Learn about ${siteSettings?.siteName || 'our'} story, expertise, and commitment to providing exceptional optical care${contactSettings?.city ? ` in ${contactSettings.city}` : ''}.`;

    return {
      title,
      description,
      keywords: pageSettings?.keywords || ['about', 'optique', 'story', 'expertise', contactSettings?.city].filter(Boolean),
      openGraph: {
        title,
        description,
        images: seoSettings.ogImage ? [{ url: seoSettings.ogImage }] : undefined,
        type: 'website',
        url: `${this.baseUrl}/about`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: seoSettings.ogImage ? [seoSettings.ogImage] : undefined,
      },
      robots: {
        index: seoSettings.robotsIndex,
        follow: seoSettings.robotsFollow,
      },
      alternates: {
        canonical: `${this.baseUrl}/about`,
      },
    };
  }

  private static generateContactMeta(seoSettings: SEOSettings, data: PageData): Metadata {
    const pageSettings = seoSettings.contact;
    const siteSettings = data.siteSettings;
    const contactSettings = data.contactSettings;

    const title = pageSettings?.title || `Contact ${siteSettings?.siteName || 'Us'} - ${contactSettings?.city || 'Local'} Optician`;
    const description = pageSettings?.description || 
      `Get in touch with ${siteSettings?.siteName || 'our'} optical team${contactSettings?.city ? ` in ${contactSettings.city}` : ''}. Call ${contactSettings?.phone || 'us'} or visit our location.`;

    return {
      title,
      description,
      keywords: pageSettings?.keywords || ['contact', 'optique', 'appointment', 'location', contactSettings?.city, contactSettings?.phone].filter(Boolean),
      openGraph: {
        title,
        description,
        images: seoSettings.ogImage ? [{ url: seoSettings.ogImage }] : undefined,
        type: 'website',
        url: `${this.baseUrl}/contact`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: seoSettings.ogImage ? [seoSettings.ogImage] : undefined,
      },
      robots: {
        index: seoSettings.robotsIndex,
        follow: seoSettings.robotsFollow,
      },
      alternates: {
        canonical: `${this.baseUrl}/contact`,
      },
    };
  }

  private static generateAppointmentMeta(seoSettings: SEOSettings, data: PageData): Metadata {
    const pageSettings = seoSettings.appointment;
    const siteSettings = data.siteSettings;
    const contactSettings = data.contactSettings;

    const title = pageSettings?.title || `Book Eye Exam - ${siteSettings?.siteName || 'Optique'}`;
    const description = pageSettings?.description || 
      `Schedule your eye examination appointment with ${siteSettings?.siteName || 'our'} professional opticians${contactSettings?.city ? ` in ${contactSettings.city}` : ''}. Book online today.`;

    return {
      title,
      description,
      keywords: pageSettings?.keywords || ['appointment', 'eye exam', 'booking', 'optique', contactSettings?.city].filter(Boolean),
      openGraph: {
        title,
        description,
        images: seoSettings.ogImage ? [{ url: seoSettings.ogImage }] : undefined,
        type: 'website',
        url: `${this.baseUrl}/appointment`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: seoSettings.ogImage ? [seoSettings.ogImage] : undefined,
      },
      robots: {
        index: seoSettings.robotsIndex,
        follow: seoSettings.robotsFollow,
      },
      alternates: {
        canonical: `${this.baseUrl}/appointment`,
      },
    };
  }

  private static generateFAQMeta(seoSettings: SEOSettings, data: PageData): Metadata {
    const pageSettings = seoSettings.faq;
    const siteSettings = data.siteSettings;
    const contactSettings = data.contactSettings;

    const title = pageSettings?.title || `FAQ - ${siteSettings?.siteName || 'Optique'} Frequently Asked Questions`;
    const description = pageSettings?.description || 
      `Find answers to common questions about our optical services, eyewear, and eye care${contactSettings?.city ? ` in ${contactSettings.city}` : ''}.`;

    return {
      title,
      description,
      keywords: pageSettings?.keywords || ['faq', 'questions', 'optique', 'eyewear', 'help', contactSettings?.city].filter(Boolean),
      openGraph: {
        title,
        description,
        images: seoSettings.ogImage ? [{ url: seoSettings.ogImage }] : undefined,
        type: 'website',
        url: `${this.baseUrl}/faq`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: seoSettings.ogImage ? [seoSettings.ogImage] : undefined,
      },
      robots: {
        index: seoSettings.robotsIndex,
        follow: seoSettings.robotsFollow,
      },
      alternates: {
        canonical: `${this.baseUrl}/faq`,
      },
    };
  }

  private static generateTestimonialsMeta(seoSettings: SEOSettings, data: PageData): Metadata {
    const pageSettings = seoSettings.testimonials;
    const siteSettings = data.siteSettings;
    const contactSettings = data.contactSettings;

    const title = pageSettings?.title || `Customer Reviews - ${siteSettings?.siteName || 'Optique'} Testimonials`;
    const description = pageSettings?.description || 
      `Read what our customers say about their experience with ${siteSettings?.siteName || 'our'} optical services${contactSettings?.city ? ` in ${contactSettings.city}` : ''}.`;

    return {
      title,
      description,
      keywords: pageSettings?.keywords || ['testimonials', 'reviews', 'customers', 'optique', 'feedback', contactSettings?.city].filter(Boolean),
      openGraph: {
        title,
        description,
        images: seoSettings.ogImage ? [{ url: seoSettings.ogImage }] : undefined,
        type: 'website',
        url: `${this.baseUrl}/testimonials`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: seoSettings.ogImage ? [seoSettings.ogImage] : undefined,
      },
      robots: {
        index: seoSettings.robotsIndex,
        follow: seoSettings.robotsFollow,
      },
      alternates: {
        canonical: `${this.baseUrl}/testimonials`,
      },
    };
  }

  private static generateProductsMeta(seoSettings: SEOSettings, data: PageData): Metadata {
    const pageSettings = seoSettings.products;
    const siteSettings = data.siteSettings;
    const contactSettings = data.contactSettings;

    const title = pageSettings?.titleTemplate || `${siteSettings?.siteName || 'Optique'} - Premium Eyewear Collection`;
    const description = pageSettings?.descriptionTemplate || 
      `Discover our premium collection of eyewear, frames, and optical accessories${contactSettings?.city ? ` in ${contactSettings.city}` : ''}. Find the perfect style for you.`;

    return {
      title,
      description,
      keywords: pageSettings?.keywords || ['products', 'eyewear', 'frames', 'optique', 'collection', contactSettings?.city].filter(Boolean),
      openGraph: {
        title,
        description,
        images: seoSettings.ogImage ? [{ url: seoSettings.ogImage }] : undefined,
        type: 'website',
        url: `${this.baseUrl}/products`,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: seoSettings.ogImage ? [seoSettings.ogImage] : undefined,
      },
      robots: {
        index: seoSettings.robotsIndex,
        follow: seoSettings.robotsFollow,
      },
      alternates: {
        canonical: `${this.baseUrl}/products`,
      },
    };
  }

  private static generateProductMeta(data: PageData, seoSettings: SEOSettings): Metadata {
    const product = data.product;
    const pageSettings = seoSettings.productDetails;
    const siteSettings = data.siteSettings;

    if (!product) {
      return this.generateDefaultMeta(seoSettings);
    }

    const title = pageSettings?.titleTemplate
      ?.replace('{product_name}', product.name)
      ?.replace('{brand}', product.brand || '')
      ?.replace('{site_name}', siteSettings?.siteName || 'Optique')
      || `${product.name} - ${product.brand || 'Optique'}`;
    
    const description = pageSettings?.descriptionTemplate
      ?.replace('{product_name}', product.name)
      ?.replace('{brand}', product.brand || '')
      ?.replace('{description}', product.description || '')
      ?.replace('{price}', product.price?.toString() || '')
      || product.description || seoSettings.metaDescription;

    const productImages = product.images?.map((img: any) => ({
      url: `${this.baseUrl}${img.path}`,
      width: 1200,
      height: 630,
      alt: img.alt || product.name
    })) || (seoSettings.ogImage ? [{ url: seoSettings.ogImage }] : undefined);

    return {
      title,
      description,
      keywords: pageSettings?.keywords || [product.name, product.brand, 'eyewear', 'optique', 'frames'].filter(Boolean),
      openGraph: {
        title,
        description,
        images: productImages,
        type: 'website' as const,
        url: `${this.baseUrl}/products/${product.id}`,
        siteName: siteSettings?.siteName || 'Optique',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: productImages?.map((img: any) => img.url),
      },
      robots: {
        index: seoSettings.robotsIndex,
        follow: seoSettings.robotsFollow,
      },
      alternates: {
        canonical: `${this.baseUrl}/products/${product.id}`,
      },
    };
  }

  private static generateDefaultMeta(seoSettings: SEOSettings): Metadata {
    return {
      title: seoSettings.metaTitle || 'Optique - Your Vision, Our Expertise',
      description: seoSettings.metaDescription || 'Professional eyewear and optical services',
      robots: {
        index: seoSettings.robotsIndex,
        follow: seoSettings.robotsFollow,
      },
      alternates: {
        canonical: this.baseUrl,
      },
    };
  }
}
