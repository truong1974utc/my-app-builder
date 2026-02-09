import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "@/components/dialogs/ProductDialog";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductDetailView } from "@/components/products/ProductDetailView";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product.type";
import { useProducts } from "@/hooks/products/useProduct";
import { PaginationLimit } from "@/enums/pagination.enum";

const ProductManagement = () => {
  const [page, setPage] = useState(1);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: PaginationLimit.TEN,
    search: undefined as string | undefined,
    sortBy: "createdAt",
    sortOrder: undefined as "ASC" | "DESC",
    category: undefined as string | undefined,
    status: undefined as string | undefined,
    promotion: undefined as string | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  });
  const { products, meta, loading, setProducts } = useProducts(queryParams)
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    promotion: "all",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
  });

  // Apply filters
  const filteredProducts = products
    .filter((product) => {
      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (
          !product.name.toLowerCase().includes(term) &&
          !product.category.name.toLowerCase().includes(term) &&
          !product.sku?.toLowerCase().includes(term)
        ) {
          return false;
        }
      }

      // Category
      if (
        filters.category !== "all" &&
        product.category.name.toLowerCase() !== filters.category
      ) {
        return false;
      }

      // Status
      if (filters.status !== "all") {
        const statusMap: Record<string, string> = {
          in_stock: "IN STOCK",
          low_stock: "LOW STOCK",
          out_of_stock: "OUT OF STOCK",
        };
        if (product.status !== statusMap[filters.status]) {
          return false;
        }
      }

      // Promotion
      if (filters.promotion === "featured" && !product.isFeatured) {
        return false;
      }
      if (filters.promotion === "on_sale" && !product.discountPrice) {
        return false;
      }

      // Price range
      const minPrice = parseFloat(filters.minPrice) || 0;
      const maxPrice = parseFloat(filters.maxPrice) || Infinity;
      if (parseInt(product.basePrice) < minPrice || parseInt(product.basePrice) > maxPrice) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price_asc":
          return parseInt(a.basePrice) - parseInt(b.basePrice);
        case "price_desc":
          return parseInt(b.basePrice) - parseInt(a.basePrice);
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "oldest":
          return parseInt(a.id) - parseInt(b.id);
        default: // newest
          return parseInt(b.id) - parseInt(a.id);
      }
    });

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

  // const handleProductSubmit = (data: any) => {
  //   if (dialogMode === "edit" && productToEdit) {
  //     // Update existing product
  //     setProducts(
  //       products.map((p) =>
  //         p.id === productToEdit.id
  //           ? {
  //               ...p,
  //               name: data.name || p.name,
  //               category: data.category?.toUpperCase() || p.category,
  //               price: parseFloat(data.sellingPrice) || p.basePrice,
  //               originalPrice: parseFloat(data.comparePrice) || undefined,
  //               costPrice: parseFloat(data.costPrice) || p.costPrice,
  //               stock: parseInt(data.stock) || p.stock,
  //               minStock: parseInt(data.minStock) || p.minStock,
  //               status:
  //                 parseInt(data.stock) > 10
  //                   ? "IN STOCK"
  //                   : parseInt(data.stock) > 0
  //                     ? "LOW STOCK"
  //                     : "OUT OF STOCK",
  //               featured: data.featured,
  //               sku: data.sku || p.sku,
  //               barcode: data.barcode || p.barcode,
  //               brand: data.brand || p.brand,
  //               manufacturer: data.manufacturer || p.manufacturer,
  //               weight: data.weight || p.weight,
  //               dimensions: data.dimensions || p.dimensions,
  //               description: data.description || p.description,
  //               tags: data.tags || p.tags,
  //               metaTitle: data.metaTitle || p.metaTitle,
  //               metaDescription: data.metaDescription || p.metaDescription,
  //               slug: data.slug || p.slug,
  //             }
  //           : p,
  //       ),
  //     );
  //     toast({
  //       title: "Product updated",
  //       description: `${data.name || productToEdit.name} has been updated successfully.`,
  //     });
  //   } else {
  //     // Create new product
  //     const newProduct: Product = {
  //       id: Date.now().toString(),
  //       name: data.name || "New Product",
  //       category: data.category?.toUpperCase() || "ELECTRONICS",
  //       price: parseFloat(data.sellingPrice) || 0,
  //       originalPrice: parseFloat(data.comparePrice) || undefined,
  //       costPrice: parseFloat(data.costPrice) || undefined,
  //       stock: parseInt(data.stock) || 0,
  //       minStock: parseInt(data.minStock) || 10,
  //       status:
  //         parseInt(data.stock) > 10
  //           ? "IN STOCK"
  //           : parseInt(data.stock) > 0
  //             ? "LOW STOCK"
  //             : "OUT OF STOCK",
  //       image:
  //         "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
  //       featured: data.featured,
  //       sku: data.sku,
  //       barcode: data.barcode,
  //       brand: data.brand,
  //       manufacturer: data.manufacturer,
  //       weight: data.weight,
  //       dimensions: data.dimensions,
  //       description: data.description,
  //       tags: data.tags,
  //       metaTitle: data.metaTitle,
  //       metaDescription: data.metaDescription,
  //       slug: data.slug,
  //     };
  //     setProducts([newProduct, ...products]);
  //     toast({
  //       title: "Product created",
  //       description: `${newProduct.name} has been added successfully.`,
  //     });
  //   }
  // };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      toast({
        title: "Product deleted",
        description: `${productToDelete.name} has been removed.`,
      });
      setProductToDelete(null);
      if (viewingProduct?.id === productToDelete.id) {
        setViewingProduct(null);
      }
    }
  };

  const handleProductSubmit = () => {
  setDialogOpen(false)
}

  // Show detail view if viewing a product
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
          onEdit={() => {
            handleEditProduct(viewingProduct);
          }}
          onDelete={() => handleDeleteClick(viewingProduct)}
        />
        <ProductDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleProductSubmit}
          product={productToEdit}
          mode={dialogMode}
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

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Product Management"
        description="System management and detailed overview."
      />

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Add Product Button */}
      <div className="flex justify-end mb-6">
        <Button className="gap-2" onClick={handleAddProduct}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={handleViewProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found matching your criteria.
          </p>
        </div>
      )}

      {/* Product Dialog */}
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleProductSubmit}
        product={productToEdit}
        mode={dialogMode}
      />

      {/* Delete Dialog */}
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
