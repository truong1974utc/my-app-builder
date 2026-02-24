import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "@/schemas/product.schema";

export const useProductForm = () => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      tags: [],
      isFeatured: false,
      lowStockAlert: 5,
      images: [],
    },
  });

  return form;
};
