'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Users, HelpCircle, MessageSquare, Phone } from "lucide-react";

export default function NavBarClient() {
    const pathname = usePathname();

    // Helper function to check if a link is active
    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    const navigationItems = [
        { href: '/', icon: Home, label: 'Accueil' },
        { href: '/products', icon: Package, label: 'Produits' },
        { href: '/about', icon: Users, label: 'À Propos' },
        { href: '/faq', icon: HelpCircle, label: 'FAQ' },
        { href: '/testimonials', icon: MessageSquare, label: 'Témoignages' },
        { href: '/contact', icon: Phone, label: 'Contact' },
    ];

    return (
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigationItems.map((item) => (
                <Link 
                    key={item.href}
                    href={item.href} 
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive(item.href) 
                            ? 'text-primary bg-primary/10 border border-primary/20' 
                            : 'text-foreground hover:text-primary hover:bg-muted/50'
                    }`}
                >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                </Link>
            ))}
        </div>
    );
}
