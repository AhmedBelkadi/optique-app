import { Facebook, Instagram, MapPin, Phone, Mail, X } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
    <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
        <h3 className="text-lg font-semibold mb-4">Optique</h3>
        <p className="text-gray-400 mb-4">
            Your vision is our expertise. Professional eyewear and optical services for all your needs.
        </p>
        <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-white">
            <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
            <Instagram className="w-5 h-5" />
            </Link>
        </div>
        </div>
        
        <div>
        <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
        <ul className="space-y-2">
            <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
            <li><Link href="/products" className="text-gray-400 hover:text-white">Products</Link></li>
            <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
            <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
        </ul>
        </div>
        
        <div>
        <h4 className="text-sm font-semibold mb-4">Services</h4>
        <ul className="space-y-2">
            <li><Link href="/appointment" className="text-gray-400 hover:text-white">Book Appointment</Link></li>
            <li><Link href="/testimonials" className="text-gray-400 hover:text-white">Testimonials</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
        </ul>
        </div>
        
        <div>
        <h4 className="text-sm font-semibold mb-4">Contact Info</h4>
        <div className="space-y-2 text-gray-400">
            <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>123 Main St, City, State</span>
            </div>
            <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            <span>info@optique.com</span>
            </div>
        </div>
        </div>
    </div>
    
    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2024 Optique. All rights reserved.</p>
    </div>
    </div>
    </footer>
    )
}