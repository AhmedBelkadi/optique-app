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
            {navigationItems.map((item) => {
                return (
                    <Link 
                        key={item.href}
                        href={item.href} 
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group ${
                            isActive(item.href) ? 'text-primary' : 'text-gray-700 hover:text-primary'
                        }`}
                    >
                        <item.icon className={`w-4 h-4 mr-2 transition-colors duration-300 ${
                            isActive(item.href) 
                                ? 'text-primary'
                                : 'text-gray-700 group-hover:text-primary'
                        }`} />
                        {item.label}
                        {/* Hover underline effect */}
                        <div className={`absolute -bottom-1 left-3 right-3 h-0.5 transition-all duration-300 ${
                            isActive(item.href)
                                ? 'bg-primary'
                                : 'bg-primary scale-x-0 group-hover:scale-x-100'
                        }`}></div>
                    </Link>
                );
            })}
        </div>
    );
}
