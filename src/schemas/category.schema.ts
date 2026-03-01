import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
});

export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;