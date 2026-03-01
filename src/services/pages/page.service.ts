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
  async getPages(params: GetPagesParams): Promise<GetPagesResponse> {
    const response = await axiosClient.get<{ success: boolean; data: GetPagesResponse }>(
      "/pages",
      { params },
    );
    if (!response.success) {
      throw new Error("Failed to fetch pages");
    }
    return response.data;
  },

  async createPage(payload: {
    title: string;
    content: string;
    slug: string;
    status: "PUBLISHED" | "DRAFT";
    featuredImage: File
  }) {
    console.log("🟡 SERVICE PAYLOAD:", payload);
    console.log("🟡 featuredImage instanceof File:", payload.featuredImage instanceof File);
    console.log("🟡 featuredImage type:", typeof payload.featuredImage);
    const formData = new FormData()
    formData.append("title", payload.title)
    formData.append("content", payload.content)
    formData.append("slug", payload.slug)
    formData.append("status", payload.status)
    formData.append("featuredImage", payload.featuredImage)
    // 👇 LOG TOÀN BỘ FORMDATA
    console.log("🟢 FORMDATA CONTENT:");
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await axiosClient.post<{ success: boolean; data: ContentPage }>("/pages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    console.log("🟢 RAW RESPONSE:", response);
    if (!response.success) {
      console.log("🔴 RESPONSE SUCCESS FALSE:", response);
      throw new Error("Failed to create page")
    }

    return response.data
  },

  async updatePage(id: string, payload: {
    title?: string;
    content?: string;
    slug?: string;
    status?: "PUBLISHED" | "DRAFT";
    featuredImage?: File | string | null;
  }) {
    const formData = new FormData()
    if (payload.title) formData.append("title", payload.title)
    if (payload.content) formData.append("content", payload.content)
    if (payload.slug) formData.append("slug", payload.slug)
    if (payload.status) formData.append("status", payload.status)
    // ✅ CHỈ append nếu là File
    if (payload.featuredImage instanceof File) {
      formData.append("featuredImage", payload.featuredImage);
    }
    const response = await axiosClient.put<{ success: boolean; data: ContentPage }>(`/pages/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    if (!response.success) {
      throw new Error("Failed to update page")
    }
    return response.data
  },

  async deletePage(id: string) {
    const response = await axiosClient.delete<{ success: boolean; data: ContentPage }>(`/pages/${id}`)
    if (!response.success) {
      throw new Error("Failed to delete page")
    }
    return response.data
  },

  async getPageById(id: string) {
    const response = await axiosClient.get<{ success: boolean; data: ContentPage }>(`/pages/${id}`)
    if (!response.success) {
      throw new Error("Failed to get page")
    }
    return response.data
  },

  async getPageBySlug(slug: string) {
    const response = await axiosClient.get<{ success: boolean; data: ContentPage }>(`/pages/slug/${slug}`)
    if (!response.success) {
      throw new Error("Failed to get page")
    }
    return response.data
  },
}


// export const pagesService = {
//   getPages(params: GetPagesParams) {
//     return axiosClient.get<{
//       success: boolean;
//       data: GetPagesResponse;
//     }>("/pages", {
//       params,
//       headers: {
//         "Cache-Control": "no-cache",
//         Pragma: "no-cache",
//       },
//     });
//   },

//   createPage(payload: CreatePagePayload) {
//     return axiosClient.post<{
//       success: boolean;
//       data: ContentPage;
//     }>("/pages", payload);
//   },

//   getPage(id: string) {
//     return axiosClient.get<{
//       success: boolean;
//       data: ContentPage;
//     }>(`/pages/${id}`);
//   },

//   getPageBySlug(slug: string) {
//     return axiosClient.get<{
//       success: boolean;
//       data: ContentPage;
//     }>(`/pages/slug/${slug}`);
//   },

//   updatePage(id: string, payload: UpdatePagePayload) {
//     return axiosClient.put<{
//       success: boolean;
//       data: ContentPage;
//     }>(`/pages/${id}`, payload);
//   },

//   deletePage(id: string) {
//     return axiosClient.delete<{
//       success: boolean;
//     }>(`/pages/${id}`);
//   },
// };