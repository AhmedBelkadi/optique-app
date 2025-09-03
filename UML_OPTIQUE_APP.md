# 📊 UML - Modélisation de l'Application Optique Arinass
## Basé sur le Code Réel du Projet

---

## 📋 Informations Générales

| **Propriété** | **Valeur** |
|---------------|------------|
| **Nom du Projet** | Arinass Optique - Modélisation UML |
| **Date de Création** | Janvier 2025 |
| **Type de Document** | Spécifications UML basées sur le code |
| **Langue** | Français |
| **Cas d'Usage Principal** | Prise de Rendez-vous |
| **Base de Code** | Next.js 15 + Prisma + PostgreSQL |

---

## 🎯 Diagramme de Cas d'Usage - Prise de Rendez-vous

### **Acteurs Principaux**
- **Client** : Personne qui souhaite prendre un rendez-vous
- **Système** : Application Arinass Optique
- **Personnel** : Employé du magasin (User avec rôle staff)
- **Administrateur** : Gérant du magasin (User avec rôle admin)

### **Cas d'Usage Principal : Prendre un Rendez-vous**

#### **Acteur Principal** : Client
#### **Objectif** : Réserver un créneau pour une consultation optique

#### **Préconditions**
- Le client accède au site web (`/appointment`)
- Le système est opérationnel
- Les créneaux horaires sont configurés (9h-18h30, créneaux de 30min)
- Le statut "scheduled" existe dans AppointmentStatus

#### **Scénario Principal**
1. Le client accède à la page `/appointment`
2. Le client sélectionne une date (aujourd'hui + 3 mois max)
3. Le client choisit un créneau horaire (9h-18h30, créneaux 30min)
4. Le client sélectionne un motif (examen vue, essayage, etc.)
5. Le client saisit ses informations (nom, email, téléphone)
6. Le client confirme le rendez-vous
7. Le système vérifie les conflits horaires
8. Le système crée un Customer (nouveau ou existant)
9. Le système crée un Appointment avec statut "scheduled"
10. Le système envoie une confirmation

#### **Scénarios Alternatifs**
- **7a** : Conflit horaire → Message "Créneau non disponible"
- **8a** : Email déjà existant → Utilise le Customer existant
- **9a** : Erreur création → Message d'erreur et retry

#### **Post-conditions**
- Un Appointment est créé avec statut "scheduled"
- Un Customer est créé ou mis à jour
- Le créneau horaire est réservé
- Le client reçoit une confirmation

---

## 🏗️ Diagramme de Classes - Application Complète (Basé sur le Schéma Prisma)

### **Classes d'Authentification et Autorisation**

#### **User** (Table: users)
```
+ id: String (cuid)
+ name: String
+ email: String (unique)
+ password: String
+ phone: String?
+ isActive: Boolean (default: true)
+ createdAt: DateTime
+ updatedAt: DateTime
+ lastLoginAt: DateTime?
+ sessions: Session[]
+ userRoles: UserRole[]

+ login(email: String, password: String): Session
+ logout(): void
+ hasPermission(resource: String, action: String): Boolean
```

#### **Session** (Table: sessions)
```
+ id: String (cuid)
+ userId: String
+ token: String (unique)
+ encryptedData: String
+ expiresAt: DateTime
+ createdAt: DateTime
+ user: User

+ isValid(): Boolean
+ extend(): void
+ invalidate(): void
```

#### **Role** (Table: roles)
```
+ id: String (cuid)
+ name: String (unique) // "admin", "staff"
+ description: String?
+ isActive: Boolean (default: true)
+ createdAt: DateTime
+ updatedAt: DateTime
+ userRoles: UserRole[]
+ permissions: RolePermission[]
```

#### **Permission** (Table: permissions)
```
+ id: String (cuid)
+ name: String (unique)
+ description: String?
+ resource: String // "products", "appointments", "users"
+ action: String // "create", "read", "update", "delete"
+ isActive: Boolean (default: true)
+ createdAt: DateTime
+ updatedAt: DateTime
+ rolePermissions: RolePermission[]
```

#### **UserRole** (Table: user_roles)
```
+ id: String (cuid)
+ userId: String
+ roleId: String
+ assignedBy: String?
+ assignedAt: DateTime
+ user: User
+ role: Role
```

#### **RolePermission** (Table: role_permissions)
```
+ id: String (cuid)
+ roleId: String
+ permissionId: String
+ grantedAt: DateTime
+ grantedBy: String?
+ role: Role
+ permission: Permission
```

### **Classes de Gestion des Clients et Rendez-vous**

#### **Customer** (Table: customers)
```
+ id: String (cuid)
+ name: String
+ email: String
+ phone: String?
+ address: String?
+ notes: String?
+ createdAt: DateTime
+ updatedAt: DateTime
+ deletedAt: DateTime?
+ isDeleted: Boolean (default: false)
+ appointments: Appointment[]

+ createAppointment(data: AppointmentData): Appointment
+ updateInfo(newData: CustomerData): void
+ getAppointments(): List<Appointment>
```

#### **Appointment** (Table: appointments)
```
+ id: String (cuid)
+ customerId: String
+ title: String
+ description: String?
+ startTime: DateTime
+ endTime: DateTime
+ statusId: String
+ notes: String?
+ createdAt: DateTime
+ updatedAt: DateTime
+ deletedAt: DateTime?
+ isDeleted: Boolean (default: false)
+ customer: Customer
+ status: AppointmentStatus

+ confirm(): void
+ cancel(): void
+ reschedule(newStartTime: DateTime): void
+ addNotes(notes: String): void
```

#### **AppointmentStatus** (Table: appointment_statuses)
```
+ id: String (cuid)
+ name: String (unique) // "scheduled", "confirmed", "completed", "cancelled"
+ displayName: String
+ color: String (default: "#6b7280")
+ isActive: Boolean (default: true)
+ order: Int (default: 0)
+ description: String?
+ createdAt: DateTime
+ updatedAt: DateTime
+ appointments: Appointment[]
```

### **Classes de Gestion des Produits**

#### **Product** (Table: products)
```
+ id: String (cuid)
+ name: String
+ description: String
+ price: Float
+ brand: String?
+ reference: String? (unique)
+ createdAt: DateTime
+ updatedAt: DateTime
+ deletedAt: DateTime?
+ isDeleted: Boolean (default: false)
+ categories: ProductCategory[]
+ images: ProductImage[]

+ addCategory(category: Category): void
+ removeCategory(category: Category): void
+ addImage(image: ProductImage): void
+ softDelete(): void
```

#### **Category** (Table: categories)
```
+ id: String (cuid)
+ name: String (unique)
+ description: String?
+ image: String?
+ createdAt: DateTime
+ updatedAt: DateTime
+ deletedAt: DateTime?
+ isDeleted: Boolean (default: false)
+ products: ProductCategory[]

+ addProduct(product: Product): void
+ removeProduct(product: Product): void
+ softDelete(): void
```

#### **ProductCategory** (Table: product_categories)
```
+ id: String (cuid)
+ productId: String
+ categoryId: String
+ createdAt: DateTime
+ category: Category
+ product: Product
```

#### **ProductImage** (Table: product_images)
```
+ id: String (cuid)
+ filename: String
+ path: String
+ alt: String?
+ order: Int (default: 0)
+ createdAt: DateTime
+ productId: String
+ product: Product

+ updateOrder(newOrder: Int): void
+ delete(): void
```

### **Classes de Gestion CMS et Contenu**

#### **Testimonial** (Table: testimonials)
```
+ id: String (cuid)
+ name: String
+ message: String
+ rating: Int (default: 5)
+ source: String (default: "internal") // internal, facebook, google, trustpilot
+ externalId: String?
+ externalUrl: String?
+ externalData: Json?
+ title: String?
+ image: String?
+ isActive: Boolean (default: true)
+ isVerified: Boolean (default: false)
+ isSynced: Boolean (default: false)
+ lastSynced: DateTime?
+ syncStatus: String (default: "pending")
+ createdAt: DateTime
+ updatedAt: DateTime
+ deletedAt: DateTime?
+ isDeleted: Boolean (default: false)

+ verify(): void
+ sync(): void
+ activate(): void
+ deactivate(): void
```

#### **Banner** (Table: banners)
```
+ id: String (cuid)
+ text: String
+ startDate: DateTime
+ endDate: DateTime
+ isActive: Boolean (default: true)
+ createdAt: DateTime
+ updatedAt: DateTime

+ isCurrentlyActive(): Boolean
+ activate(): void
+ deactivate(): void
```

#### **AboutSection** (Table: about_sections)
```
+ id: String (cuid)
+ title: String
+ content: String
+ image: String?
+ order: Int (default: 0)
+ createdAt: DateTime
+ updatedAt: DateTime

+ updateOrder(newOrder: Int): void
+ updateContent(newContent: String): void
```

#### **AboutBenefit** (Table: about_benefits)
```
+ id: String (cuid)
+ title: String
+ description: String
+ highlight: String
+ icon: String // Icon name (e.g., "Eye", "Shield")
+ color: String // Tailwind color class
+ bgColor: String // Tailwind background color class
+ order: Int (default: 0)
+ createdAt: DateTime
+ updatedAt: DateTime

+ updateOrder(newOrder: Int): void
+ updateColors(newColor: String, newBgColor: String): void
```

#### **HomeValues** (Table: home_values)
```
+ id: String (cuid)
+ title: String
+ description: String
+ highlight: String
+ icon: String
+ order: Int (default: 0)
+ createdAt: DateTime
+ updatedAt: DateTime

+ updateOrder(newOrder: Int): void
+ updateContent(newTitle: String, newDescription: String): void
```

#### **FAQ** (Table: faqs)
```
+ id: String (cuid)
+ question: String
+ answer: String
+ order: Int (default: 0)
+ createdAt: DateTime
+ updatedAt: DateTime

+ updateOrder(newOrder: Int): void
+ updateContent(newQuestion: String, newAnswer: String): void
```

### **Classes de Configuration et Paramètres**

#### **SiteSettings** (Table: site_settings)
```
+ id: String (default: "singleton")
+ siteName: String?
+ slogan: String?
+ logoUrl: String?
+ heroBackgroundImg: String?
+ createdAt: DateTime
+ updatedAt: DateTime

+ updateSiteInfo(name: String, slogan: String): void
+ updateLogo(logoUrl: String): void
+ updateHeroBackground(backgroundImg: String): void
```

#### **ContactSettings** (Table: contact_settings)
```
+ id: String (default: "singleton")
+ contactEmail: String?
+ phone: String?
+ whatsapp: String?
+ address: String?
+ openingHours: String?
+ googleMapsApiKey: String?
+ whatsappChatLink: String?
+ googleMapEmbed: String?
+ googleMapLink: String?
+ instagramLink: String?
+ facebookLink: String?
+ createdAt: DateTime
+ updatedAt: DateTime

+ updateContactInfo(email: String, phone: String, address: String): void
+ updateSocialLinks(instagram: String, facebook: String): void
+ updateMapsSettings(apiKey: String, embed: String): void
```

#### **SEOSettings** (Table: seo_settings)
```
+ id: String (default: "singleton")
+ metaTitle: String?
+ metaDescription: String?
+ productMetaTitle: String?
+ productMetaDescription: String?
+ categoryMetaTitle: String?
+ categoryMetaDescription: String?
+ ogImage: String?
+ googleAnalyticsId: String?
+ facebookPixelId: String?
+ createdAt: DateTime
+ updatedAt: DateTime

+ updateMetaTags(title: String, description: String): void
+ updateAnalytics(gaId: String, fbPixelId: String): void
```

#### **ThemeSettings** (Table: theme_settings)
```
+ id: String (default: "singleton")
+ primaryColor: String?
+ secondaryColor: String?
+ createdAt: DateTime
+ updatedAt: DateTime

+ updateColors(primary: String, secondary: String): void
+ resetToDefault(): void
```

#### **OperationalSettings** (Table: operational_settings)
```
+ id: String (default: "singleton")
+ maintenanceMode: Boolean (default: false)
+ createdAt: DateTime
+ updatedAt: DateTime

+ enableMaintenanceMode(): void
+ disableMaintenanceMode(): void
+ isMaintenanceMode(): Boolean
```

#### **ExternalAPISettings** (Table: external_api_settings)
```
+ id: String (cuid)
+ googlePlacesApiKey: String?
+ googlePlaceId: String?
+ facebookAccessToken: String?
+ facebookPageId: String?
+ enableGoogleSync: Boolean (default: false)
+ enableFacebookSync: Boolean (default: false)
+ createdAt: DateTime
+ updatedAt: DateTime

+ enableGoogleSync(): void
+ enableFacebookSync(): void
+ updateApiKeys(googleKey: String, facebookToken: String): void
```

### **Relations entre Classes (Basées sur Prisma)**
- **User** 1..* → **Session** (un utilisateur peut avoir plusieurs sessions)
- **User** *..* → **Role** (via UserRole - many-to-many)
- **Role** *..* → **Permission** (via RolePermission - many-to-many)
- **Customer** 1..* → **Appointment** (un client peut avoir plusieurs RDV)
- **Appointment** 1..1 → **AppointmentStatus** (chaque RDV a un statut)
- **Product** *..* → **Category** (via ProductCategory - many-to-many)
- **Product** 1..* → **ProductImage** (un produit peut avoir plusieurs images)
- **SiteSettings** 1..1 → **ContactSettings** (relation singleton)
- **SiteSettings** 1..1 → **SEOSettings** (relation singleton)
- **SiteSettings** 1..1 → **ThemeSettings** (relation singleton)
- **SiteSettings** 1..1 → **OperationalSettings** (relation singleton)

---

## 🔄 Diagramme de Séquence - Prise de Rendez-vous (Basé sur le Code)

### **Acteurs** : Client, AppointmentForm, createPublicAppointmentAction, createAppointment Service, Prisma DB

```
Client                    AppointmentForm        createPublicAppointmentAction    createAppointment Service    Prisma DB
  |                          |                          |                              |                          |
  |-- Accéder /appointment ->|                          |                              |                          |
  |                          |                          |                              |                          |
  |<-- Afficher formulaire --|                          |                              |                          |
  |                          |                          |                              |                          |
  |-- Sélectionner date ----->|                          |                              |                          |
  |-- Choisir créneau ------->|                          |                              |                          |
  |-- Sélectionner motif ---->|                          |                              |                          |
  |-- Saisir infos client --->|                          |                              |                          |
  |                          |                          |                              |                          |
  |-- Soumettre formulaire -->|                          |                              |                          |
  |                          |-- createPublicAppointmentAction(formData) ->|                              |                          |
  |                          |                          |                              |                          |
  |                          |                          |-- Valider CSRF token ------>|                          |
  |                          |                          |-- Rate limiting ----------->|                          |
  |                          |                          |-- Valider données --------->|                          |
  |                          |                          |                              |                          |
  |                          |                          |-- createAppointment(data) ->|                          |
  |                          |                          |                              |                          |
  |                          |                          |                              |-- Vérifier conflits horaires ->|
  |                          |                          |                              |<-- Pas de conflit -----------|
  |                          |                          |                              |                          |
  |                          |                          |                              |-- Créer/Utiliser Customer ->|
  |                          |                          |                              |<-- Customer créé/trouvé ----|
  |                          |                          |                              |                          |
  |                          |                          |                              |-- Créer Appointment ------->|
  |                          |                          |                              |<-- Appointment créé --------|
  |                          |                          |                              |                          |
  |                          |                          |<-- Succès -------------------|                          |
  |                          |                          |                              |                          |
  |                          |<-- Résultat succès ------|                              |                          |
  |<-- Confirmation succès --|                          |                              |                          |
  |                          |                          |                              |                          |
```

### **Messages Détaillés (Basés sur le Code Réel)**

#### **1. Accès à la page**
- **Client → AppointmentForm** : `GET /appointment`
- **AppointmentForm → Client** : Afficher ResponsiveAppointmentForm avec créneaux 9h-18h30

#### **2. Soumission du formulaire**
- **Client → AppointmentForm** : `POST` avec FormData (date, time, reason, customer info)
- **AppointmentForm → createPublicAppointmentAction** : `createPublicAppointmentAction(null, formData)`

#### **3. Validation et sécurité**
- **createPublicAppointmentAction → CSRF** : `validateCSRFToken(formData)`
- **createPublicAppointmentAction → RateLimit** : `apiRateLimit(identifier)`

#### **4. Création du rendez-vous**
- **createPublicAppointmentAction → createAppointment** : `createAppointment(formData)`
- **createAppointment → Prisma** : Vérifier conflits horaires
- **createAppointment → Prisma** : Créer Customer (nouveau ou existant)
- **createAppointment → Prisma** : Créer Appointment avec statut "scheduled"

#### **5. Retour de confirmation**
- **createAppointment → createPublicAppointmentAction** : `{ success: true, data: appointment }`
- **createPublicAppointmentAction → AppointmentForm** : Résultat de succès
- **AppointmentForm → Client** : Message de confirmation



---

## 🎯 Utilisation de ces Spécifications (Basées sur le Code Réel)

### **Pour Créer les Diagrammes**

#### **Outils Recommandés**
- **Lucidchart** : Diagrammes en ligne professionnels
- **Draw.io** : Gratuit et complet (recommandé)
- **PlantUML** : Code pour générer des diagrammes
- **Visio** : Microsoft Office
- **Miro** : Collaboration en équipe
- **Figma** : Design et diagrammes

#### **Étapes de Création**
1. **Copier** les spécifications ci-dessus (basées sur votre code)
2. **Choisir** l'outil de modélisation
3. **Créer** les diagrammes selon les spécifications exactes
4. **Valider** avec l'équipe de développement
5. **Itérer** selon les retours et évolutions du code

### **Types de Diagrammes à Créer (Basés sur votre Code)**
1. **Cas d'Usage** : Prise de RDV (détaillé ci-dessus)
2. **Classes** : Toutes les classes de l'application (détaillées ci-dessus)
3. **Séquence** : Flux createPublicAppointmentAction (détaillé ci-dessus)

### **Exemples de Code pour les Diagrammes**

#### **Schéma Prisma (Classes)**
```prisma
model Appointment {
  id          String            @id @default(cuid())
  customerId  String
  title       String
  startTime   DateTime
  endTime     DateTime
  statusId    String
  customer    Customer          @relation(fields: [customerId], references: [id])
  status      AppointmentStatus @relation(fields: [statusId], references: [id])
}
```

#### **Server Action (Séquence)**
```typescript
export async function createPublicAppointmentAction(prevState: any, formData: FormData) {
  await validateCSRFToken(formData);
  await apiRateLimit(identifier);
  const result = await createAppointment(data);
  return { success: true, data: result.data };
}
```

---

## 🎯 Conclusion

Ces spécifications UML sont **basées sur le code réel** de votre application Arinass Optique. Le document contient :

### **Contenu du Document**
- ✅ **Diagramme de Cas d'Usage** : Prise de rendez-vous détaillée
- ✅ **Diagramme de Classes** : Toutes les classes de l'application (25+ modèles)
- ✅ **Diagramme de Séquence** : Flux de prise de rendez-vous complet

### **Avantages de cette Approche**
- ✅ **Précision** : Basé sur le code existant, pas sur des suppositions
- ✅ **Cohérence** : Reflète exactement votre architecture Next.js 15 + Prisma
- ✅ **Utilité** : Permet de créer des diagrammes fidèles à l'implémentation
- ✅ **Maintenance** : Facile à mettre à jour avec les évolutions du code

### **Prochaines Étapes**
1. **Sélectionner** l'outil de modélisation (Draw.io recommandé)
2. **Créer** les diagrammes selon ces spécifications exactes
3. **Valider** avec l'équipe de développement
4. **Itérer** et améliorer selon les besoins
5. **Maintenir** la cohérence avec les évolutions du code

### **Fichiers de Référence dans votre Projet**
- **Schéma DB** : `prisma/schema.prisma`
- **Actions RDV** : `src/features/appointments/actions/`
- **Services RDV** : `src/features/appointments/services/`
- **Composants RDV** : `src/components/features/appointments/`
- **Page RDV** : `src/app/(public)/appointment/page.tsx`

---

**Document rédigé par** : Assistant IA Claude  
**Date** : Janvier 2025  
**Version** : 3.0 (Classes complètes + Séquence RDV)  
**Statut** : Prêt pour modélisation UML précise
