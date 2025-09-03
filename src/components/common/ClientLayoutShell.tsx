'use client';

import { usePathname } from 'next/navigation';
import NavBar from '@/components/common/NavBar';
import Footer from '@/components/common/Footer';

interface ClientLayoutShellProps {
  children: React.ReactNode;
  siteSettings?: {
    siteName?: string;
    slogan?: string;
  } | null;
  contactSettings?: {
    address?: string;
    phone?: string;
    contactEmail?: string;
    openingHours?: string;
  } | null;
}

export default function ClientLayoutShell({
  children,
  siteSettings,
  contactSettings,
}: ClientLayoutShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isAuth = pathname.startsWith('/auth');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && !isAuth && <NavBar />}
      <main className="flex-1">{children}</main>
      {!isAdmin && !isAuth && <Footer siteSettings={siteSettings} contactSettings={contactSettings} />}
    </div>
  );
}
