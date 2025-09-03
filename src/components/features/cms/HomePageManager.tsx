'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Home, 
  Target, 
  Shield, 
  MapPin, 
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Image,
  MessageSquare
} from 'lucide-react';
import { HomeHero } from '@/features/cms/schema/homeHeroSchema';
import { HomeValues } from '@/features/home/schema/homeValuesSchema';
import { HomeWhatsAppCTA } from '@/features/cms/schema/homeWhatsAppCTASchema';

import HomeHeroForm from './HomeHeroForm';
import HomeWhatsAppCTAForm from './HomeWhatsAppCTAForm';
import { HomeValuesManager } from './HomeValuesManager';


interface HomePageManagerProps {
  hero: HomeHero | null;
  homeValues: HomeValues[];
  whatsAppCTA: HomeWhatsAppCTA | null;
  contactSettings: any;
}

export default function HomePageManager({
  hero,
  homeValues,
  whatsAppCTA,
  contactSettings
}: HomePageManagerProps) {
  const [activeTab, setActiveTab] = useState('overview');







  const getCompletionStatus = () => {
    const totalSections = 4;
    let completedSections = 0;
    
    if (hero) completedSections++;
    if (homeValues.length > 0) completedSections++;
    if (whatsAppCTA) completedSections++;
    if (contactSettings) completedSections++;
    
    return {
      completed: completedSections,
      total: totalSections,
      percentage: Math.round((completedSections / totalSections) * 100)
    };
  };

  const status = getCompletionStatus();



  return (
    <div className="space-y-6">
      {/* Page Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="w-5 h-5 text-primary" />
            <span>Home Page Overview</span>
          </CardTitle>
          <CardDescription>
            Manage all aspects of your home page content and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Page Completion</span>
                <span className="text-sm text-muted-foreground">{status.percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${status.percentage}%` }}
                />
              </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors">
                <div className="text-2xl font-bold text-primary mb-2">
                  {hero ? <CheckCircle className="w-8 h-8 mx-auto text-green-600" /> : <AlertCircle className="w-8 h-8 mx-auto text-amber-600" />}
                </div>
                <div className="text-sm font-medium">Hero Section</div>
                <div className="text-xs text-muted-foreground">
                  {hero ? 'Configured' : 'Not configured'}
                </div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {homeValues.length > 0 ? `${homeValues.length}` : '0'}
                </div>
                <div className="text-sm font-medium">Valeurs/Features</div>
                <div className="text-xs text-muted-foreground">
                  {homeValues.length > 0 ? 'Configured' : 'Not configured'}
                </div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {whatsAppCTA ? <CheckCircle className="w-8 h-8 mx-auto text-green-600" /> : <AlertCircle className="w-8 h-8 mx-auto text-amber-600" />}
                </div>
                <div className="text-sm font-medium">WhatsApp CTA</div>
                <div className="text-xs text-muted-foreground">
                  {whatsAppCTA ? 'Configured' : 'Not configured'}
                </div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {contactSettings ? <CheckCircle className="w-8 h-8 mx-auto text-green-600" /> : <AlertCircle className="w-8 h-8 mx-auto text-amber-600" />}
                </div>
                <div className="text-sm font-medium">Contact Info</div>
                <div className="text-xs text-muted-foreground">
                  {contactSettings ? 'Configured' : 'Not configured'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Common tasks for managing your home page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 justify-start hover:bg-primary/5 hover:border-primary/30 transition-all"
              onClick={() => setActiveTab('hero')}
            >
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-left">
                  <div className="font-medium">Edit Hero Section</div>
                  <div className="text-sm text-muted-foreground">
                    Update the main title, subtitle, and call-to-action buttons
                  </div>
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 justify-start hover:bg-primary/5 hover:border-primary/30 transition-all"
              onClick={() => setActiveTab('values')}
            >
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-left">
                  <div className="font-medium">Manage Values & Features</div>
                  <div className="text-sm text-muted-foreground">
                    Add, edit, and reorder company values and features
                  </div>
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 justify-start hover:bg-primary/5 hover:border-primary/30 transition-all"
              onClick={() => setActiveTab('whatsapp')}
            >
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-left">
                  <div className="font-medium">Configure WhatsApp CTA</div>
                  <div className="text-sm text-muted-foreground">
                    Customize the WhatsApp call-to-action section
                  </div>
                </div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 justify-start hover:bg-primary/5 hover:border-primary/30 transition-all"
              onClick={() => setActiveTab('contact')}
            >
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-left">
                  <div className="font-medium">Setup Contact Info</div>
                  <div className="text-sm text-muted-foreground">
                    Configure contact information and location details
                  </div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border">
          <TabsTrigger 
            value="overview" 
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            <span>Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger 
            value="hero" 
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Image className="w-4 h-4" />
            <span>Section Hero</span>
          </TabsTrigger>
          <TabsTrigger 
            value="values" 
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Target className="w-4 h-4" />
            <span>Valeurs</span>
          </TabsTrigger>
          <TabsTrigger 
            value="whatsapp" 
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Summary</CardTitle>
              <CardDescription>
                Overview of your current home page content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Hero Section</h4>
                  {hero ? (
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Title:</strong> {hero.title}</p>
                      <p><strong>Subtitle:</strong> {hero.subtitle}</p>
                      <p><strong>Status:</strong> <Badge variant="default">Active</Badge></p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hero section configured</p>
                  )}
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Values & Features</h4>
                  {homeValues.length > 0 ? (
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Count:</strong> {homeValues.length} values</p>
                      <p><strong>Total:</strong> {homeValues.length}</p>
                      <p><strong>Status:</strong> <Badge variant="default">Configured</Badge></p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No values configured</p>
                  )}
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">WhatsApp CTA</h4>
                  {whatsAppCTA ? (
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Title:</strong> {whatsAppCTA.title}</p>
                      <p><strong>Phone:</strong> {whatsAppCTA.phoneNumber}</p>
                      <p><strong>Status:</strong> <Badge variant="default">Active</Badge></p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No WhatsApp CTA configured</p>
                  )}
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  {contactSettings ? (
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Status:</strong> <Badge variant="default">Configured</Badge></p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No contact info configured</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span>Hero Section</span>
              </CardTitle>
              <CardDescription>
                Customize the main hero section that appears at the top of your home page
              </CardDescription>
            </CardHeader>
            <CardContent>
                             <HomeHeroForm hero={hero} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="values" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Valeurs et Features</span>
              </CardTitle>
              <CardDescription>
                Gérez les valeurs et fonctionnalités mises en avant sur votre page d'accueil
              </CardDescription>
            </CardHeader>
            <CardContent>
                             <HomeValuesManager 
                 values={homeValues} 
               />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>WhatsApp CTA Section</span>
              </CardTitle>
              <CardDescription>
                Configurez la section d'appel à l'action WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
                             <HomeWhatsAppCTAForm 
                 initialData={whatsAppCTA || undefined}
               />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
