import axiosClient from "@/services/axiosClient";
import { DocumentItem } from "@/types/document.type";
import { PaginationMeta } from "@/types/pagination.type";

export interface GetDocumentsParams {
  page: number;
  limit: number;
  search?: string;
  fileType?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  ownerId?: string;
}

export interface GetDocumentsResponse {
  items: DocumentItem[];
  meta: PaginationMeta;
}

export const documentService = {
  getDocuments(params: GetDocumentsParams) {
    return axiosClient.get<{
      success: boolean;
      data: GetDocumentsResponse;
    }>("/documents", {
      params,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
  },

  uploadDocument(formData: FormData) {
    return axiosClient.post<{
      success: boolean;
      data: DocumentItem;
    }>("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getDocument(id: string) {
    return axiosClient.get<{
      success: boolean;
      data: DocumentItem;
    }>(`/documents/${id}`);
  },

  updateDocument(id: string, payload: { title: string }) {
    return axiosClient.put<{
      success: boolean;
      data: DocumentItem;
    }>(`/documents/${id}`, payload);
  },

  deleteDocument(id: string) {
    return axiosClient.delete<{
      success: boolean;
    }>(`/documents/${id}`);
  },

  downloadDocument(id: string) {
    return axiosClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
  },
};
