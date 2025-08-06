import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  ShoppingCart,
  Star,
  Heart
} from 'lucide-react';

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Our Product Catalog</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover our premium selection of eyewear, frames, and optical accessories. 
            Find the perfect style that matches your personality and vision needs.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10 w-full md:w-80"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="men">Men's Frames</SelectItem>
                  <SelectItem value="women">Women's Frames</SelectItem>
                  <SelectItem value="kids">Kids' Frames</SelectItem>
                  <SelectItem value="sunglasses">Sunglasses</SelectItem>
                  <SelectItem value="contacts">Contact Lenses</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="budget">Under $100</SelectItem>
                  <SelectItem value="mid">$100 - $300</SelectItem>
                  <SelectItem value="premium">$300+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Product Card 1 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Classic Round Frames</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">Timeless round frames perfect for any occasion</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">$199</span>
                  <Button size="sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Card 2 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Modern Square Frames</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.6</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">Contemporary square frames with clean lines</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">$249</span>
                  <Button size="sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Card 3 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Aviator Sunglasses</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.9</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">Classic aviator style with UV protection</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">$179</span>
                  <Button size="sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Card 4 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Wire Rim Frames</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.7</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">Lightweight wire frames for everyday comfort</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">$129</span>
                  <Button size="sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Card 5 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Cat Eye Frames</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.5</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">Elegant cat eye frames for a sophisticated look</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">$219</span>
                  <Button size="sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Card 6 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Contact Lens Kit</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-3">Complete contact lens care solution</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">$89</span>
                  <Button size="sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-xl mb-8">
            Our optical specialists are here to help you find the perfect frames. 
            Book a consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Eye className="w-4 h-4 mr-2" />
              Book Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
              <Package className="w-4 h-4 mr-2" />
              View All Products
            </Button>
          </div>
      </div>
      </section>
    </div>
  );
} 