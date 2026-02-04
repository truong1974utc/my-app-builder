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

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    category: string;
    status: string;
    promotion: string;
    minPrice: string;
    maxPrice: string;
    sortBy: string;
  };
  onFiltersChange: (filters: ProductFiltersProps["filters"]) => void;
}

const categories = [
  { value: "all", label: "Select Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "accessories", label: "Accessories" },
  { value: "audio", label: "Audio" },
  { value: "wearables", label: "Wearables" },
  { value: "gaming", label: "Gaming" },
];

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
];

const promotions = [
  { value: "all", label: "All Products" },
  { value: "featured", label: "Featured Only" },
  { value: "on_sale", label: "On Sale" },
];

const sortOptions = [
  { value: "newest", label: "Newest Additions" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

export function ProductFilters({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, SKU..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
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

      {/* Expanded Filters */}
      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 rounded-lg border border-border bg-card">
          {/* Categories */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-muted-foreground">
              Categories
            </label>
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilter("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-muted-foreground">
              Status
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Promotion */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-muted-foreground">
              Promotion
            </label>
            <Select
              value={filters.promotion}
              onValueChange={(value) => updateFilter("promotion", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                {promotions.map((promo) => (
                  <SelectItem key={promo.value} value={promo.value}>
                    {promo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min Price */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-muted-foreground">
              Min Price ($)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
            />
          </div>

          {/* Max Price */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-muted-foreground">
              Max Price ($)
            </label>
            <Input
              type="number"
              placeholder="99999"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase text-muted-foreground">
              Sort Results By
            </label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilter("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Newest Additions" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
