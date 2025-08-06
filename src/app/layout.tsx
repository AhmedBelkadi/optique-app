import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Toaster from '@/components/common/Toaster';
import CSRFProvider from '@/components/common/CSRFProvider';
import ThemeProvider from '@/components/common/ThemeProvider';
import { getThemeSettings } from '@/lib/settings';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Optique - Your Vision, Our Expertise',
  description: 'Professional eyewear and optical services',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch theme settings from database
  const themeSettings = await getThemeSettings();

  // Debug: Log theme settings in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Theme Settings:', themeSettings);
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <CSRFProvider>
            <ThemeProvider 
              primaryColor={themeSettings.primaryColor}
              secondaryColor={themeSettings.secondaryColor}
            />
            {children}
          </CSRFProvider>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
