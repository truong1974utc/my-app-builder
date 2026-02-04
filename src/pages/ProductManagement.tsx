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
import { Product } from "@/types/product";

const initialProducts: Product[] = [
  {
    id: "1",
    name: "MacBook Pro M3",
    category: "ELECTRONICS",
    price: 2299,
    originalPrice: 2499,
    costPrice: 1850,
    stock: 45,
    minStock: 10,
    status: "IN STOCK",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=300&fit=crop",
    ],
    featured: true,
    sku: "APL-123-MB",
    barcode: "194253139045",
    brand: "Apple",
    manufacturer: "Apple Inc.",
    weight: "1.6 kg",
    dimensions: "31.26 × 22.12 × 1.55 cm",
    description: "The latest MacBook Pro with the powerful M3 chip, featuring a stunning Liquid Retina XDR display.",
    tags: ["laptop", "professional", "apple"],
    metaTitle: "Buy MacBook Pro M3 - Best Deals Online",
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    category: "ELECTRONICS",
    price: 999,
    costPrice: 750,
    stock: 120,
    minStock: 20,
    status: "IN STOCK",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop",
    featured: true,
    sku: "APL-456-IP",
    brand: "Apple",
    manufacturer: "Apple Inc.",
    tags: ["smartphone", "apple", "pro"],
  },
  {
    id: "3",
    name: "Logitech MX Master 3S",
    category: "ACCESSORIES",
    price: 99,
    costPrice: 65,
    stock: 5,
    minStock: 10,
    status: "LOW STOCK",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    featured: false,
    sku: "LOG-789-MX",
    brand: "Logitech",
    tags: ["mouse", "ergonomic"],
  },
  {
    id: "4",
    name: "Sony WH-1000XM5",
    category: "AUDIO",
    price: 349,
    costPrice: 220,
    stock: 28,
    minStock: 15,
    status: "IN STOCK",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    featured: false,
    sku: "SNY-321-XM",
    brand: "Sony",
    tags: ["headphones", "noise-cancelling"],
  },
  {
    id: "5",
    name: "Apple Watch Ultra",
    category: "WEARABLES",
    price: 799,
    costPrice: 550,
    stock: 15,
    minStock: 10,
    status: "IN STOCK",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop",
    featured: true,
    sku: "APL-654-AW",
    brand: "Apple",
    tags: ["watch", "fitness", "apple"],
  },
  {
    id: "6",
    name: "PlayStation 5",
    category: "GAMING",
    price: 499,
    costPrice: 400,
    stock: 0,
    minStock: 10,
    status: "OUT OF STOCK",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop",
    featured: false,
    sku: "SNY-987-PS",
    brand: "Sony",
    tags: ["gaming", "console"],
  },
];

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(initialProducts);
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
          !product.category.toLowerCase().includes(term) &&
          !product.sku?.toLowerCase().includes(term)
        ) {
          return false;
        }
      }

      // Category
      if (filters.category !== "all" && product.category.toLowerCase() !== filters.category) {
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
      if (filters.promotion === "featured" && !product.featured) {
        return false;
      }
      if (filters.promotion === "on_sale" && !product.originalPrice) {
        return false;
      }

      // Price range
      const minPrice = parseFloat(filters.minPrice) || 0;
      const maxPrice = parseFloat(filters.maxPrice) || Infinity;
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
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

  const handleProductSubmit = (data: any) => {
    if (dialogMode === "edit" && productToEdit) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === productToEdit.id
            ? {
                ...p,
                name: data.name || p.name,
                category: data.category?.toUpperCase() || p.category,
                price: parseFloat(data.sellingPrice) || p.price,
                originalPrice: parseFloat(data.comparePrice) || undefined,
                costPrice: parseFloat(data.costPrice) || p.costPrice,
                stock: parseInt(data.stock) || p.stock,
                minStock: parseInt(data.minStock) || p.minStock,
                status:
                  parseInt(data.stock) > 10
                    ? "IN STOCK"
                    : parseInt(data.stock) > 0
                    ? "LOW STOCK"
                    : "OUT OF STOCK",
                featured: data.featured,
                sku: data.sku || p.sku,
                barcode: data.barcode || p.barcode,
                brand: data.brand || p.brand,
                manufacturer: data.manufacturer || p.manufacturer,
                weight: data.weight || p.weight,
                dimensions: data.dimensions || p.dimensions,
                description: data.description || p.description,
                tags: data.tags || p.tags,
                metaTitle: data.metaTitle || p.metaTitle,
                metaDescription: data.metaDescription || p.metaDescription,
                slug: data.slug || p.slug,
              }
            : p
        )
      );
      toast({
        title: "Product updated",
        description: `${data.name || productToEdit.name} has been updated successfully.`,
      });
    } else {
      // Create new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: data.name || "New Product",
        category: data.category?.toUpperCase() || "ELECTRONICS",
        price: parseFloat(data.sellingPrice) || 0,
        originalPrice: parseFloat(data.comparePrice) || undefined,
        costPrice: parseFloat(data.costPrice) || undefined,
        stock: parseInt(data.stock) || 0,
        minStock: parseInt(data.minStock) || 10,
        status:
          parseInt(data.stock) > 10
            ? "IN STOCK"
            : parseInt(data.stock) > 0
            ? "LOW STOCK"
            : "OUT OF STOCK",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
        featured: data.featured,
        sku: data.sku,
        barcode: data.barcode,
        brand: data.brand,
        manufacturer: data.manufacturer,
        weight: data.weight,
        dimensions: data.dimensions,
        description: data.description,
        tags: data.tags,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        slug: data.slug,
      };
      setProducts([newProduct, ...products]);
      toast({
        title: "Product created",
        description: `${newProduct.name} has been added successfully.`,
      });
    }
  };

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
          <p className="text-muted-foreground">No products found matching your criteria.</p>
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
