import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "@/components/dialogs/ProductDialog";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { Pagination } from "@/components/common/Pagination";
import { useToast } from "@/hooks/use-toast";
import { Product, ProductDetail } from "@/types/product.type";

import { useProductQuery } from "@/hooks/products/useProduct";
import { useCategories } from "@/hooks/category/useCategory";
import { productsService } from "@/services/products/product.service";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { PaginationLimit } from "@/enums/pagination.enum";
import { categoriesService } from "@/services/categories/categoriy.service";
import { Category } from "@/types/category.type";
import { Input } from "@/components/ui/input";
import { CreateProductFormValues } from "@/schemas/product.schema";

const ProductManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchValue, 500);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || PaginationLimit.TEN;
  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = searchParams.get("sortOrder") as "ASC" | "DESC" | undefined;
  const status = searchParams.get("status") || undefined;
  const promotion = searchParams.get("promotion") || undefined;
  const minPrice = searchParams.get("minPrice") || undefined;
  const maxPrice = searchParams.get("maxPrice") || undefined;
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let change = false;
    if (!params.get("page")) {
      params.set("page", "1");
      change = true;
    }
    if (!params.get("limit")) {
      params.set("limit", String(PaginationLimit.TEN));
      change = true;
    }
    if (change) {
      setSearchParams(params);
    }
  }, [searchParams]);

  useEffect(() => {
    updateURL({ search: debouncedSearch });
  }, [debouncedSearch]);

  const handleFiltersChange = (filters: any) => {
    const params: Record<string, any> = {};

    // category
    if (filters.categories && filters.categories !== "all") {
      params.categories = filters.categories;
    } else {
      params.categories = undefined;
    }

    // status
    if (filters.status && filters.status !== "all") {
      params.status = filters.status;
    } else {
      params.status = undefined;
    }

    // promotion
    if (filters.promotion && filters.promotion !== "all") {
      params.promotion = filters.promotion;
    } else {
      params.promotion = undefined;
    }

    if (filters.minPrice) {
      params.minPrice = filters.minPrice;
    } else {
      params.minPrice = undefined;
    }

    if (filters.maxPrice) {
      params.maxPrice = filters.maxPrice;
    } else {
      params.maxPrice = undefined;
    }

    // SORT MAPPING
    switch (filters.sortBy) {
      case "all":
        params.sortBy = undefined;
        params.sortOrder = undefined;
        break;
      case "newest":
        params.sortBy = "createdAt";
        params.sortOrder = "DESC";
        break;
      case "price_asc":
        params.sortBy = "price";
        params.sortOrder = "ASC";
        break;
      case "price_desc":
        params.sortBy = "price";
        params.sortOrder = "DESC";
        break;
      case "stock_asc":
        params.sortBy = "stock";
        params.sortOrder = "ASC";
        break;
      case "stock_desc":
        params.sortBy = "stock";
        params.sortOrder = "DESC";
        break;
      case "name_asc":
        params.sortBy = "name";
        params.sortOrder = "ASC";
        break;
      case "name_desc":
        params.sortBy = "name";
        params.sortOrder = "DESC";
        break;
    }

    updateURL(params);
  };

  const fetchProducts = async () => {
    try {
      const res = await productsService.getProducts(searchParams as any);
      setProducts(res.items);
      setMeta(res.meta);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      // setLoading(false);
    }
  };
  useEffect(() => {
    if (!page || !limit) return;
    fetchProducts();
  }, [searchParams.toString()]);

  const fetchCategories = async () => {
    try {
      const res = await categoriesService.getCategories({ page: 1, limit: 1000 });
      setCategories(res.items);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  const { toast } = useToast();

  /** ---------------- DIALOG STATE ---------------- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<ProductDetail | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductDetail | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  /** ---------------- CRUD HANDLERS ---------------- */
  const handleAddProduct = () => {
    setDialogMode("create");
    setProductToEdit(null);
    setDialogOpen(true);
  };

  const handleEditProduct = async (product: ProductDetail) => {
    try {
      const detail = await productsService.getProductById(product.id);
      setDialogMode("edit");
      setProductToEdit(detail);
      setDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch product detail", error);
    }
  };

  const handleViewProduct = (product: ProductDetail) => {
    setViewingProduct(product);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await productsService.deleteProduct(productToDelete?.id || "");
      toast({
        title: "Product deleted",
        description: `${productToDelete?.name} deleted successfully.`,
      });
      await fetchProducts();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const updateURL = (updates: Record<string, any>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // reset page khi filter thay đổi
    if (!("page" in updates)) {
      params.set("page", "1");
    }

    if (!("limit" in updates)) {
      params.set("limit", String(PaginationLimit.TEN));
    }

    setSearchParams(params);
  };

  const handleProductSubmit = async (data: any) => {
    try {
      if (dialogMode === "create") {
        console.log("🚀 SUBMIT DATA:", data);
        await productsService.createProduct(data);
        toast({
          title: "Product created",
          description: `${data.name} created successfully.`,
        });
      }

      if (dialogMode === "edit" && productToEdit) {
        console.log("🚀 SUBMIT DATA:", data);
        await productsService.updateProduct(productToEdit.id, data);
        toast({
          title: "Product updated",
          description: `${data.name} updated successfully.`,
        });
      }

      await fetchProducts();
      setDialogOpen(false);
      setProductToEdit(null);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
      console.log("ERROR", error);
    }
  }

  if (viewingProduct) {
    return (
      <div className="animate-fade-in">
        <PageHeader
          title="Product Management"
          description="System management and detailed overview."
        />

        <ProductDetailView
          product={viewingProduct}
          onBack={() => setViewingProduct(null)}
          onEdit={() => handleEditProduct(viewingProduct)}
          onDelete={() => handleDeleteClick(viewingProduct)}
        />

        <ProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleProductSubmit}
          product={productToEdit}
          mode={dialogMode}
          categories={categories}
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Product"
          itemName={productToDelete?.name || ""}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    );
  }

  /** ---------------- MAIN VIEW ---------------- */
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Product Management"
        description="System management and detailed overview."
      />

      {/* Search and Add */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button className="gap-2" onClick={handleAddProduct}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <ProductFilters
        categories={categories}
        onFiltersChange={handleFiltersChange}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={handleViewProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found matching your criteria.
          </p>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={meta?.totalPages || 1}
        onPageChange={handlePageChange}
      />

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleProductSubmit}
        product={productToEdit}
        mode={dialogMode}
        categories={categories}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Product"
        itemName={productToDelete?.name || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ProductManagement;
