export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: {
    id: string;
    name: string;
  };
  basePrice: string;
  discountPrice: string;
  stockUnits: number;
  status: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK";
  isFeatured: boolean;
  mainImage: string;
  createdAt: string;
  barcode?: string;
  manufacturer?: string;
  weight?: string;
  dimensions?: string;
  description?: string;
  minStockLevel?: number;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  brand: string;
  manufacturer: string;
  weight?: string;
  dimensions?: string;
  description?: string;

  costPrice: number;
  sellingPrice: number;
  comparePrice?: number;
  stock: number;
  minStock?: number;

  metaTitle?: string;
  metaDescription?: string;
  slug?: string;

  featured: boolean;
  tags: string[];
}

