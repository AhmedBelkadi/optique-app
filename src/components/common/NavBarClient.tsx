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
            {navigationItems.map((item, index) => {
                const isSecondary = index % 2 === 1; // Alternate between primary and secondary styling
                return (
                    <Link 
                        key={item.href}
                        href={item.href} 
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group ${
                            isActive(item.href) 
                                ? isSecondary
                                    ? 'text-secondary bg-secondary/10 border border-secondary/20'
                                    : 'text-primary bg-primary/10 border border-primary/20'
                                : isSecondary
                                    ? 'text-foreground hover:text-secondary hover:bg-secondary/5'
                                    : 'text-foreground hover:text-primary hover:bg-primary/5'
                        }`}
                    >
                        <item.icon className={`w-4 h-4 mr-2 transition-colors duration-300 ${
                            isActive(item.href) 
                                ? isSecondary ? 'text-secondary' : 'text-primary'
                                : isSecondary ? 'group-hover:text-secondary' : 'group-hover:text-primary'
                        }`} />
                        {item.label}
                        {/* Hover underline effect */}
                        <div className={`absolute -bottom-1 left-3 right-3 h-0.5 transition-all duration-300 ${
                            isActive(item.href)
                                ? isSecondary ? 'bg-secondary' : 'bg-primary'
                                : isSecondary ? 'bg-secondary scale-x-0 group-hover:scale-x-100' : 'bg-primary scale-x-0 group-hover:scale-x-100'
                        }`}></div>
                    </Link>
                );
            })}
        </div>
    );
}
