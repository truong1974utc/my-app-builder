import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, Layers } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CategoryDialog } from "@/components/dialogs/CategoryDialog";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { useToast } from "@/hooks/use-toast";
import { categoriesService } from "@/services/categories/categoriy.service";

import { Pagination } from "@/components/common/Pagination";
import { useSearch } from "@/hooks/useSearchQuery";
import { PaginationLimit } from "@/enums/pagination.enum";
import { useDebounce } from "@/hooks/useDebounce";
import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

const CategoryManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchValue, 500);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || PaginationLimit.TEN;
  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = searchParams.get("sortOrder") as "ASC" | "DESC" | undefined;
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch?.trim())
      params.set("search", debouncedSearch.trim());
    else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to first page on search
    setSearchParams(params);
  }, [debouncedSearch]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    let change = false;
    if (!params.get("page")) {
      params.set("page", "1");
      change = true;
    }
    if (!params.get("limit")) {
      params.set("limit", String(PaginationLimit.TEN));
      change = true;
    }
    if (change) {
      setSearchParams(params);
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getCategories(searchParams as any);
      setCategories(data.items);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const { toast } = useToast();

  useEffect(() => {
    const params: Record<string, string> = {
      page: String(page),
      limit: String(limit),
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;

    setSearchParams(params);
  }, [page, limit, debouncedSearch, sortBy, sortOrder]);

  const handleAddCategory = () => {
    setDialogMode("create");
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setDialogMode("edit");
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleCategorySubmit = async (data: any) => {
    console.log("CALL API WITH:", data);
    try {
      if (dialogMode === "create") {
        const res = await categoriesService.createCategory(data);
        toast({ title: "Category created" });
      }

      if (dialogMode === "edit" && selectedCategory) {
        await categoriesService.updateCategory(selectedCategory.id, data);
        toast({ title: "Category updated" });
      }
      await fetchCategories();

    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeletingId(categoryToDelete.id);
      await categoriesService.deleteCategory(categoryToDelete.id);
      toast({ title: "Category deleted" });
      await fetchCategories();
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Category Management"
        description="System management and detailed overview."
      />

      {/* Search and Add */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gap-2" onClick={handleAddCategory}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">CATEGORY NAME</TableHead>
              <TableHead className="font-semibold">DESCRIPTION</TableHead>
              <TableHead className="font-semibold">PRODUCTS</TableHead>
              <TableHead className="font-semibold text-right">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">
                      {category.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {category.description}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-info/10 text-info">
                    {category.productCount} Items
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={deletingId === category.id}
                      onClick={() => {
                        setCategoryToDelete(category);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && (
        <Pagination
          page={page}
          totalPages={meta?.totalPages || 1}
          onPageChange={handlePageChange}
        />
      )}

      {/* Category Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        category={selectedCategory}
        onSubmit={handleCategorySubmit}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        itemName={categoryToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default CategoryManagement;
