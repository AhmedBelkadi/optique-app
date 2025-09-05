import { Suspense } from 'react';
import { getAllHomeValuesAction } from '@/features/home/actions/getAllHomeValuesAction';
import { HomeValuesManager } from '@/components/features/cms/HomeValuesManager';
import AdminPageConfig from '@/components/features/admin/AdminPageConfig';
import { requirePermission } from '@/lib/auth/authorization';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // optional, stricter

export default async function HomePage() {
  // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
  await requirePermission('home', 'read');

  return (
    <>
      <AdminPageConfig
        title="Page d'Accueil"
        subtitle="Gérer les valeurs et avantages de la page d'accueil"
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Contenu', href: '/admin/content' },
          { label: 'Page d\'Accueil', href: '/admin/content/home' }
        ]}
        showSearch={false}
        showNotifications={true}
      />

      <Suspense fallback={<HomeValuesSkeleton />}>
        <HomeValuesContainer />
      </Suspense>
    </>
  );  
}

async function HomeValuesContainer() {
  const result = await getAllHomeValuesAction();
  
  if (!result.success) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Erreur lors du chargement des valeurs de la page d'accueil
        </p>
      </div>
    );
  }

  const homeValues = result.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Valeurs de la Page d'Accueil</h2>
          <p className="text-muted-foreground">
            Gérez les 3 cartes de valeurs affichées sur la page d'accueil
          </p>
        </div>
      </div>

      <HomeValuesManager values={homeValues} />
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">📝 Note</h3>
        <p className="text-sm text-muted-foreground">
          La section héro et le CTA WhatsApp sont maintenant du contenu statique en français. 
          Seules les 3 cartes de valeurs (Expertise, Qualité, Service) sont modifiables ici.
        </p>
      </div>
    </div>
  );
}

function HomeValuesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted rounded animate-pulse w-1/3"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
    </div>
  );
}
