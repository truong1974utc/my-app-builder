export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: Category;
  basePrice: string;
  discountPrice: string;
  stockUnits: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  isFeatured: boolean;
  mainImage: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface ProductDetail extends Product {
  barcode?: string;
  description?: string;
  manufacturer?: string;
  weight?: string;
  dimensions?: string;
  metaTitle?: string;
  metaDescription?: string;
  lowStockAlert?: number;
  tags?: string[];
  images?: {
    id: string;
    url: string;
    isMain?: boolean;
  }[];
  categoryId: string;
  costPrice: number;
}

