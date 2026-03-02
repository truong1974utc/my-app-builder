import axiosClient from '@/services/axiosClient';
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
  async getProducts(params: GetProductsParams): Promise<GetProductsResponse> {
    const response = await axiosClient.get<{
      success: boolean;
      data: GetProductsResponse;
    }>("/products", {
      params,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    if (!response.success) {
      throw new Error("Failed to fetch products");
    }
    return response.data;
  },

  async createProduct(payload: {
    sku: string;
    barcode: string;
    name: string;
    description: string;
    categoryId: string;
    brand: string;
    manufacturer: string;
    weight: string;
    dimensions: string;
    tags: string[];
    isFeatured: boolean;
    basePrice: number;
    costPrice: number;
    discountPrice: number;
    stockUnits: number;
    lowStockAlert: number;
    metaTitle: string;
    metaDescription: string;
    images: File[];
  }) {
    const formData = new FormData();

    formData.append("sku", payload.sku);
    formData.append("barcode", payload.barcode);
    formData.append("name", payload.name);
    formData.append("description", payload.description || "");
    formData.append("categoryId", payload.categoryId);
    formData.append("brand", payload.brand);
    formData.append("manufacturer", payload.manufacturer);
    formData.append("weight", payload.weight || "");
    formData.append("dimensions", payload.dimensions || "");

    payload.tags.forEach(tag => {
      formData.append("tags", tag);
    });

    formData.append("isFeatured", String(payload.isFeatured));
    formData.append("basePrice", String(payload.basePrice));
    formData.append("costPrice", String(payload.costPrice));
    if (payload.discountPrice && payload.discountPrice > 0) {
      formData.append("discountPrice", String(payload.discountPrice));
    }
    formData.append("stockUnits", String(payload.stockUnits));
    formData.append("lowStockAlert", String(payload.lowStockAlert));

    formData.append("metaTitle", payload.metaTitle || "");
    formData.append("metaDescription", payload.metaDescription || "");

    payload.images.forEach(file => {
      formData.append("images", file);
    });

    try {
      const response = await axiosClient.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async updateProduct(id: string, payload: {
    sku: string,
    barcode: string,
    name: string,
    description: string,
    categoryId: string,
    brand: string,
    manufacturer: string,
    weight: string,
    dimensions: string,
    tags: string[],
    isFeatured: boolean,
    basePrice: number,
    costPrice: number,
    discountPrice: number,
    stockUnits: number,
    lowStockAlert: number,
    metaTitle: string,
    metaDescription: string,
    images: string[],
  }) {
    const response = await axiosClient.put(`/products/${id}`, payload);
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  },

  async getProductById(id: string) {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  async deleteProductImage(productId: string, imageId: string) {
    try {
      const response = await axiosClient.delete(
        `/products/${productId}/images/${imageId}`
      );

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async uploadProductImages(productId: string, files: File[]) {
    const formData = new FormData();

    files.forEach(file => {
      formData.append("images", file);
    });

    try {
      const response = await axiosClient.post(
        `/products/${productId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
}

