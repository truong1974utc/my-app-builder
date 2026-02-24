import { useEffect, useState } from "react";
import { categoriesService } from "@/services/categories/categoriy.service";
import { Category } from "@/types/category.type";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoriesService.getCategories({
          page: 1,
          limit: 100,
        });

        if (res.success) {
          setCategories(res.data.items);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};
