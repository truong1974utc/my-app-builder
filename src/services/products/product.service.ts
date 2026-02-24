import  axiosClient  from '@/services/axiosClient';
import { Product } from "@/types/product.type"
import { PaginationMeta } from "@/types/pagination.type"

export interface GetProductsParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  categories?: string | string[];
  status?: string;
  promotion?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface GetProductsResponse {
  items: Product[];
  meta: PaginationMeta;
}       

export const productsService = {
  getProducts(params: GetProductsParams) {
    const normalizedParams = { ...params } as any;

    if (Array.isArray((params as any).categories)) {
      normalizedParams.categories = (params as any).categories.join(",");
    }

    return axiosClient.get<{
      success: boolean;
      data: GetProductsResponse;
    }>("/products", {
      params: normalizedParams,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
  }
,

  createProduct(payload: any) {
    return axiosClient.post<{
      success: boolean;
      data: Product;
    }>("/products", payload);
  },

  getProduct(id: string) {
    return axiosClient.get<{
      success: boolean;
      data: Product;
    }>(`/products/${id}`);
  },

  updateProduct(id: string, payload: any) {
    return axiosClient.put<{
      success: boolean;
      data: Product;
    }>(`/products/${id}`, payload);
  },

  deleteProduct(id: string) {
    return axiosClient.delete<{
      success: boolean;
    }>(`/products/${id}`);
  },

  uploadProductImage(productId: string, formData: FormData) {
    return axiosClient.post<{
      success: boolean;
      data: any;
    }>(`/products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteProductImage(productId: string, imageId: string) {
    return axiosClient.delete<{
      success: boolean;
    }>(`/products/${productId}/images/${imageId}`);
  },
}
