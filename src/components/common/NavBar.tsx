import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar } from "lucide-react";
import UserNavWrapper from "./UserNavWrapper";
import { getCurrentUser } from "@/features/auth/services/session";
import NavBarClient from "./NavBarClient";
import ResponsiveNavBar from "./ResponsiveNavBar";
import { getSiteSettings } from "@/features/settings/services/siteSettings";

export default async function NavBar() {
    const siteSettingsResult = await getSiteSettings();
    const siteSettings = siteSettingsResult.success ? siteSettingsResult.data : null;
    const user = await getCurrentUser();

    return (
        <nav className="bg-background/95 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-50 relative">
            {/* Decorative gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo - Always visible */}
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-primary hover:text-secondary transition-colors duration-300 relative group">
                            {siteSettings?.siteName || 'Notre Boutique'}
                            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300"></div>
                        </Link>
                    </div>
                    
                    {/* Desktop Navigation - Hidden on mobile */}
                    <div className="hidden md:flex items-center">
                        <NavBarClient />
                    </div>
                    
                    {/* Right side buttons - Responsive */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-2">
                                <UserNavWrapper user={user} />
                                <Link href="/admin">
                                    <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                                        Admin
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            // Public users - responsive button
                            <div className="ml-6 flex items-center space-x-2">
                                <Link href="/appointment">
                                    <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300">
                                        <Calendar className="w-4 h-4 mr-1 md:mr-2" />
                                        <span className="hidden sm:inline">Prendre Rendez-vous</span>
                                        <span className="sm:hidden">RDV</span>
                                    </Button>
                                </Link>
                            </div>
                        )}
                        
                        {/* Mobile Menu Button - Only visible on mobile */}
                        <div className="md:hidden">
                            <ResponsiveNavBar />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}