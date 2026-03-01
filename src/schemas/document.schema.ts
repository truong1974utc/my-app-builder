import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
];

export const createDocumentSchema = z.object({
    title: z.string().min(1, "Document title is required"),

    file: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, "Maximum file size is 5MB")
        .refine(
            (file) => ACCEPTED_FILE_TYPES.includes(file.type),
            "Only .pdf, .docx, .xlsx, .jpg, .jpeg, .png are allowed"
        ),
});

export type CreateDocumentFormValues = z.infer<typeof createDocumentSchema>;