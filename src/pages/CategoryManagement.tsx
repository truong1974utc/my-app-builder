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

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

const DEFAULT_QUERY = {
  page: 1,
  limit: 10,
  search: "",
  sortBy: undefined as string | undefined,
  sortOrder: undefined as "ASC" | "DESC" | undefined,
};

const CategoryManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || DEFAULT_QUERY.page;
  const limit = Number(searchParams.get("limit")) || DEFAULT_QUERY.limit;
  const search = searchParams.get("search") || DEFAULT_QUERY.search;
  const sortBy = searchParams.get("sortBy") || DEFAULT_QUERY.sortBy;
  const sortOrder =
    (searchParams.get("sortOrder") as "ASC" | "DESC") ||
    DEFAULT_QUERY.sortOrder;

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

  /* ================== UPDATE URL ================== */
  const updateQuery = (next: Partial<typeof DEFAULT_QUERY>) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      const merged = {
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        ...next,
      };

      // 👉 luôn set page & limit
      params.set("page", String(merged.page));
      params.set("limit", String(merged.limit));

      merged.search
        ? params.set("search", merged.search)
        : params.delete("search");

      merged.sortBy
        ? params.set("sortBy", merged.sortBy)
        : params.delete("sortBy");

      merged.sortOrder
        ? params.set("sortOrder", merged.sortOrder)
        : params.delete("sortOrder");

      return params;
    });
  };

  useEffect(() => {
    setSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search && { search }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================== FETCH ================== */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoriesService.getCategories({
        page,
        limit,
        ...(search && { search }),
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
    fetchCategories();
  }, [page, limit, search, sortBy, sortOrder]);

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
            onChange={(e) =>
              updateQuery({
                search: e.target.value,
                page: 1,
              })
            }
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
          onPageChange={(p) => updateQuery({ page: p })}
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
