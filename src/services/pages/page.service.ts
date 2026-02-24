import axiosClient from '@/services/axiosClient';
import { ContentPage, CreatePagePayload, UpdatePagePayload } from "@/types/page.type";
import { PaginationMeta } from "@/types/pagination.type";

export interface GetPagesParams {
  page: number;
  limit: number;
  search?: string;
  status?: "PUBLISHED" | "DRAFT";
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface GetPagesResponse {
  items: ContentPage[];
  meta: PaginationMeta;
}

export const pagesService = {
  getPages(params: GetPagesParams) {
    return axiosClient.get<{
      success: boolean;
      data: GetPagesResponse;
    }>("/pages", {
      params,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
  },

  createPage(payload: CreatePagePayload) {
    return axiosClient.post<{
      success: boolean;
      data: ContentPage;
    }>("/pages", payload);
  },

  getPage(id: string) {
    return axiosClient.get<{
      success: boolean;
      data: ContentPage;
    }>(`/pages/${id}`);
  },

  getPageBySlug(slug: string) {
    return axiosClient.get<{
      success: boolean;
      data: ContentPage;
    }>(`/pages/slug/${slug}`);
  },

  updatePage(id: string, payload: UpdatePagePayload) {
    return axiosClient.put<{
      success: boolean;
      data: ContentPage;
    }>(`/pages/${id}`, payload);
  },

  deletePage(id: string) {
    return axiosClient.delete<{
      success: boolean;
    }>(`/pages/${id}`);
  },
};