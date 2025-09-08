import { MetadataRoute } from 'next';
import { getPublicProducts } from '@/features/products/services/getPublicProducts';
import { getPublicCategories } from '@/features/categories/services/getPublicCategories';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { 
      url: baseUrl, 
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    { 
      url: `${baseUrl}/about`, 
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    { 
      url: `${baseUrl}/contact`, 
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    },
    { 
      url: `${baseUrl}/appointment`, 
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9
    },
    { 
      url: `${baseUrl}/faq`, 
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7
    },
    { 
      url: `${baseUrl}/testimonials`, 
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7
    },
    { 
      url: `${baseUrl}/products`, 
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
  ];

  try {
    // Dynamic product pages
    const productsResult = await getPublicProducts({ limit: 1000 });
    const productPages: MetadataRoute.Sitemap = (productsResult.data || []).map(product => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8
    }));

    return [...staticPages, ...productPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
