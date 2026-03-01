import { z } from "zod";

/**
 * Validate + transform JSON string
 */
const jsonStringSchema = z
    .string()
    .min(1, "Configuration data is required")
    .refine((value) => {
        try {
            JSON.parse(value);
            return true;
        } catch {
            return false;
        }
    }, {
        message: "Invalid JSON format",
    })
    .transform((value) => JSON.parse(value));

/**
 * CREATE
 */
export const createSettingSchema = z.object({
    configKey: z
        .string()
        .min(1, "Configuration key is required")
        .min(3, "Configuration key must be at least 3 characters")
        .regex(
            /^[a-z0-9_]+$/,
            "Configuration key must be lowercase, no spaces, use underscore (e.g., system_maintenance_mode)"
        ),

    description: z
        .string()
        .min(1, "Description is required")
        .min(5, "Description must be at least 5 characters"),

    configData: jsonStringSchema,
});

/**
 * UPDATE
 */
export const updateSettingSchema = z.object({
    description: z
        .string()
        .min(1, "Description is required")
        .min(5, "Description must be at least 5 characters"),

    configData: jsonStringSchema,
});

/**
 * TYPES
 * ⚠ Sau transform → configData sẽ là object
 */
export type CreateSettingFormValues = z.infer<typeof createSettingSchema>;
export type UpdateSettingFormValues = z.infer<typeof updateSettingSchema>;