import axiosClient from "@/services/axiosClient";
import { DocumentItem, Document } from "@/types/document.type";
import { PaginationMeta } from "@/types/pagination.type";

export interface GetDocumentsParams {
  page: number;
  limit: number;
  search?: string;
  fileType?: "PDF" | "DOCX" | "XLSX" | "JPG" | "PNG" | "WEBP";
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  ownerId?: string;
}

export interface GetDocumentsResponse {
  items: Document[];
  meta: PaginationMeta;
}

export const documentService = {
  async getDocuments(params: GetDocumentsParams): Promise<GetDocumentsResponse> {
    const response = await axiosClient.get<{
      success: boolean;
      data: GetDocumentsResponse;
    }>("/documents", { params });
    if (!response.success) {
      throw new Error("Failed to fetch documents")
    }
    return response.data
  },

  async createDocument(payload: {
    file: File;
    title: string
  }) {
    const formData = new FormData()
    formData.append("file", payload.file)
    formData.append("title", payload.title)
    const response = await axiosClient.post<{ success: boolean; data: Document }>("/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (!response.success) {
      throw new Error("Failed to create document")
    }
    return response.data
  },

  async deleteDocument(id: string) {
    const response = await axiosClient.delete<{ success: boolean; data: Document }>(`/documents/${id}`)
    if (!response.success) {
      throw new Error("Failed to delete document")
    }
    return response.data
  },

  async getDocumentById(id: string) {
    const response = await axiosClient.get<{ success: boolean; data: DocumentItem }>(`/documents/${id}`)
    if (!response.success) {
      throw new Error("Failed to get document")
    }
    return response.data
  },

  async downloadDocument(id: string) {
    const response = await axiosClient.get(
      `/documents/${id}/download`,
      {
        responseType: "blob", // QUAN TRỌNG
      }
    );
    return response // trả blob
  }
}

