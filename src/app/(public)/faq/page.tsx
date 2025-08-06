import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Eye, Glasses, Clock, Shield } from 'lucide-react';

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Find answers to common questions about our services, appointments, and eye care.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-indigo-600" />
                  How often should I get an eye exam?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Adults should have a comprehensive eye exam every 1-2 years, depending on age and risk factors. 
                  Children should have their first exam at 6 months, then at 3 years, and annually after starting school.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Glasses className="w-5 h-5 mr-2 text-green-600" />
                  What types of frames do you carry?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We carry a wide selection of frames including designer brands, budget-friendly options, 
                  and specialty frames for sports and safety. Our collection includes metal, plastic, 
                  and titanium frames in various styles and colors.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  How long does it take to get new glasses?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Standard lenses typically take 5-7 business days. Premium lenses like progressives 
                  or specialty coatings may take 7-10 business days. We also offer same-day service 
                  for basic prescriptions when possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-orange-600" />
                  Do you offer warranties on frames and lenses?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, we offer a comprehensive warranty program. Frames come with a 1-year warranty, 
                  and lenses include scratch-resistant coating and anti-reflective treatment warranties. 
                  We also provide free adjustments and minor repairs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-indigo-600" />
                  What insurance plans do you accept?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We accept most major vision insurance plans including VSP, EyeMed, Davis Vision, 
                  and many others. We also work with medical insurance for eye health exams. 
                  Contact us to verify your specific coverage.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-green-600" />
                  Can I use my old prescription to order new glasses?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We recommend getting a new eye exam if your prescription is over 1-2 years old, 
                  as vision can change over time. However, we can use your current prescription 
                  if it's recent and you're comfortable with it.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Glasses className="w-5 h-5 mr-2 text-purple-600" />
                  Do you offer contact lens fittings?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, we provide comprehensive contact lens fittings and evaluations. This includes 
                  soft lenses, rigid gas permeable lenses, and specialty lenses for conditions 
                  like astigmatism and presbyopia.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-orange-600" />
                  What are your hours of operation?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We are open Monday through Friday from 9:00 AM to 6:00 PM, 
                  Saturday from 9:00 AM to 4:00 PM, and closed on Sundays. 
                  We also offer extended hours by appointment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our team is here to help. Contact us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-colors">
              Contact Us
            </a>
            <a href="/appointment" className="bg-white text-indigo-600 px-6 py-3 rounded-md text-lg font-medium border border-indigo-600 hover:bg-indigo-50 transition-colors">
              Book Appointment
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 