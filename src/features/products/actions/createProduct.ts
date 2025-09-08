'use server';

import { apiRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { validateCSRFToken } from '@/lib/csrf';
import { createProduct } from '@/features/products/services/createProduct';
import { saveImage, generateImageAlt, validateImage, deleteImage } from '@/lib/shared/utils/imageUploadUtils';
import { prisma } from '@/lib/prisma';
import { logError } from '@/lib/errorHandling';
import { getCurrentUser } from '@/features/auth/services/session';
import { requirePermission } from '@/lib/auth/authorization';
import { CreateProductState } from '@/types/api';
import { revalidatePath } from 'next/cache';

export async function createProductAction(prevState: CreateProductState, formData: FormData): Promise<CreateProductState> {
  try {
    // 🔐 AUTHENTICATION & AUTHORIZATION CHECK
    await requirePermission('products', 'create');

    // Get client identifier for rate limiting
    const identifier = await getClientIdentifier();
    
    // Apply rate limiting
    await apiRateLimit(identifier);
    
    // Validate CSRF token
    await validateCSRFToken(formData);
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const brand = formData.get('brand') as string;
    const reference = formData.get('reference') as string;
    const categoryIds = formData.getAll('categoryIds') as string[];

    // Create the product first
    const result = await createProduct({
      name,
      description,
      price: parseFloat(price),
      brand: brand || undefined,
      reference: reference || undefined,
      categoryIds,
    });

    if (result.success && result.data) {
      // Handle image uploads if any
      const imageFiles = formData.getAll('images') as File[];
      const uploadedImages: string[] = []; // Track uploaded files for cleanup
      
      if (imageFiles.length > 0) {
        try {
          // Validate all images first
          for (const file of imageFiles) {
            if (file && file.size > 0) {
              const validation = validateImage(file);
              if (!validation.isValid) {
                throw new Error(validation.error);
              }
            }
          }

          // Upload images and create database records in transaction
          await prisma.$transaction(async (tx) => {
            for (let i = 0; i < imageFiles.length; i++) {
              const file = imageFiles[i];
              if (file && file.size > 0) {
                const uploadResult = await saveImage(file, 'products', result.data!.id, i);
                uploadedImages.push(uploadResult.path);
                
                await tx.productImage.create({
                  data: {
                    productId: result.data!.id,
                    filename: uploadResult.filename,
                    path: uploadResult.path,
                    alt: generateImageAlt(result.data!.name, i),
                    order: i,
                  },
                });
              }
            }
          });
        } catch (imageError) {
          // Clean up uploaded files if transaction fails
          for (const imagePath of uploadedImages) {
            await deleteImage(imagePath);
          }
          
          logError(imageError as Error, { 
            action: 'createProduct', 
            productId: result.data.id,
            step: 'imageUpload' 
          });
          
          return {
            success: false,
            error: imageError instanceof Error ? imageError.message : 'Failed to upload images',
            fieldErrors: {},
            values: {
              name,
              description,
              price,
              brand,
              reference,
              categoryIds,
            },
          };
        }
      }

      try { revalidatePath('/products'); } catch {}
      return {
        success: true,
        error: '',
        fieldErrors: {},
        values: {
          name: '',
          description: '',
          price: '',
          brand: '',
          reference: '',
          categoryIds: [],
        },
        productId: result.data.id,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Failed to create product',
        fieldErrors: result.fieldErrors || {},
        values: {
          name,
          description,
          price,
          brand,
          reference,
          categoryIds,
        },
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
          description: formData.get('description') as string,
          price: formData.get('price') as string,
          brand: formData.get('brand') as string,
          reference: formData.get('reference') as string,
          categoryIds: formData.getAll('categoryIds') as string[],
        },
      };
    }
    
    // Handle CSRF errors
    if (error instanceof Error && error.name === 'CSRFError') {
      return {
        success: false,
        error: 'Échec de la validation de sécurité. Veuillez actualiser la page et réessayer.',
        fieldErrors: {},
        values: {
          name: '',
          description: '',
          price: '',
          brand: '',
          reference: '',
          categoryIds: []
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
          name: '',
          description: '',
          price: '',
          brand: '',
          reference: '',
          categoryIds: []
        }
      };
    }

    // Log and handle other errors
    logError(error as Error, { 
      action: 'createProduct',
      formData: {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        brand: formData.get('brand'),
        reference: formData.get('reference'),
        categoryIds: formData.getAll('categoryIds'),
      }
    });
    
    return {
      success: false,
      error: 'An unexpected error occurred while creating the product. Please try again.',
      fieldErrors: {},
      values: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: formData.get('price') as string,
        brand: formData.get('brand') as string,
        reference: formData.get('reference') as string,
        categoryIds: formData.getAll('categoryIds') as string[],
      },
    };
  }
} 