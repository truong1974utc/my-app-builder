import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Category } from "@/types/category.type";
import { GetProductsParams } from "@/services/products/product.service";

interface UIFilters {
  categories: string;
  status: string;
  promotion: string;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}

interface ProductFiltersProps {
  categories: Category[];
  onFiltersChange: (filters: any) => void;
}

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "IN_STOCK", label: "In Stock" },
  { value: "LOW_STOCK", label: "Low Stock" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
];

const promotions = [
  { value: "all", label: "All Promotions" },
  { value: "featured", label: "Featured Only" },
  { value: "standard", label: "Standard Only" },
];

const sortOptions = [
  { value: "all", label: "ALL" },
  { value: "newest", label: "Newest Additions" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "stock_asc", label: "Stock: Low to High" },
  { value: "stock_desc", label: "Stock: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

export function ProductFilters({
  categories,
  onFiltersChange,
}: ProductFiltersProps) {
  const [expanded, setExpanded] = useState(true); // mở filter cho mày thấy UI

  const [filters, setFilters] = useState<UIFilters>({
    categories: "",
    status: "",
    promotion: "",
    minPrice: null,
    maxPrice: null,
    sortBy: "",
    sortOrder: "ASC",
  });

  const updateFilter = (key: keyof UIFilters, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    // tạm thời vẫn bắn ra ngoài
    onFiltersChange(updated);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center gap-3">

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setExpanded(!expanded)}
        >
          <Filter className="h-4 w-4" />
          Filters
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {expanded && (
        <div className="rounded-xl border bg-muted/40 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Categories
              </label>
              <Select
                value={filters.categories}
                onValueChange={(value) =>
                  updateFilter("categories", value)
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    Select Categories
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  updateFilter("status", value)
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Promotion */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Promotion
              </label>
              <Select
                value={filters.promotion}
                onValueChange={(value) =>
                  updateFilter("promotion", value)
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="All Promotions" />
                </SelectTrigger>
                <SelectContent>
                  {promotions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Min Price */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Min Price ($)
              </label>
              <Input
                type="number"
                placeholder="0"
                className="h-11"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "minPrice",
                    e.target.value
                      ? Number(e.target.value)
                      : null
                  )
                }
              />
            </div>

            {/* Max Price */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Max Price ($)
              </label>
              <Input
                type="number"
                placeholder="99999"
                className="h-11"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  updateFilter(
                    "maxPrice",
                    e.target.value
                      ? Number(e.target.value)
                      : null
                  )
                }
              />
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground">
                Sort Results By
              </label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  updateFilter("sortBy", value)
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="ALL" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
