import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Toaster from '@/components/common/Toaster';
import CSRFProvider from '@/components/common/CSRFProvider';
import ThemeProvider from '@/components/common/ThemeProvider';
import { getSEOSettings } from '@/features/settings/services/seoSettings';
import { getThemeSettings } from '@/features/settings/services/themeSettings';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Force dynamic rendering
export const dynamic = 'force-dynamic';


export async function generateMetadata(): Promise<Metadata> {
  const seoSettingsResult = await getSEOSettings();
  const seoSettings = seoSettingsResult.data;

  return {
    title: seoSettings?.metaTitle || 'Optique - Your Vision, Our Expertise',
    description: seoSettings?.metaDescription || 'Professional eyewear and optical services tailored to your unique needs. Experience the perfect blend of style, comfort, and precision.',
    openGraph: {
      title: seoSettings?.metaTitle || 'Optique - Your Vision, Our Expertise',
      description: seoSettings?.metaDescription || 'Professional eyewear and optical services tailored to your unique needs. Experience the perfect blend of style, comfort, and precision.',
      images: seoSettings?.ogImage ? [
        {
          url: seoSettings.ogImage,
          width: 1200,
          height: 630,
          alt: seoSettings?.metaTitle || 'Optique',
        }
      ] : undefined,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoSettings?.metaTitle || 'Optique - Your Vision, Our Expertise',
      description: seoSettings?.metaDescription || 'Professional eyewear and optical services tailored to your unique needs. Experience the perfect blend of style, comfort, and precision.',
      images: seoSettings?.ogImage ? [seoSettings.ogImage] : undefined,
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
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch settings from separate services
  const [seoSettingsResult, themeSettingsResult] = await Promise.all([
    getSEOSettings(),
    getThemeSettings(),
  ]);
  
  const seoSettings = seoSettingsResult.data;
  const themeSettings = themeSettingsResult.data;


  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google Analytics Script */}
        {seoSettings?.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${seoSettings.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${seoSettings.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}

        {/* Facebook Pixel Script */}
        {seoSettings?.facebookPixelId && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${seoSettings.facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {/* Facebook Pixel Noscript */}
        {seoSettings?.facebookPixelId && (
          <noscript>
            <img 
              height="1" 
              width="1" 
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${seoSettings.facebookPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}

        <ErrorBoundary>
          <CSRFProvider>
            <ThemeProvider
              primaryColor={themeSettings?.primaryColor}
              secondaryColor={themeSettings?.secondaryColor}
            />
            
            {/* Site content - maintenance mode and banners handled in specific layouts */}
            {children}
          </CSRFProvider>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
