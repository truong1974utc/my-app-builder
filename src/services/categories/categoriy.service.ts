import axiosClient from "@/services/axiosClient";
import { PaginationMeta } from "@/types/pagination.type";

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

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
  getCategories(params: GetCategoriesParams) {
    return axiosClient.get<{
      success: boolean;
      data: {
        items: Category[];
        meta: PaginationMeta;
      };
    }>("/categories", { params });
  },

  createCategory(payload: { name: string; description?: string }) {
    return axiosClient.post("/categories", payload);
  },

  updateCategory(
    id: string,
    payload: Partial<{
      name: string;
      description: string;
    }>,
  ) {
    return axiosClient.put(`/categories/${id}`, payload);
  },

  deleteCategory(id: string) {
    return axiosClient.delete(`/categories/${id}`);
  },
};
