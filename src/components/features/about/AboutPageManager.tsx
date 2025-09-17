'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, MessageSquare, Settings, User, FileText, Star, Target, MousePointer, CheckCircle, AlertCircle, Layers } from 'lucide-react';
import { AboutSection } from '@/features/about/shema/aboutSectionSchema';
import { AboutBenefit } from '@/features/about/shema/aboutBenefitSchema';
import AboutSectionsManager from './AboutSectionsManager';
import AboutBenefitsManager from './AboutBenefitsManager';

interface AboutPageManagerProps {
  aboutSections: AboutSection[];
  benefits: AboutBenefit[];
}

export default function AboutPageManager({
  aboutSections,
  benefits
}: AboutPageManagerProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Page Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5 text-primary" />
            <span>Vue d'ensemble de la page À Propos</span>
          </CardTitle>
          <CardDescription>
            Gérez tous les aspects du contenu de la page À Propos, y compris le héros, les sections, les avantages et le CTA, en un seul endroit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Complétion de la page</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(((aboutSections.length > 0 ? 1 : 0) + (benefits.length > 0 ? 1 : 0)) / 2 * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((aboutSections.length > 0 ? 1 : 0) + (benefits.length > 0 ? 1 : 0)) / 2 * 100}%` 
                  }}
                />
              </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors">
                <div className="text-2xl font-bold text-primary mb-2">
                  {aboutSections.length > 0 ? aboutSections.length : '0'}
                </div>
                <div className="text-sm font-medium">Sections de contenu</div>
                <div className="text-xs text-muted-foreground">
                  {aboutSections.length > 0 ? 'Configurer' : 'Non configuré'}
                </div>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {benefits.length > 0 ? benefits.length : '0'}
                </div>
                <div className="text-sm font-medium">Avantages</div>
                <div className="text-xs text-muted-foreground">
                  {benefits.length > 0 ? 'Configurer' : 'Non configuré'}
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
            <span>Actions rapides</span>
          </CardTitle>
          <CardDescription>
            Tâches courantes pour la gestion de la page À Propos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setActiveTab('sections')}
              className="p-4 border rounded-lg hover:bg-muted transition-colors text-left hover:border-primary/30"
            >
              <div className="font-medium">Gérer les sections de contenu</div>
              <div className="text-sm text-muted-foreground">
                Ajouter, modifier et réorganiser les sections de contenu
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('benefits')}
              className="p-4 border rounded-lg hover:bg-muted transition-colors text-left hover:border-primary/30"
            >
                <div className="font-medium">Gérer les avantages</div>
              <div className="text-sm text-muted-foreground">
                Ajouter, modifier et réorganiser les avantages et les fonctionnalités de l'entreprise
              </div>
            </button>
            

          </div>
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 border border-border">
          <TabsTrigger 
            value="overview" 
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            <span>Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger 
            value="sections" 
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Layers className="w-4 h-4" />
            <span>Sections</span>
          </TabsTrigger>
          <TabsTrigger 
            value="benefits" 
            className="flex items-center space-x-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Star className="w-4 h-4" />
            <span>Avantages</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Résumé du contenu</CardTitle>
              <CardDescription>
                Vue d'ensemble du contenu de la page À Propos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Sections de contenu</h4>
                  {aboutSections.length > 0 ? (
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Count:</strong> {aboutSections.length} sections</p>
                      <p><strong>Status:</strong> <Badge variant="default">Configured</Badge></p>
                    </div>
                  ) : (
                      <p className="text-sm text-muted-foreground">Aucune section de contenu configurée</p>
                  )}
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Avantages</h4>
                  {benefits.length > 0 ? (
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Count:</strong> {benefits.length} benefits</p>
                      <p><strong>Status:</strong> <Badge variant="default">Configured</Badge></p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucun avantage configuré</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>
                Tâches courantes pour la gestion de la page À Propos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('sections')}
                  className="p-4 border rounded-lg hover:bg-muted transition-colors text-left hover:border-primary/30"
                >
                  <div className="font-medium">Gérer les sections de contenu</div>
                  <div className="text-sm text-muted-foreground">
                    Ajouter, modifier et réorganiser les sections de contenu
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('benefits')}
                  className="p-4 border rounded-lg hover:bg-muted transition-colors text-left hover:border-primary/30"
                >
                  <div className="font-medium">Gérer les avantages</div>
                  <div className="text-sm text-muted-foreground">
                    Créer et organiser les cartes d'avantages avec des icônes et des descriptions
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('hero')}
                  className="p-4 border rounded-lg hover:bg-muted transition-colors text-left hover:border-primary/30"
                >
                  <div className="font-medium">Modifier la section héros</div>
                  <div className="text-sm text-muted-foreground">
                    Mettre à jour le titre et le sous-titre de la section héros
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('cta')}
                  className="p-4 border rounded-lg hover:bg-muted transition-colors text-left hover:border-primary/30"
                >
                  <div className="font-medium">Section CTA</div>
                  <div className="text-sm text-muted-foreground">
                    Personnaliser la section CTA pour encourager l'action
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sections de contenu</CardTitle>
              <CardDescription>
                Gérez les sections de contenu de votre page À Propos avec des titres, des contenus et des images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AboutSectionsManager aboutSections={aboutSections} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Section Avantages</CardTitle>
              <CardDescription>
                Gérez les cartes d'avantages qui mettent en valeur pourquoi les clients devraient choisir vos services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AboutBenefitsManager benefits={benefits} />
            </CardContent>
          </Card>
        </TabsContent>




      </Tabs>
    </div>
  );
}
