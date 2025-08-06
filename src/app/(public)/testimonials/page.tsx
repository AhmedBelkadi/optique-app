import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">What Our Patients Say</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Real experiences from our valued patients who trust us with their vision care.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <CardTitle className="flex items-center">
                  <Quote className="w-5 h-5 mr-2 text-indigo-600" />
                  Exceptional Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "Dr. Johnson and the entire team at Optique provided exceptional care during my recent visit. 
                  They took the time to explain everything clearly and helped me find the perfect frames. 
                  Highly recommend!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Sarah M.</p>
                    <p className="text-sm text-gray-500">Patient since 2020</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <CardTitle className="flex items-center">
                  <Quote className="w-5 h-5 mr-2 text-green-600" />
                  Professional & Caring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "The staff is incredibly professional and caring. They made my children feel comfortable 
                  during their eye exams, and the selection of frames for kids is excellent. 
                  We've been coming here for years."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Michael R.</p>
                    <p className="text-sm text-gray-500">Patient since 2018</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <CardTitle className="flex items-center">
                  <Quote className="w-5 h-5 mr-2 text-purple-600" />
                  Great Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "I love the variety of frames they carry. From designer brands to affordable options, 
                  there's something for everyone. The optical specialist helped me find the perfect style 
                  that suits my face shape."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Jennifer L.</p>
                    <p className="text-sm text-gray-500">Patient since 2021</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <CardTitle className="flex items-center">
                  <Quote className="w-5 h-5 mr-2 text-orange-600" />
                  Thorough Eye Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "The comprehensive eye exam was thorough and professional. They caught an early sign 
                  of a condition that could have been serious. I'm grateful for their attention to detail 
                  and care for my eye health."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">David K.</p>
                    <p className="text-sm text-gray-500">Patient since 2019</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <CardTitle className="flex items-center">
                  <Quote className="w-5 h-5 mr-2 text-indigo-600" />
                  Excellent Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "The entire staff is friendly and knowledgeable. They took the time to explain my 
                  options and helped me understand my prescription. The follow-up care has been excellent too."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Lisa T.</p>
                    <p className="text-sm text-gray-500">Patient since 2022</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <CardTitle className="flex items-center">
                  <Quote className="w-5 h-5 mr-2 text-green-600" />
                  Convenient & Reliable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "Convenient location, flexible hours, and reliable service. They always accommodate 
                  my schedule and the quality of their work is consistently excellent. 
                  I recommend them to everyone."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Robert P.</p>
                    <p className="text-sm text-gray-500">Patient since 2017</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600">
              Our commitment to excellence has earned us the trust of our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">5,000+</div>
              <p className="text-gray-600">Happy Patients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">20+</div>
              <p className="text-gray-600">Years of Experience</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">4.9</div>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <p className="text-gray-600">Patient Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Happy Patients
          </h2>
          <p className="text-xl mb-8">
            Experience the Optique difference for yourself. Book your appointment today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/appointment" className="bg-white text-indigo-600 px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors">
              Book Appointment
            </a>
            <a href="/contact" className="bg-transparent text-white px-6 py-3 rounded-md text-lg font-medium border border-white hover:bg-white hover:text-indigo-600 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 