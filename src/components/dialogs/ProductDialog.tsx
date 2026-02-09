import { useState, useEffect, KeyboardEvent } from "react";
import { Package, BarChart3, Image, Search, Star, DollarSign, X, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product.type";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  product?: Product | null;
  mode?: "create" | "edit";
}

const tabs = [
  { id: "general", label: "General Info", icon: Package, hasError: false },
  { id: "pricing", label: "Pricing & Stock", icon: BarChart3, hasError: false },
  { id: "media", label: "Product Media", icon: Image, hasError: false },
  { id: "seo", label: "Search Engine", icon: Search, hasError: false },
];

const categories = [
  "Electronics",
  "Accessories",
  "Audio",
  "Home Appliances",
  "Wearables",
  "Gaming",
];

export function ProductDialog({
  open,
  onOpenChange,
  onSubmit,
  product,
  mode = "create",
}: ProductDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [featured, setFeatured] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "",
    brand: "",
    manufacturer: "",
    weight: "",
    dimensions: "",
    description: "",
    // Pricing
    costPrice: "",
    sellingPrice: "",
    comparePrice: "",
    stock: "",
    minStock: "",
    // SEO
    metaTitle: "",
    metaDescription: "",
    slug: "",
  });

  // Reset form when dialog opens or product changes
  useEffect(() => {
    if (open) {
      if (product && mode === "edit") {
        setFormData({
          name: product.name || "",
          sku: product.sku || "",
          barcode: product.barcode || "",
          category: product.category?.toLowerCase() || "",
          brand: product.brand || "",
          manufacturer: product.manufacturer || "",
          weight: product.weight || "",
          dimensions: product.dimensions || "",
          description: product.description || "",
          costPrice: product.costPrice?.toString() || "",
          sellingPrice: product.price?.toString() || "",
          comparePrice: product.originalPrice?.toString() || "",
          stock: product.stock?.toString() || "",
          minStock: product.minStock?.toString() || "",
          metaTitle: product.metaTitle || "",
          metaDescription: product.metaDescription || "",
          slug: product.slug || "",
        });
        setFeatured(product.featured || false);
        setTags(product.tags || []);
      } else {
        setFormData({
          name: "",
          sku: "",
          barcode: "",
          category: "",
          brand: "",
          manufacturer: "",
          weight: "",
          dimensions: "",
          description: "",
          costPrice: "",
          sellingPrice: "",
          comparePrice: "",
          stock: "",
          minStock: "",
          metaTitle: "",
          metaDescription: "",
          slug: "",
        });
        setFeatured(false);
        setTags([]);
      }
      setActiveTab("general");
    }
  }, [open, product, mode]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() && tags.length < 8) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, featured, tags });
    onOpenChange(false);
  };

  // Calculate margin
  const costPrice = parseFloat(formData.costPrice) || 0;
  const sellingPrice = parseFloat(formData.sellingPrice) || 0;
  const margin = costPrice > 0 ? Math.round(((sellingPrice - costPrice) / costPrice) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {mode === "edit" ? "Edit Product" : "Create New Product"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Configure all product specifications and market details.
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 gap-6 overflow-hidden">
          {/* Left Sidebar - Tabs */}
          <div className="w-48 shrink-0 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.hasError && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-destructive" />
                )}
              </button>
            ))}

            {/* Margin Display */}
            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5" />
                Est. Margin
              </div>
              <p
                className={cn(
                  "text-2xl font-bold mt-1",
                  margin > 0 ? "text-success" : "text-muted-foreground"
                )}
              >
                {margin}%
              </p>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 overflow-y-auto pr-2">
            {/* Featured Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border p-4 mb-6">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium">Featured Product</p>
                  <p className="text-sm text-muted-foreground">
                    Highlight this product in the store frontend.
                  </p>
                </div>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>

            {/* General Info Tab */}
            {activeTab === "general" && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Product Name *
                    </Label>
                    <Input
                      placeholder="e.g. MacBook Pro M3"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      SKU (Format: XXX-000-XX) *
                    </Label>
                    <Input
                      placeholder="APL-123-MB"
                      value={formData.sku}
                      onChange={(e) => updateField("sku", e.target.value)}
                      className="h-11 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Barcode / EAN
                    </Label>
                    <Input
                      placeholder="194253139045"
                      value={formData.barcode}
                      onChange={(e) => updateField("barcode", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => updateField("category", value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat.toLowerCase()}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Brand *
                    </Label>
                    <Input
                      placeholder="e.g. Apple"
                      value={formData.brand}
                      onChange={(e) => updateField("brand", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Manufacturer *
                    </Label>
                    <Input
                      placeholder="e.g. Apple Inc."
                      value={formData.manufacturer}
                      onChange={(e) => updateField("manufacturer", e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Weight (e.g. 1.5kg)
                    </Label>
                    <Input
                      placeholder="1.6 kg"
                      value={formData.weight}
                      onChange={(e) => updateField("weight", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Dimensions (e.g. 10x20x5cm)
                    </Label>
                    <Input
                      placeholder="31.26 × 22.12 × 1.55 cm"
                      value={formData.dimensions}
                      onChange={(e) => updateField("dimensions", e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase text-muted-foreground">
                    Description
                  </Label>
                  <Textarea
                    placeholder="The latest MacBook Pro with the powerful M3 chip, featuring a stunning Liquid Retina XDR display."
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase text-muted-foreground">
                    Product Tags (1-8) *
                  </Label>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="gap-1 pl-2 pr-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Press Enter to add tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="h-11 pl-10"
                      disabled={tags.length >= 8}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === "pricing" && (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Cost Price *
                    </Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.costPrice}
                      onChange={(e) => updateField("costPrice", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Selling Price *
                    </Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.sellingPrice}
                      onChange={(e) => updateField("sellingPrice", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Compare at Price
                    </Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={formData.comparePrice}
                      onChange={(e) => updateField("comparePrice", e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Stock Quantity *
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => updateField("stock", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Low Stock Alert
                    </Label>
                    <Input
                      type="number"
                      placeholder="10"
                      value={formData.minStock}
                      onChange={(e) => updateField("minStock", e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="space-y-5">
                <div className="rounded-xl border-2 border-dashed border-border p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-muted p-4">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="font-medium">Click to upload images</p>
                  <p className="text-sm text-muted-foreground">
                    or drag and drop files here
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === "seo" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase text-muted-foreground">
                    Meta Title
                  </Label>
                  <Input
                    placeholder="Product title for search engines"
                    value={formData.metaTitle}
                    onChange={(e) => updateField("metaTitle", e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase text-muted-foreground">
                    Meta Description
                  </Label>
                  <Textarea
                    placeholder="Brief description for search results..."
                    value={formData.metaDescription}
                    onChange={(e) => updateField("metaDescription", e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase text-muted-foreground">
                    URL Slug
                  </Label>
                  <Input
                    placeholder="product-url-slug"
                    value={formData.slug}
                    onChange={(e) => updateField("slug", e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="border-t pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Discard Changes
          </Button>
          <Button onClick={handleSubmit}>
            {mode === "edit" ? "Update Product" : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
