import { useState, useEffect, KeyboardEvent, useRef } from "react";
import {
  Package,
  BarChart3,
  Image,
  Search,
  Star,
  DollarSign,
  X,
  Tag,
} from "lucide-react";
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
import { Product, Category, ProductDetail } from "@/types/product.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProductFormValues, createProductSchema } from "@/schemas/product.schema";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProductFormValues) => void;
  product?: ProductDetail;
  mode?: "create" | "edit";
  categories?: Category[];
}

const tabs = [
  { id: "general", label: "General Info", icon: Package, hasError: false },
  { id: "pricing", label: "Pricing & Stock", icon: BarChart3, hasError: false },
  { id: "media", label: "Product Media", icon: Image, hasError: false },
  { id: "seo", label: "Search Engine", icon: Search, hasError: false },
];

export function ProductDialog({
  open,
  onOpenChange,
  onSubmit,
  product,
  mode,
  categories = [],
}: ProductDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      sku: "",
      barcode: "",
      name: "",
      description: "",
      categoryId: "",
      brand: "",
      manufacturer: "",
      weight: "",
      dimensions: "",
      tags: [],
      basePrice: 0,
      costPrice: 0,
      discountPrice: 0,
      stockUnits: 0,
      metaTitle: "",
      metaDescription: "",
      isFeatured: false,
      images: [],
      lowStockAlert: 0,
    },
  });

  useEffect(() => {
    register("images");
  }, [register]);

  useEffect(() => {
    console.log("🧠 FORM STATE UPDATE");
    console.log("isValid:", isValid);
    console.log("errors:", errors);
  }, [isValid, errors]);

  useEffect(() => {
    if (!open) return;
    if (mode === "create") {
      reset({
        sku: "",
        barcode: "",
        name: "",
        description: "",
        categoryId: "",
        brand: "",
        manufacturer: "",
        weight: "",
        dimensions: "",
        tags: [],
        basePrice: 0,
        costPrice: 0,
        discountPrice: 0,
        stockUnits: 0,
        metaTitle: "",
        metaDescription: "",
        isFeatured: false,
        images: [],
        lowStockAlert: 0,
      });
    }
    if (mode === "edit" && product) {
      reset({
        sku: product.sku,
        barcode: product.barcode ?? "",
        name: product.name,
        description: product.description ?? "",
        categoryId: product.category?.id ?? "",
        brand: product.brand,
        manufacturer: product.manufacturer ?? "",
        weight: product.weight ?? "",
        dimensions: product.dimensions ?? "",
        basePrice: Number(product.basePrice),
        costPrice: Number(product.costPrice), // GET không trả về costPrice
        discountPrice: Number(product.discountPrice ?? 0),
        stockUnits: product.stockUnits,
        lowStockAlert: product.lowStockAlert,
        metaTitle: product.metaTitle ?? "",
        metaDescription: product.metaDescription ?? "",
        isFeatured: product.isFeatured,
        tags: product.tags ?? [],


        images:
          product.images?.map((img) => ({
            id: img.id,
            url: img.url,
            isMain: img.isMain,
          })) ?? [],
      })
      console.log("RESETTING WITH:", product.images);
    }
  }, [open, mode, product])

  const submit = (data: CreateProductFormValues) => {
    console.log("🚀 FINAL SUBMIT DATA:", data);
    console.log("images instanceof Array:", Array.isArray(data.images));
    console.log("first image instanceof File:", data.images?.[0] instanceof File);

    onSubmit(data);
    onOpenChange(false);
  };

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = e.currentTarget.value.trim().toLowerCase();

      if (!value || tags.length >= 8 || tags.includes(value)) return;

      setValue("tags", [...tags, value]);
      e.currentTarget.value = "";
      console.log("🏷 AFTER ADD:", watch("tags"));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setValue("images", [...(watch("images") || []), ...files], {
      shouldValidate: true,
    });

    // reset input để chọn lại cùng file vẫn trigger
    e.target.value = "";
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const { basePrice = 0, costPrice = 0, tags = [], images = [] } = watch();

  const margin =
    costPrice > 0 ? Math.round(((basePrice - costPrice) / basePrice) * 100) : 0;

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

        <form
          id="product-form"
          onSubmit={handleSubmit(submit)}
          className="flex flex-1 gap-6 overflow-hidden"
        >
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
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
                  margin > 0 ? "text-success" : "text-muted-foreground",
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
              <Switch
                checked={watch("isFeatured")}
                onCheckedChange={(value) => setValue("isFeatured", value)}
              />
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
                      {...register("name")}
                      className={cn("h-11", errors.name && "border-destructive")}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      SKU (Format: XXX-000-XX) *
                    </Label>
                    <Input
                      placeholder="APL-123-MB"
                      {...register("sku")}
                      className="h-11 font-mono"
                    />
                    {errors.sku && (
                      <p className="text-sm text-destructive">
                        {errors.sku.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Barcode / EAN
                    </Label>
                    <Input
                      placeholder="194253139045"
                      {...register("barcode")}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Category *
                    </Label>
                    <Select
                      value={watch("categoryId")}
                      onValueChange={(value) =>
                        setValue("categoryId", value, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-sm text-destructive">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Brand *
                    </Label>
                    <Input
                      placeholder="e.g. Apple"
                      {...register("brand")}
                      className="h-11"
                    />
                    {errors.brand && (
                      <p className="text-sm text-destructive">
                        {errors.brand.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Manufacturer *
                    </Label>
                    <Input
                      placeholder="e.g. Apple Inc."
                      {...register("manufacturer")}
                      className="h-11"
                    />
                    {errors.manufacturer && (
                      <p className="text-sm text-destructive">
                        {errors.manufacturer.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Weight (e.g. 1.5kg)
                    </Label>
                    <Input
                      placeholder="1.6 kg"
                      {...register("weight")}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      Dimensions (e.g. 10x20x5cm)
                    </Label>
                    <Input
                      placeholder="31.26 × 22.12 × 1.55 cm"
                      {...register("dimensions")}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase text-muted-foreground">
                    Description
                  </Label>
                  <Textarea
                    placeholder="The latest MacBook..."
                    {...register("description")}
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
                  {errors.tags && (
                    <p className="text-sm text-destructive">
                      {errors.tags.message}
                    </p>
                  )}
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Press Enter to add tag"
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
                      BASE PRICE *
                    </Label>
                    <Input
                      type="number"
                      {...register("basePrice", { valueAsNumber: true })}
                      className="h-11"
                    />
                    {errors.basePrice && (
                      <p className="text-sm text-destructive">
                        {errors.basePrice.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      COST PRICE *
                    </Label>
                    <Input
                      type="number"
                      {...register("costPrice", { valueAsNumber: true })}
                      className="h-11"
                    />
                    {errors.costPrice && (
                      <p className="text-sm text-destructive">
                        {errors.costPrice.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      DISCOUNT PRICE
                    </Label>
                    <Input
                      type="number"
                      {...register("discountPrice", { valueAsNumber: true })}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      STOCK UNITS *
                    </Label>
                    <Input
                      type="number"
                      {...register("stockUnits", { valueAsNumber: true })}
                      className="h-11"
                    />
                    {errors.stockUnits && (
                      <p className="text-sm text-destructive">
                        {errors.stockUnits.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase text-muted-foreground">
                      LOW STOCK ALERT LEVEL
                    </Label>
                    <Input
                      type="number"
                      {...register("lowStockAlert", { valueAsNumber: true })}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="space-y-5">
                {/* hidden input */}
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {errors.images && (
                  <p className="text-sm text-destructive">
                    {errors.images.message}
                  </p>
                )}

                <div
                  className="rounded-xl border-2 border-dashed border-border p-12 text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      {images?.map((img, index) => {
                        let previewUrl = "";

                        if (img instanceof File) {
                          previewUrl = URL.createObjectURL(img);
                        } else if (img?.url) {
                          previewUrl = img.url;
                        }

                        return (
                          <img
                            key={index}
                            src={previewUrl}
                            alt="preview"
                          />
                        );
                      })}
                    </div>
                  )}
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
                    {...register("metaTitle")}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase text-muted-foreground">
                    Meta Description
                  </Label>
                  <Textarea
                    placeholder="Brief description for search results..."
                    {...register("metaDescription")}
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Discard Changes
          </Button>
          <Button type="submit" form="product-form">
            {mode === "edit" ? "Update Product" : "Save Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
