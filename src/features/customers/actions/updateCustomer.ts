'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { updateCustomer } from '@/features/customers/services/updateCustomer';
import { logError } from '@/lib/errorHandling';
import { requirePermission } from '@/lib/auth/authorization';
import { revalidatePath } from 'next/cache';
import { updateCustomerSchema, UpdateCustomerInput } from '@/features/customers/schema/customerSchema';

export async function updateCustomerAction(prevState: any, formData: FormData) {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('customers', 'update');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);

    // Extract form data
    const customerId = formData.get('customerId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const notes = formData.get('notes') as string;

    if (!customerId) {
      return {
        success: false,
        error: 'ID du client manquant',
        fieldErrors: {},
        values: { name, email, phone, address, notes }
      };
    }

    // Validate input data
    const validationResult = updateCustomerSchema.safeParse({
      name,
      email,
      phone: phone || undefined,
      address: address || undefined,
      notes: notes || undefined,
    });

    if (!validationResult.success) {
      return {
        success: false,
        error: 'Données invalides',
        fieldErrors: validationResult.error.flatten().fieldErrors,
        values: { name, email, phone, address, notes }
      };
    }

    // Update the customer
    const result = await updateCustomer(customerId, validationResult.data);

    if (result.success && result.data) {
      // Revalidate relevant paths
      revalidatePath('/admin/customers');
      revalidatePath(`/admin/customers/${customerId}`);
      revalidatePath('/admin');
      
      return {
        success: true,
        message: 'Client mis à jour avec succès !',
        data: result.data,
        fieldErrors: {},
        values: { name, email, phone, address, notes }
      };
    } else {
      return {
        success: false,
        error: result.error || 'Échec de la mise à jour du client',
        fieldErrors: {},
        values: { name, email, phone, address, notes }
      };
    }
  } catch (error) {
    // Handle rate limiting errors
    if (error instanceof Error && error.name === 'RateLimitError') {
      return {
        success: false,
        error: error.message,
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          address: formData.get('address') as string,
          notes: formData.get('notes') as string,
        }
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          address: formData.get('address') as string,
          notes: formData.get('notes') as string,
        }
      };
    }

    // Handle permission/authorization errors
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // This is a redirect error, likely due to permission issues
      return {
        success: false,
        error: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action. Veuillez contacter un administrateur.',
        fieldErrors: {},
        values: {
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          address: formData.get('address') as string,
          notes: formData.get('notes') as string,
        }
      };
    }

    // Log and handle other errors
    logError(error as Error, { 
      action: 'updateCustomer',
      customerId: formData.get('customerId'),
      formData: {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        notes: formData.get('notes'),
      }
    });
    
    return {
      success: false,
      error: 'Une erreur inattendue est survenue lors de la mise à jour du client. Veuillez réessayer.',
      fieldErrors: {},
      values: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        notes: formData.get('notes') as string,
      }
    };
  }
}