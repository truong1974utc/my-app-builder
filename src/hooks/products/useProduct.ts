import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PaginationLimit } from "@/enums/pagination.enum";
import { productsService } from "@/services/products/product.service";

export const useProductQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /** ---------------- NORMALIZE URL ---------------- */
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let changed = false;

    if (!params.has("page")) {
      params.set("page", "1");
      changed = true;
    }
    if (!params.has("limit")) {
      params.set("limit", String(PaginationLimit.TEN));
      changed = true;
    }
    if (!params.has("sortBy")) {
      params.set("sortBy", "newest");
      changed = true;
    }

    if (changed) setSearchParams(params, { replace: true });
  }, [searchParams]);

  /** ---------------- PARSE QUERY ---------------- */
  const queryConfig = useMemo(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || PaginationLimit.TEN,
      search: searchParams.get("search") || "",
      categories: searchParams.get("categories") || "",
      status: searchParams.get("status") || "",
      promotion: searchParams.get("promotion") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sortKey: searchParams.get("sortBy") || "newest",
    };
  }, [searchParams]);

  /** ---------------- MAP SORT ---------------- */
  const mapSort = (sortKey: string) => {
    switch (sortKey) {
      case "price_asc":
        return { sortBy: "basePrice", sortOrder: "ASC" };
      case "price_desc":
        return { sortBy: "basePrice", sortOrder: "DESC" };
      case "name_asc":
        return { sortBy: "name", sortOrder: "ASC" };
      case "name_desc":
        return { sortBy: "name", sortOrder: "DESC" };
      case "stock_asc":
        return { sortBy: "stockUnits", sortOrder: "ASC" };
      case "stock_desc":
        return { sortBy: "stockUnits", sortOrder: "DESC" };
      case "oldest":
        return { sortBy: "createdAt", sortOrder: "ASC" };
      case "newest":
      default:
        return { sortBy: "createdAt", sortOrder: "DESC" };
    }
  };

  /** ---------------- BUILD API PARAMS ---------------- */
  const apiParams = useMemo(() => {
    const params: any = {
      page: queryConfig.page,
      limit: queryConfig.limit,
    };

    if (queryConfig.search) params.search = queryConfig.search;
    if (queryConfig.categories)
      params.categories = queryConfig.categories.split(",");
    if (queryConfig.status) params.status = queryConfig.status;
    if (queryConfig.promotion) params.promotion = queryConfig.promotion;
    if (queryConfig.minPrice)
      params.minPrice = Number(queryConfig.minPrice);
    if (queryConfig.maxPrice)
      params.maxPrice = Number(queryConfig.maxPrice);

    const sort = mapSort(queryConfig.sortKey);
    params.sortBy = sort.sortBy;
    params.sortOrder = sort.sortOrder;

    return params;
  }, [queryConfig]);

  /** ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productsService.getProducts(apiParams);
        if (res.success) {
          setProducts(res.data.items);
          setMeta(res.data.meta);
        }
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiParams]);

  /** ---------------- UPDATE URL ---------------- */
  const updateURL = (newParams: Record<string, any>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (!newParams.hasOwnProperty("page")) {
      params.set("page", "1");
    }

    setSearchParams(params);
  };

  return {
    products,
    meta,
    loading,
    queryConfig,
    updateURL,
  };
};
