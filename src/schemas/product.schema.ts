import { z } from "zod";

export const stockStatusEnum = z.enum([
  "IN_STOCK",
  "LOW_STOCK",
  "OUT_OF_STOCK",
]);

const skuRegex = /^[A-Z]{3}-\d{3}-[A-Z]{2}$/;

const generalInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required"),

  sku: z
    .string()
    .min(1, "SKU is required")
    .regex(
      skuRegex,
      "SKU format must be XXX-000-XX (e.g., APL-123-MB)",
    ),

  barcode: z.string().optional(),

  categoryId: z
    .string()
    .min(1, "Category is required"),

  brand: z
    .string()
    .min(1, "Brand is required"),

  manufacturer: z
    .string()
    .min(1, "Manufacturer is required"),

  weight: z.string().optional(),

  dimensions: z.string().optional(),

  description: z.string().optional(),

  tags: z
    .array(z.string().min(1))
    .min(1, "At least 1 tag is required")
    .max(8, "Maximum 8 tags allowed"),

  isFeatured: z.boolean(),
});

const pricingSchema = z
  .object({
    basePrice: z
      .number({ invalid_type_error: "Base price must be a number" })
      .min(0.01, "Base price is required"),

    costPrice: z
      .number({ invalid_type_error: "Cost price must be a number" })
      .min(0.01, "Cost price is required"),

    discountPrice: z
      .number({ invalid_type_error: "Discount price must be a number" })
      .optional(),

    stockUnits: z
      .number({ invalid_type_error: "Stock units must be a number" })
      .min(0, "Stock cannot be negative"),

    lowStockAlert: z
      .number()
      .min(0)
      .default(5),
  });

const mediaSchema = z.object({
  images: z
    .array(z.any())
    .min(1, "At least 1 image is required"),
});

const seoSchema = z.object({
  metaTitle: z
    .string()
    .max(60, "Meta title max 60 characters")
    .optional(),

  metaDescription: z
    .string()
    .max(160, "Meta description max 160 characters")
    .optional(),
});


export const createProductSchema = generalInfoSchema
  .merge(pricingSchema)
  .merge(mediaSchema)
  .merge(seoSchema);

export type CreateProductFormValues =
  z.infer<typeof createProductSchema>;

/* ================================
   UPDATE PRODUCT
================================ */

export const updateProductSchema =
  generalInfoSchema
    .merge(pricingSchema)
    .merge(mediaSchema)
    .merge(
      z.object({
        metaTitle: z
          .string()
          .min(1, "Meta title is required")
          .max(60),

        metaDescription: z
          .string()
          .min(1, "Meta description is required")
          .max(160),
      })
    );

export type UpdateProductFormValues =
  z.infer<typeof updateProductSchema>;