export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  stock: number;
  minStock?: number;
  status: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK";
  image: string;
  images?: string[];
  featured: boolean;
  // General info
  sku?: string;
  barcode?: string;
  brand?: string;
  manufacturer?: string;
  weight?: string;
  dimensions?: string;
  description?: string;
  tags?: string[];
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
  createdAt?: string;
}
