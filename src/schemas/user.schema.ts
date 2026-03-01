import { z } from "zod";

export const roleEnum = z.enum(["ADMIN", "SUPER_ADMIN"]);
export const statusEnum = z.enum(["ACTIVE", "INACTIVE"]);

export const createUserSchema = z.object({
    fullName: z
        .string()
        .min(1, "Full name is required")
        .min(3, "Full name must be at least 3 characters"),

    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .min(1, "Password is required"),

    role: roleEnum,
    status: statusEnum,
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    fullName: z
        .string()
        .min(1, "Full name is required")
        .min(3, "Full name must be at least 3 characters"),

    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .min(1, "Password is required"),

    role: roleEnum,
    status: statusEnum,
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;