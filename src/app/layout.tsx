import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Toaster from '@/components/common/Toaster';
import CSRFProvider from '@/components/common/CSRFProvider';
import ThemeProvider from '@/components/common/ThemeProvider';
import { getThemeSettings } from '@/features/settings/services/themeSettings';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Force dynamic rendering
export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: 'Optique - Your Vision, Our Expertise',
  description: 'Professional eyewear and optical services tailored to your unique needs. Experience the perfect blend of style, comfort, and precision.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch theme settings
  const themeSettingsResult = await getThemeSettings();
  const themeSettings = themeSettingsResult.data;

  return (
    <html lang="en">
      <body className={inter.className}>
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
