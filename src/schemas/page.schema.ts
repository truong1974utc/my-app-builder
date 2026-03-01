import { z } from "zod";

/* =========================
   ENUM
========================= */

export const pageStatusEnum = z.enum(["PUBLISHED", "DRAFT"]);

/* =========================
   HELPER: slug sanitize
========================= */

const slugSanitize = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-")        // spaces -> hyphen
        .replace(/-+/g, "-");        // remove duplicate hyphen

/* =========================
   CREATE PAGE
========================= */

export const createPageSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required"),

    content: z
        .string()
        .optional(),

    slug: z
        .string()
        .min(1, "Slug is required")
        .transform(slugSanitize),

    status: pageStatusEnum,

    featuredImage: z
        .union([
            z.instanceof(File),
            z.string(),
            z.null()
        ])
        .optional()
});

export type CreatePageFormValues = z.infer<typeof createPageSchema>;

/* =========================
   UPDATE PAGE
========================= */

export const updatePageSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required"),

    content: z
        .string()
        .optional(),

    slug: z
        .string()
        .min(1, "Slug is required")
        .transform(slugSanitize),

    status: pageStatusEnum,

    featuredImage: z
        .union([
            z.instanceof(File),
            z.string(),
            z.null()
        ])
        .optional()
});

export type UpdatePageFormValues = z.infer<typeof updatePageSchema>;