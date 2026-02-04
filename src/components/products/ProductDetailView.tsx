import { useState } from "react";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  DollarSign,
  Package,
  FileText,
  Globe,
  Star,
  Tag,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Product } from "@/types/product";

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductDetailView({
  product,
  onBack,
  onEdit,
  onDelete,
}: ProductDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const images = product.images?.length
    ? product.images
    : [product.image, product.image];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN STOCK":
        return "bg-primary text-primary-foreground";
      case "LOW STOCK":
        return "bg-warning text-warning-foreground";
      case "OUT OF STOCK":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const costPrice = product.costPrice || product.price * 0.8;
  const margin = costPrice > 0 ? ((product.price - costPrice) / costPrice) * 100 : 0;
  const inventoryLevel = product.minStock
    ? Math.min((product.stock / product.minStock) * 100, 100)
    : product.stock > 10
    ? 100
    : (product.stock / 10) * 100;
  const inventoryHealth = product.stock === 0 ? "OUT" : product.stock < 10 ? "LOW" : "HEALTHY";

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit} className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit Product
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border bg-muted">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-3">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === idx
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="space-y-6">
          {/* Title & Badges */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
              {product.featured && (
                <Badge className="bg-warning/20 text-warning border-warning gap-1">
                  <Star className="h-3 w-3 fill-warning" />
                  SHOWCASE PRODUCT
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Package className="h-4 w-4 text-primary" />
                {product.category}
              </span>
              {product.brand && (
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {product.brand}
                </span>
              )}
            </div>
          </div>

          {/* Revenue & Stock Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Revenue Analysis */}
            <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground">
              <div className="flex items-center gap-2 text-xs font-medium uppercase opacity-90">
                <DollarSign className="h-4 w-4" />
                Revenue Analysis
              </div>
              <p className="text-3xl font-bold mt-2">
                ${product.price.toLocaleString()}
              </p>
              {product.originalPrice && (
                <p className="text-sm opacity-75 line-through">
                  Originally ${product.originalPrice.toLocaleString()}
                </p>
              )}
              <div className="flex gap-4 mt-4 pt-3 border-t border-primary-foreground/20">
                <div>
                  <p className="text-xs opacity-75">Gross Margin</p>
                  <p className="font-bold">{margin.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs opacity-75">Unit Cost</p>
                  <p className="font-bold">${costPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Stock Health */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
                <Package className="h-4 w-4" />
                Stock Health
              </div>
              <p className="text-3xl font-bold mt-2">{product.stock}</p>
              <p className="text-xs text-muted-foreground">UNITS CURRENTLY ON-HAND</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">INVENTORY LEVEL</span>
                  <span
                    className={`font-semibold ${
                      inventoryHealth === "HEALTHY"
                        ? "text-success"
                        : inventoryHealth === "LOW"
                        ? "text-warning"
                        : "text-destructive"
                    }`}
                  >
                    {inventoryHealth}
                  </span>
                </div>
                <Progress
                  value={inventoryLevel}
                  className={`h-2 ${
                    inventoryHealth === "HEALTHY"
                      ? "[&>div]:bg-primary"
                      : inventoryHealth === "LOW"
                      ? "[&>div]:bg-warning"
                      : "[&>div]:bg-destructive"
                  }`}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>ALERT THRESHOLD</span>
                  <span>{product.minStock || 10} units</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Overview */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground mb-3">
              <FileText className="h-4 w-4" />
              Product Overview
            </div>
            <p className="text-foreground leading-relaxed">
              {product.description ||
                `The latest ${product.name} with premium quality and exceptional performance.`}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technical Identity */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground mb-4">
            <Package className="h-4 w-4" />
            Technical Identity
          </div>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-xs text-muted-foreground uppercase">SKU Number</p>
              <p className="font-mono font-medium">{product.sku || "APL-123-MB"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Manufacturer</p>
              <p className="font-medium">{product.manufacturer || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Dimensions</p>
              <p className="font-medium">{product.dimensions || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Unit Weight</p>
              <p className="font-medium">{product.weight || "N/A"}</p>
            </div>
          </div>
          {product.tags && product.tags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase mb-2">Associated Tags</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SEO Performance */}
        <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase opacity-90">
              <Globe className="h-4 w-4" />
              SEO Performance
            </div>
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <p className="text-xs uppercase opacity-75">Search Engine Snippet</p>
            <p className="font-semibold text-primary mt-1">
              {product.metaTitle || `Buy ${product.name} - Best Deals Online`}
            </p>
            <p className="text-sm opacity-75 mt-1">
              {product.metaDescription || "No meta description configured."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
