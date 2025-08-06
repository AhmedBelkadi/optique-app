import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Edit, Eye, EyeOff } from 'lucide-react';
import { getTestimonialById } from '@/features/testimonials/queries/getTestimonialById';
import { toggleTestimonialStatusAction } from '@/features/testimonials/actions/toggleTestimonialStatus';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TestimonialDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TestimonialDetailPage({ params }: TestimonialDetailPageProps) {
  const { id } = await params;
  
  const result = await getTestimonialById(id);
  
  if (!result.success || !result.data) {
    notFound();
  }

  const testimonial = result.data;

  return (
    <>
      <AdminPageConfig
        title={testimonial.name}
        subtitle="Testimonial Details"
        breadcrumbs={[
          { label: 'Testimonials', href: '/admin/testimonials' },
          { label: testimonial.name, href: `/admin/testimonials/${id}` }
        ]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="py-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
              <Link href="/admin/testimonials">
                <Button variant="ghost" size="sm" className="hover:bg-white/50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Testimonials
                </Button>
              </Link>
              
              <div className="flex gap-2">
                <form action={toggleTestimonialStatusAction.bind(null, testimonial.id)}>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="hover:bg-gray-50"
                  >
                    {testimonial.isActive ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Show
                      </>
                    )}
                  </Button>
                </form>
                
                <Link href={`/admin/testimonials/${id}/edit`}>
                  <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>

            {/* Testimonial Details */}
            <div className="grid gap-6">
              {/* Main Info Card */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      Customer Information
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge
                        variant={testimonial.isActive ? 'default' : 'secondary'}
                        className={testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {testimonial.isActive ? 'Published' : 'Hidden'}
                      </Badge>
                      {testimonial.isDeleted && (
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          Deleted
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-lg text-gray-900 mt-1">{testimonial.name}</p>
                    </div>
                    
                    {testimonial.title && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Title/Position</label>
                        <p className="text-gray-900 mt-1">{testimonial.title}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Message</label>
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-900 leading-relaxed">{testimonial.message}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Metadata Card */}
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Testimonial Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Created</label>
                      <p className="text-gray-900 mt-1">
                        {format(new Date(testimonial.createdAt), 'PPP')}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Updated</label>
                      <p className="text-gray-900 mt-1">
                        {format(new Date(testimonial.updatedAt), 'PPP')}
                      </p>
                    </div>
                    
                    {testimonial.image && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Image URL</label>
                        <p className="text-gray-900 mt-1 break-all">{testimonial.image}</p>
                      </div>
                    )}
                    
                    {testimonial.deletedAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Deleted</label>
                        <p className="text-gray-900 mt-1">
                          {format(new Date(testimonial.deletedAt), 'PPP')}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 