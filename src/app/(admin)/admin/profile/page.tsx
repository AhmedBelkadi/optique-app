import { getCurrentUser } from '@/features/auth/services/session';

import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Eye, Settings, Shield } from 'lucide-react';
import { ProfilePreview } from '@/components/features/users/ProfilePreview';
import { PasswordChangeForm } from '@/components/features/users/PasswordChangeForm';
import { ProfileForm } from '@/components/features/users/ProfileForm';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Erreur d'authentification</h1>
            <p className="text-slate-600 mt-2">Vous devez être connecté pour accéder à cette page.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="py-8 space-y-8">
        {/* Enhanced Header */}
        <div className="text-center space-y-4">
          <AdminPageConfig
            title="Mon Profil"
            subtitle="Gérez vos informations personnelles et votre mot de passe"
            breadcrumbs={[
              { label: 'Tableau de bord', href: '/admin' },
              { label: 'Mon Profil', href: '/admin/profile' },
            ]}
          />
          
          {/* Welcome Message */}
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 text-primary rounded-full">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">
                Bienvenue, {user.name} ! Gérez votre compte en toute sécurité
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Enhanced Profile Preview - Left Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <ProfilePreview user={user} />
          </div>

          {/* Enhanced Profile Forms - Right Side */}
          <div className="xl:col-span-3">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-slate-50 to-blue-50/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-800">Paramètres du Compte</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">
                      Personnalisez votre profil et sécurisez votre compte
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <Tabs defaultValue="profile" className="w-full">
                  <div className="border-b border-border/50">
                    <TabsList className="grid w-full grid-cols-3 h-14 bg-transparent border-0 rounded-none">
                      <TabsTrigger 
                        value="profile" 
                        className="flex items-center space-x-3 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all duration-200"
                      >
                        <User className="h-4 w-4" />
                        <span className="font-medium">Profil</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="password" 
                        className="flex items-center space-x-3 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all duration-200"
                      >
                        <Lock className="h-4 w-4" />
                        <span className="font-medium">Sécurité</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="preview" 
                        className="flex items-center space-x-3 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary transition-all duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">Aperçu</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-8">
                    <TabsContent value="profile" className="space-y-6 mt-0">
                      <div className="space-y-6">
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-semibold text-slate-800">Informations du Profil</h3>
                          <p className="text-sm text-slate-600">
                            Mettez à jour vos informations personnelles
                          </p>
                        </div>
                        <ProfileForm user={user} />
                      </div>
                    </TabsContent>

                    <TabsContent value="password" className="space-y-6 mt-0">
                      <div className="space-y-6">
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-semibold text-slate-800">Sécurité du Compte</h3>
                          <p className="text-sm text-slate-600">
                            Changez votre mot de passe pour sécuriser votre compte
                          </p>
                        </div>
                        <PasswordChangeForm />
                      </div>
                    </TabsContent>

                    <TabsContent value="preview" className="space-y-6 mt-0">
                      <div className="space-y-6">
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-semibold text-slate-800">Aperçu du Profil</h3>
                          <p className="text-sm text-slate-600">
                            Visualisez toutes les informations de votre compte
                          </p>
                        </div>
                        <ProfilePreview user={user} showDetails />
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
