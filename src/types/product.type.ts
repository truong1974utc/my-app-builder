export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: Category;
  basePrice: string;
  discountPrice: string;
  stockUnits: number;
  status: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK";
  isFeatured: boolean;
  mainImage: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}
