'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
    Home, 
    Package, 
    Users, 
    HelpCircle, 
    MessageSquare, 
    Phone, 
    X,
    Menu,
    Calendar
} from 'lucide-react';

export default function ResponsiveNavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

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
        <>
            {/* Mobile Menu Button */}
            <Button
                variant="ghost"
                size="sm"
                className="p-2 md:hidden"
                onClick={toggleMenu}
                aria-label="Toggle mobile menu"
                aria-expanded={isMenuOpen}
            >
                {isMenuOpen ? (
                    <X className="w-5 h-5" />
                ) : (
                    <Menu className="w-5 h-5" />
                )}
            </Button>

            {/* Mobile Navigation Menu */}
            <div className={`fixed inset-0 top-16 bg-background/95 backdrop-blur-sm z-50 md:hidden transition-all duration-300 ${
                isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}>
                <div className="px-4 py-6 space-y-2">
                    {navigationItems.map((item, index) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMenu}
                            className={`flex items-center px-4 py-4 rounded-lg text-lg font-medium transition-all duration-200 transform ${
                                isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                            } ${
                                isActive(item.href)
                                    ? 'text-primary bg-primary/10 border border-primary/20'
                                    : 'text-foreground hover:text-primary hover:bg-muted/50'
                            }`}
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <item.icon className="w-6 h-6 mr-4" />
                            {item.label}
                        </Link>
                    ))}
                    
                    {/* Mobile CTA Button */}
                    <div className="pt-4 border-t border-border/50">
                        <Link
                            href="/appointment"
                            onClick={closeMenu}
                            className="flex items-center justify-center w-full px-4 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors duration-200"
                        >
                            <Calendar className="w-6 h-6 mr-3" />
                            Prendre Rendez-vous
                        </Link>
                    </div>
                </div>
            </div>

            {/* Backdrop for mobile menu */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={closeMenu}
                />
            )}
        </>
    );
}
