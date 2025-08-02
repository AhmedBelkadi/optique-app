import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { getCurrentUser } from '@/features/auth/services/session';
import UserNav from '@/components/common/UserNav';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Toaster from '@/components/common/Toaster';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Optique - Product Management',
  description: 'A modern product management application built with Next.js 15',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link href="/" className="text-xl font-bold text-indigo-600">
                      Optique
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link href="/products" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                      Products
                    </Link>
                    <Link href="/categories" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                      Categories
                    </Link>
                    <Link href="/products/trash" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                      Trash
                    </Link>
                    {user ? (
                      <UserNav user={user} />
                    ) : (
                      <>
                        <Link href="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                          Login
                        </Link>
                        <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </nav>
            <main>{children}</main>
          </div>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
