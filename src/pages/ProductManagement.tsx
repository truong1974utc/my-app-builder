import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "@/components/dialogs/ProductDialog";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { Pagination } from "@/components/common/Pagination";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product.type";

import { useProductQuery } from "@/hooks/products/useProduct";
import { useCategories } from "@/hooks/category/useCategory";
import { productsService } from "@/services/products/product.service";

const ProductManagement = () => {
  const { toast } = useToast();

  /** ---------------- DATA HOOKS ---------------- */
  const { products, meta, loading, queryConfig, updateURL } =
    useProductQuery();

  const { categories } = useCategories();

  /** ---------------- DIALOG STATE ---------------- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] =
    useState<Product | null>(null);
  const [productToEdit, setProductToEdit] =
    useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] =
    useState<Product | null>(null);
  const [dialogMode, setDialogMode] =
    useState<"create" | "edit">("create");

  /** ---------------- URL HANDLERS ---------------- */
  const handleSearchChange = (value: string) =>
    updateURL({ search: value });

  const handleCategoryChange = (catId: string) =>
    updateURL({ categories: catId });

  const handleFiltersChange = (filters: any) =>
    updateURL({
      categories: filters.category,
      status: filters.status,
      promotion: filters.promotion,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortBy: filters.sortBy,
    });

  const handlePageChange = (page: number) =>
    updateURL({ page });

  /** ---------------- CRUD HANDLERS ---------------- */
  const handleAddProduct = () => {
    setDialogMode("create");
    setProductToEdit(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setDialogMode("edit");
    setProductToEdit(product);
    setDialogOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      const res = await productsService.deleteProduct(
        productToDelete.id
      );

      if (res.success) {
        toast({
          title: "Product deleted",
          description: `${productToDelete.name} removed successfully.`,
        });

        // Refetch bằng cách reload URL page hiện tại
        updateURL({ page: queryConfig.page });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete product.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleProductSubmit = async (data: any) => {
    try {
      const payload: any = {
        name: data.name,
        sku: data.sku,
        barcode: data.barcode,
        categoryId: data.category,
        brand: data.brand,
        manufacturer: data.manufacturer,
        weight: data.weight,
        dimensions: data.dimensions,
        description: data.description,
        basePrice: Number(data.sellingPrice),
        discountPrice: Number(data.comparePrice),
        stockUnits: Number(data.stock),
        minStockLevel: Number(data.minStock),
        isFeatured: data.featured,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        slug: data.slug,
        tags: data.tags,
      };

      Object.keys(payload).forEach((key) => {
        if (
          payload[key] === undefined ||
          payload[key] === null ||
          payload[key] === ""
        ) {
          delete payload[key];
        }
      });

      if (dialogMode === "create") {
        const res = await productsService.createProduct(payload);
        if (res.success) {
          toast({
            title: "Product created",
            description: `${res.data.name} created successfully.`,
          });
        }
      } else if (dialogMode === "edit" && productToEdit) {
        const res = await productsService.updateProduct(
          productToEdit.id,
          payload
        );

        if (res.success) {
          toast({
            title: "Product updated",
            description: `${res.data.name} updated successfully.`,
          });
        }
      }

      setDialogOpen(false);

      // Refetch lại
      updateURL({ page: queryConfig.page });

    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Could not save product.",
        variant: "destructive",
      });
    }
  };

  /** ---------------- DETAIL VIEW ---------------- */
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

      <ProductFilters
        searchTerm={queryConfig.search}
        onSearchChange={handleSearchChange}
        categories={categories}
        filters={{
          category: queryConfig.categories,
          status: queryConfig.status,
          promotion: queryConfig.promotion,
          minPrice: queryConfig.minPrice,
          maxPrice: queryConfig.maxPrice,
          sortBy: queryConfig.sortKey,
        }}
        onFiltersChange={handleFiltersChange}
      />

      <div className="flex justify-end mb-6">
        <Button className="gap-2" onClick={handleAddProduct}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

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
        page={queryConfig.page}
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
