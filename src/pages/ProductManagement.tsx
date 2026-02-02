import { useState } from "react";
import { Search, Plus, Filter, Eye, Pencil, Trash2, Star } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductDialog } from "@/components/dialogs/ProductDialog";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK";
  image: string;
  featured: boolean;
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "MacBook Pro M3",
    category: "ELECTRONICS",
    price: 2299,
    originalPrice: 2499,
    stock: 45,
    status: "IN STOCK",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    featured: true,
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    category: "ELECTRONICS",
    price: 999,
    stock: 120,
    status: "IN STOCK",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop",
    featured: true,
  },
  {
    id: "3",
    name: "Logitech MX Master 3S",
    category: "ACCESSORIES",
    price: 99,
    stock: 5,
    status: "LOW STOCK",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    featured: false,
  },
  {
    id: "4",
    name: "Sony WH-1000XM5",
    category: "AUDIO",
    price: 349,
    stock: 28,
    status: "IN STOCK",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    featured: false,
  },
  {
    id: "5",
    name: "Apple Watch Ultra",
    category: "WEARABLES",
    price: 799,
    stock: 15,
    status: "IN STOCK",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop",
    featured: true,
  },
  {
    id: "6",
    name: "PlayStation 5",
    category: "GAMING",
    price: 499,
    stock: 0,
    status: "OUT OF STOCK",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=300&fit=crop",
    featured: false,
  },
];

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { toast } = useToast();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN STOCK":
        return "bg-success text-success-foreground";
      case "LOW STOCK":
        return "bg-warning text-warning-foreground";
      case "OUT OF STOCK":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleAddProduct = () => {
    setDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleProductSubmit = (data: any) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: data.name || "New Product",
      category: data.category?.toUpperCase() || "ELECTRONICS",
      price: parseFloat(data.sellingPrice) || 0,
      stock: parseInt(data.stock) || 0,
      status: parseInt(data.stock) > 10 ? "IN STOCK" : parseInt(data.stock) > 0 ? "LOW STOCK" : "OUT OF STOCK",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      featured: data.featured,
    };
    setProducts([...products, newProduct]);
    toast({ title: "Product created", description: `${newProduct.name} has been added successfully.` });
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      toast({ title: "Product deleted", description: `${productToDelete.name} has been removed.` });
      setProductToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Product Management"
        description="System management and detailed overview."
      />

      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        <Button className="gap-2" onClick={handleAddProduct}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all hover:shadow-card-hover"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {product.featured && (
                <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-warning">
                  <Star className="h-4 w-4 fill-warning-foreground text-warning-foreground" />
                </div>
              )}
              <Badge className={`absolute right-3 top-3 ${getStatusColor(product.status)}`}>
                {product.status}
              </Badge>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-xs font-medium text-primary uppercase tracking-wide">
                {product.category}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{product.name}</h3>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Pricing</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase">Stock</p>
                  <span
                    className={`text-lg font-bold ${
                      product.stock === 0
                        ? "text-destructive"
                        : product.stock < 10
                        ? "text-warning"
                        : "text-foreground"
                    }`}
                  >
                    {product.stock}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDeleteClick(product)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Dialog */}
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleProductSubmit}
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
