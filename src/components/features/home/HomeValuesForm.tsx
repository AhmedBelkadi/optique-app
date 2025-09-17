"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActionState } from "react"
import { useCSRF } from "@/components/common/CSRFProvider"
import { HomeValuesFormData, homeValuesFormSchema, HomeValues } from "@/features/home/schema/homeValuesSchema"
import { createHomeValueAction } from "@/features/home/actions/createHomeValue"
import { updateHomeValueAction } from "@/features/home/actions/updateHomeValue"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save , ArrowLeft, Star, Shield } from "lucide-react"
import { toast } from "react-hot-toast"

interface HomeValuesFormProps {
  initialData?: HomeValuesFormData | HomeValues
  onCancel: () => void
  mode: "create" | "edit"
}

export default function HomeValuesForm({ 
  initialData, 
  onCancel, 
  mode 
}: HomeValuesFormProps) {
  const { csrfToken, isLoading: csrfLoading, error: csrfError } = useCSRF();

  // Action states for home values
  const [createState, createAction] = useActionState(createHomeValueAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {
      title: '',
      description: '',
      highlight: '',
      icon: '',

      order: 0
    },
    valueId: ''
  });

  const [updateState, updateAction] = useActionState(updateHomeValueAction, {
    success: false,
    error: '',
    fieldErrors: {},
    values: {},
    valueId: ''
  });

  const form = useForm({
    resolver: zodResolver(homeValuesFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      highlight: "",
      icon: "",

      order: 0,
    },
  })

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])

  // Handle create action state changes
  useEffect(() => {
    if (createState.success) {
      toast.success("Valeur créée avec succès");
      onCancel(); // Close the form
      window.location.reload(); // Refresh to show new data
    } else if (createState.error) {
      // Check for specific security validation errors
      if (createState.error.includes("Security validation failed") || createState.error.includes("CSRF")) {
        toast.error("Erreur de sécurité. Veuillez actualiser la page et réessayer.", {
          duration: 5000,
          icon: '🔒',
        });
        // Show a more helpful error message
        console.error("CSRF/Security validation failed. Token:", csrfToken);
      } else {
        toast.error(createState.error);
      }
    }
  }, [createState.success, createState.error, onCancel, csrfToken]);

  // Handle update action state changes
  useEffect(() => {
    if (updateState.success) {
      toast.success("Valeur mise à jour avec succès");
      onCancel(); // Close the form
      window.location.reload(); // Refresh to show updated data
    } else if (updateState.error) {
      // Check for specific security validation errors
      if (updateState.error.includes("Security validation failed") || updateState.error.includes("CSRF")) {
        toast.error("Erreur de sécurité. Veuillez actualiser la page et réessayer.", {
          duration: 5000,
          icon: '🔒',
        });
        // Show a more helpful error message
        console.error("CSRF/Security validation failed. Token:", csrfToken);
      } else {
        toast.error(updateState.error);
      }
    }
  }, [updateState.success, updateState.error, onCancel, csrfToken]);

  // Show loading state if CSRF is not ready
  if (csrfLoading) {
    return (
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground/60 border-2 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground">Chargement du jeton de sécurité...</p>
        </CardContent>
      </Card>
    );
  }

  if (csrfError || !csrfToken) {
    return (
      <Card className="border-0 shadow-sm bg-background/50 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="w-8 h-8 mx-auto mb-4 text-red-500">🔒</div>
          <p className="text-muted-foreground mb-4">
            {csrfError ? 'Erreur lors du chargement du jeton de sécurité.' : 'Jeton de sécurité non disponible.'}
          </p>
          <Button onClick={() => window.location.reload()} variant="default">
            Actualiser la page
          </Button>
        </CardContent>
      </Card>
    );
  }

  const resetToDefaults = () => {
    form.reset({
      title: "",
      description: "",
      highlight: "",
      icon: "",

      order: 0,
    })
    toast.success("Formulaire réinitialisé")
  }

  const resetToInitial = () => {
    if (initialData) {
      form.reset(initialData)
      toast.success("Valeurs initiales restaurées")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "create" ? "Ajouter une Valeur" : "Modifier la Valeur"}
          </h2>
          <p className="text-muted-foreground">
            {mode === "create" 
              ? "Créez une nouvelle valeur ou fonctionnalité pour votre page d'accueil"
              : "Modifiez les détails de cette valeur ou fonctionnalité"
            }
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={onCancel}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Détails de la Valeur</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
                                <form action={mode === "create" ? createAction : updateAction} className="space-y-6">


                           {/* Hidden form fields for server action */}
              <input type="hidden" name="csrf_token" value={csrfToken || ''} />
             {mode === "edit" && (
               <input type="hidden" name="id" value={(initialData as HomeValues)?.id || ''} />
             )}
             
             {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations de Base</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                                     <Input
                     id="title"
                     name="title"
                     defaultValue={form.getValues("title")}
                     placeholder="Ex: Qualité Premium"
                     className={form.formState.errors.title ? "border-destructive" : ""}
                   />
                   {form.formState.errors.title && (
                     <p className="text-sm text-destructive">
                       {form.formState.errors.title.message}
                     </p>
                   )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icône *</Label>
                                     <Input
                     id="icon"
                     name="icon"
                     defaultValue={form.getValues("icon")}
                     placeholder="Ex: Shield, Star, Heart"
                     className={form.formState.errors.icon ? "border-destructive" : ""}
                   />
                   {form.formState.errors.icon && (
                     <p className="text-sm text-destructive">
                       {form.formState.errors.icon.message}
                     </p>
                   )}
                   <p className="text-xs text-muted-foreground">
                     Nom de l'icône Lucide (ex: Shield, Star, Heart, etc.)
                   </p>
                 </div>
               </div>

               <div className="space-y-2">
                 <Label htmlFor="description">Description *</Label>
                 <Textarea
                   id="description"
                   name="description"
                   defaultValue={form.getValues("description")}
                   placeholder="Décrivez cette valeur ou fonctionnalité..."
                   rows={3}
                   className={form.formState.errors.description ? "border-destructive" : ""}
                 />
                 {form.formState.errors.description && (
                   <p className="text-sm text-destructive">
                     {form.formState.errors.description.message}
                   </p>
                 )}
               </div>

               <div className="space-y-2">
                 <Label htmlFor="highlight">Point Fort *</Label>
                 <Input
                   id="highlight"
                   name="highlight"
                   defaultValue={form.getValues("highlight")}
                   placeholder="Ex: Plus de 500 références"
                   className={form.formState.errors.highlight ? "border-destructive" : ""}
                 />
                 {form.formState.errors.highlight && (
                   <p className="text-sm text-destructive">
                     {form.formState.errors.highlight.message}
                   </p>
                 )}
                   <p className="text-xs text-muted-foreground">
                     Un point clé ou statistique à mettre en avant
                   </p>
                 </div>
               </div>

               {/* Settings */}
               <div className="space-y-4">
                 <h3 className="text-lg font-semibold">Paramètres</h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="order">Ordre d'affichage</Label>
                     <Input
                       id="order"
                       name="order"
                       type="number"
                       defaultValue={form.getValues("order")}
                       placeholder="0"
                       min="0"
                     />
                     <p className="text-xs text-muted-foreground">
                       Ordre d'affichage sur la page (0 = premier)
                     </p>
                   </div>

                   <div className="flex items-center space-x-2 pt-6">

                   </div>
                 </div>
               </div>

            {/* Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Aperçu</h3>
              
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {form.watch("title") || "Titre de la valeur"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {form.watch("description") || "Description de la valeur..."}
                    </p>
                    {form.watch("highlight") && (
                      <Badge variant="secondary" className="mt-2">
                        {form.watch("highlight")}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <Badge variant="default">
                      Actif
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex space-x-2">
                {initialData && (
                  <Button
                    type="button"
                    variant="default"
                    onClick={resetToInitial}
                  >
                    Restaurer
                  </Button>
                )}
                <Button
                  type="button"
                  variant="default"
                                     onClick={resetToDefaults}
                >
                  Réinitialiser
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
                  onClick={onCancel}
                >
                  Annuler
                </Button>
                                 <Button
                   type="submit"
                   className="min-w-[120px]"
                 >
                   <Save className="mr-2 h-4 w-4" />
                   {mode === "create" ? "Créer" : "Mettre à jour"}
                 </Button>
              </div>
            </div>
                     </form>
         </CardContent>
       </Card>

       {/* Help Section */}
       <Card>
         <CardHeader>
           <CardTitle className="text-sm text-muted-foreground">Aide en cas de problème</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-2 text-sm text-muted-foreground">
             <p>Si vous rencontrez des erreurs de sécurité :</p>
             <ul className="list-disc list-inside space-y-1 ml-4">
               <li>Actualisez la page et réessayez</li>
               <li>Vérifiez que vous êtes bien connecté</li>
               <li>Attendez que le jeton de sécurité soit chargé (indicateur vert)</li>
               <li>Contactez l'administrateur si le problème persiste</li>
             </ul>
           </div>
         </CardContent>
       </Card>
     </div>
   )
 }
