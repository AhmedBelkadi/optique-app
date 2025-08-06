import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Package, Users, HelpCircle, MessageSquare, Phone, Calendar } from "lucide-react";
import UserNavWrapper from "./UserNavWrapper";
import { getCurrentUser } from "@/features/auth/services/session";    

export default async function NavBar() {
    const user = await getCurrentUser();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600">
                Optique
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
              <Link href="/products" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                <Package className="w-4 h-4 mr-1" />
                Products
              </Link>
              <Link href="/about" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                <Users className="w-4 h-4 mr-1" />
                About Us
              </Link>
              <Link href="/faq" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                <HelpCircle className="w-4 h-4 mr-1" />
                FAQ
              </Link>
              <Link href="/testimonials" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                <MessageSquare className="w-4 h-4 mr-1" />
                Testimonials
              </Link>
              <Link href="/contact" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                <Phone className="w-4 h-4 mr-1" />
                Contact
              </Link>
              <Link href="/appointment" className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                <Calendar className="w-4 h-4 mr-1" />
                Book Appointment
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <UserNavWrapper user={user} />
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    )
}