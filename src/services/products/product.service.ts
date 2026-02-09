import  axiosClient  from '@/services/axiosClient';
import { Product } from "@/types/product.type"
import { PaginationMeta } from "@/types/pagination.type"

export interface GetProductsParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  categoies?: string;
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
  getProducts(params: GetProductsParams) {2
    return axiosClient.get<{
        success: boolean;   
        data: GetProductsResponse;
    }>("/products", {
      params,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
  }
}
