import axiosClient from "@/services/axiosClient";
import { PaginationMeta } from "@/types/pagination.type";
import { Category } from "@/types/category.type";

export interface GetCategoriesParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface GetCategoriesResponse {
  items: Category[];
  meta: PaginationMeta;
}

export const categoriesService = {
  async getCategories(params: GetCategoriesParams): Promise<GetCategoriesResponse> {
    const response = await axiosClient.get<{
      success: boolean;
      data: GetCategoriesResponse;
    }>("/categories", { params });
    if (!response.success) {
      throw new Error("Failed to fetch categories");
    }
    return response.data;
  },

  async createCategory(payload: {
    name: string;
    description?: string;
  }) {
    const response = await axiosClient.post("/categories", payload);
    return response.data;
  },

  async updateCategory(id: string, payload: Partial<{
    name: string;
    description?: string;
  }>) {
    const response = await axiosClient.put(`/categories/${id}`, payload);
    return response.data;
  },

  async deleteCategory(id: string) {
    const response = await axiosClient.delete(`/categories/${id}`);
    return response.data;
  },
}

