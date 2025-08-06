'use client';

import { useEffect, useRef, useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { deleteProductAction } from '@/features/products/actions/deleteProduct';
import { Product } from '@/features/products/schema/productSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Tag,
  DollarSign,
  Package,
  Hash,
  Clock
} from 'lucide-react';
import Image from 'next/image';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const previousIsPending = useRef(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [state, formAction, isPending] = useActionState(deleteProductAction, {
    success: false,
    error: '',
  });

  // Handle delete success/error
  useEffect(() => {
    if (previousIsPending.current && !isPending) {
      if (state.success) {
        toast.success('Product deleted successfully!');
        router.push('/admin/products');
      } else if (state.error) {
        toast.error(state.error || 'Failed to delete product');
      }
    }
    previousIsPending.current = isPending;
  }, [isPending, state.success, state.error, router]);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      const formData = new FormData();
      formData.append('productId', product.id);
      formAction(formData);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" py-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span>/</span>
          <button
            onClick={() => router.push('/admin/products')}
            className="hover:text-gray-700 transition-colors"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-indigo-600" />
                  <span>Product Images</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {product.images && product.images.length > 0 ? (
                  <div className="space-y-4">
                    {/* Main Image Display */}
                    <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={product.images[currentImageIndex].path}
                        alt={product.images[currentImageIndex].alt || `${product.name} - Image ${currentImageIndex + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      
                      {/* Navigation Arrows */}
                      {product.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Navigation */}
                    {product.images.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {product.images.map((image, index) => (
                          <button
                            key={image.id}
                            onClick={() => goToImage(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              index === currentImageIndex
                                ? 'border-indigo-500 shadow-md'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Image
                              src={image.path}
                              alt={image.alt || `${product.name} - Thumbnail ${index + 1}`}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Image Counter */}
                    <div className="text-center text-sm text-gray-500">
                      {currentImageIndex + 1} of {product.images.length}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">No images available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Hash className="w-4 h-4" />
                    <span>ID: {product.id}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Updated {new Date(product.updatedAt).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isPending}
                  variant="destructive"
                  className="shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>

            {/* Product Details Cards */}
            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Price</label>
                      <div className="flex items-center space-x-1 mt-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">
                          {product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    {product.brand && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Brand</label>
                        <p className="text-lg text-gray-900 mt-1">{product.brand}</p>
                      </div>
                    )}
                  </div>

                  {product.reference && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reference</label>
                      <p className="text-lg text-gray-900 mt-1">{product.reference}</p>
                    </div>
                  )}

                  {product.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-gray-900 mt-1 leading-relaxed">{product.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-indigo-600" />
                    <span>Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {product.categories && product.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {product.categories.map((category) => (
                        <Badge
                          key={category.id}
                          variant="secondary"
                          className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
                        >
                          {category.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No categories assigned</p>
                  )}
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span>Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Created</span>
                    <span className="text-sm text-gray-900">
                      {new Date(product.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Last Updated</span>
                    <span className="text-sm text-gray-900">
                      {new Date(product.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 