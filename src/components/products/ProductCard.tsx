import { Eye, Pencil, Trash2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product, ProductDetail } from "@/types/product.type";
import { API_BASE_URL } from "@/constants/api";
import { useEffect } from "react";
import { productsService } from "@/services/product.service";

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCard({
  product,
  onView,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_STOCK":
        return "bg-emerald-100 text-emerald-700";
      case "LOW_STOCK":
        return "bg-amber-100 text-amber-700";
      case "OUT_OF_STOCK":
        return "bg-red-100 text-red-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={
            product.mainImage
              ? `${API_BASE_URL}${product.mainImage}`
              : "/no-image.png"
          }
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.isFeatured && (
          <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-warning">
            <Star className="h-4 w-4 fill-warning-foreground text-warning-foreground" />
          </div>
        )}
        <Badge
          className={`absolute right-3 top-3 px-3 py-1 text-[11px] font-semibold rounded-full ${getStatusColor(
            product.status,
          )}`}
        >
          {product.status}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
          {product.category.name}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-gray-900">
          {product.name}
        </h3>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Pricing
            </p>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                ${(product.discountPrice ?? product.basePrice ?? 0).toLocaleString()}
              </span>

              <span className="text-sm text-gray-400 line-through">
                ${product.basePrice.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              Stock
            </p>
            <span
              className={`text-base font-semibold ${product.stockUnits === 0
                ? "text-red-600"
                : product.stockUnits < 10
                  ? "text-amber-600"
                  : "text-gray-900"
                }`}
            >
              {product.stockUnits}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onView(product)}
          >
            <Eye className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(product)}
          >
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
