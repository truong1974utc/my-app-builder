import { i, s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { z } from "zod";

export const productSchema = z
  .object({
    sku: z.string().regex(/^[A-Z]{3}-\d{3}-[A-Z]{2}$/),
    name: z.string().min(1, "Product name is required"),
    categoryId: z.string().min(1, "Category is required"),
    brand: z.string().min(1),
    manufacturer: z.string().min(1),

    tags: z.array(z.string()).min(1).max(8),

    basePrice: z.number().positive(),
    costPrice: z.number().positive(),
    discountPrice: z.number().optional(),

    stockUnits: z.number().min(0),
    lowStockAlert: z.number().default(5),

    images: z.array(z.any()).min(1, "At least 1 image required"),

    metaTitle: z.string().max(60),
    metaDescription: z.string().max(160),
    isFeatured: z.boolean().default(false),
  })
  .refine((data) => data.costPrice < data.basePrice, {
    message: "Cost price must be less than Base price",
    path: ["costPrice"],
  })
  .refine(
    (data) =>
      !data.discountPrice ||
      (data.discountPrice < data.basePrice &&
        data.discountPrice > data.costPrice),
    {
      message: "Invalid discount price",
      path: ["discountPrice"],
    }
  );

export type ProductFormValues = z.infer<typeof productSchema>;
