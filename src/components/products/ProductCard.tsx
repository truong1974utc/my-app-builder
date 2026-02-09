import { Eye, Pencil, Trash2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product.type";
import { useEffect } from "react";

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCard({ product, onView, onEdit, onDelete }: ProductCardProps) {
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

  return (
    <div className="group rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all hover:shadow-card-hover">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.mainImage}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.isFeatured && (
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
          {product.category.name}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-foreground">{product.name}</h3>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase">Pricing</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground">
                ${product.basePrice.toLocaleString()}
              </span>
              {product.basePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.basePrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase">Stock</p>
            <span
              className={`text-lg font-bold ${
                product.stockUnits === 0
                  ? "text-destructive"
                  : product.stockUnits < 10
                  ? "text-warning"
                  : "text-foreground"
              }`}
            >
              {product.stockUnits}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(product)}>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(product)}>
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}
