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

import { s } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { Pagination } from "@/components/common/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { useSearch } from "@/hooks/useSearchQuery";
import { useSort } from "@/hooks/useSortQuery";
import { PaginationLimit } from "@/enums/pagination.enum";

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

const CategoryManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const limitFromUrl = Number(searchParams.get("limit")) || PaginationLimit.TEN;
  const searchFromUrl = searchParams.get("search") || "";
  const sortByFromUrl = searchParams.get("sortBy") || undefined;
  const sortOrderFromUrl = searchParams.get("sortOrder") as any;

  const { page, limit, setPage, setLimit } = usePagination(
    pageFromUrl,
    limitFromUrl,
  );

  const { search, setSearch, debouncedSearch } = useSearch(searchFromUrl);

  const { sortBy, sortOrder, toggleSort } = useSort(
    sortByFromUrl,
    sortOrderFromUrl,
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  /* ================== FETCH ================== */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesService.getCategories({
        page,
        limit,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
      });

      if (!res.success) return;

      setCategories(res.data.items);
      setMeta(res.data.meta);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchCategories();
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

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  /* ================== CRUD ================== */
  const handleCategorySubmit = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      if (dialogMode === "create") {
        await categoriesService.createCategory(data);
        toast({ title: "Category created" });
      }

      if (dialogMode === "edit" && selectedCategory) {
        await categoriesService.updateCategory(selectedCategory.id, data);
        toast({ title: "Category updated" });
      }

      await fetchCategories();

      setDialogOpen(false);
      setSelectedCategory(null);
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    await categoriesService.deleteCategory(categoryToDelete.id);
    toast({ title: "Category deleted" });

    await fetchCategories();

    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                      onClick={() => handleDeleteClick(category)}
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
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      )}

      {/* Category Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        category={selectedCategory || undefined}
        onSubmit={handleCategorySubmit}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        itemName={categoryToDelete?.name || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default CategoryManagement;
