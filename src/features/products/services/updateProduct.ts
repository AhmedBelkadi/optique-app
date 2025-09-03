import { prisma } from '@/lib/prisma';
import { UpdateProductInput, Product } from '../schema/productSchema';
import { productSchema } from '../schema/productSchema';
import { validateAndSanitizeProduct } from '@/lib/shared/utils/sanitize';
import { saveImage, generateImageAlt } from '@/lib/shared/utils/serverImageUpload';
import { unlink } from 'fs/promises';
import { join } from 'path';

export interface UpdateProductResult {
  success: boolean;
  data?: Product;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function updateProduct(id: string, productData: UpdateProductInput): Promise<UpdateProductResult> {
  try {
    // Check if product exists and is not deleted
    const existingProduct = await prisma.product.findFirst({
      where: { id, isDeleted: false },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!existingProduct) {
      return {
        success: false,
        error: 'Produit non trouvé',
      };
    }

    // Prepare update data
    const updateData: any = {};
    
    if (productData.name !== undefined) {
      updateData.name = productData.name;
    }
    if (productData.description !== undefined) {
      updateData.description = productData.description;
    }
    if (productData.price !== undefined) {
      updateData.price = productData.price;
    }
    if (productData.brand !== undefined) {
      updateData.brand = productData.brand;
    }
    if (productData.reference !== undefined) {
      updateData.reference = productData.reference;
    }

    // Validate the update data
    const validation = productSchema.update.safeParse({
      ...updateData,
      categoryIds: productData.categoryIds || existingProduct.categories.map(pc => pc.categoryId),
    });
    
    if (!validation.success) {
      return {
        success: false,
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    // Update product with transaction to handle categories and images
    const product = await prisma.$transaction(async (tx) => {
      // Update basic product fields
      const updatedProduct = await tx.product.update({
        where: { id },
        data: updateData,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          images: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });

      // Update categories if provided
      if (productData.categoryIds !== undefined) {
        // Remove existing category relationships
        await tx.productCategory.deleteMany({
          where: { productId: id },
        });

        // Add new category relationships
        if (productData.categoryIds.length > 0) {
          await tx.productCategory.createMany({
            data: productData.categoryIds.map(categoryId => ({
              productId: id,
              categoryId,
            })),
          });
        }
      }

      // --- IMAGE MANAGEMENT ---
      // Remove images not in keepImageIds
      if (productData.keepImageIds) {
        // Get images to be deleted
        const imagesToDelete = await tx.productImage.findMany({
          where: {
            productId: id,
            id: { notIn: productData.keepImageIds },
          },
        });
        
        // Delete image files from disk
        for (const image of imagesToDelete) {
          try {
            const filePath = join(process.cwd(), 'public', image.path);
            await unlink(filePath);
          } catch (error) {
            console.error(`Failed to delete image file: ${image.path}`, error);
            // Continue with deletion even if file removal fails
          }
        }
        
        // Delete image records from database
        await tx.productImage.deleteMany({
          where: {
            productId: id,
            id: { notIn: productData.keepImageIds },
          },
        });
      }
      // Add new images
      if (productData.newImages && productData.newImages.length > 0) {
        let order = await tx.productImage.count({ where: { productId: id } });
        for (const file of productData.newImages) {
          const upload = await saveImage(file, id, order);
          await tx.productImage.create({
            data: {
              productId: id,
              filename: upload.filename,
              path: upload.path,
              alt: generateImageAlt(updateData.name || existingProduct.name, order),
              order,
            },
          });
          order++;
        }
      }

      // Fetch updated product with new categories and images
      return await tx.product.findUnique({
        where: { id },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          images: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    });

    if (!product) {
      return {
        success: false,
        error: 'Échec de la mise à jour du produit',
      };
    }

    // Transform the data to match our schema
    const transformedProduct: Product = {
      ...product,
      categories: product.categories.map(pc => ({
        id: pc.category.id,
        name: pc.category.name,
        description: pc.category.description,
      })),
      images: product.images.map(img => ({
        id: img.id,
        filename: img.filename,
        path: img.path,
        alt: img.alt,
        order: img.order,
      })),
    };

    return {
      success: true,
      data: transformedProduct,
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      success: false,
      error: 'Échec de la mise à jour du produit',
    };
  }
} 