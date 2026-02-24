import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  Image,
  Globe,
  Calendar,
} from "lucide-react";
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
import { ContentPageDialog } from "@/components/dialogs/ContentPageDialog";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { Pagination } from "@/components/common/Pagination";
import { useToast } from "@/hooks/use-toast";
import { pagesService } from "@/services/pages/page.service";
import { ContentPage } from "@/types/page.type";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

const ContentPages = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = searchParams.get("sortOrder") || undefined;
  const status = searchParams.get("status") || undefined;
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(search);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [pageToDelete, setPageToDelete] = useState<ContentPage | null>(null);
  const { toast } = useToast();

  const updateQuery = (newParams: Record<string, any>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    setSearchParams(params);
  };

  useEffect(() => {
    if (!searchParams.get("page") || !searchParams.get("limit")) {
      const params = new URLSearchParams(searchParams);

      if (!searchParams.get("page")) params.set("page", "1");
      if (!searchParams.get("limit")) params.set("limit", "10");

      setSearchParams(params, { replace: true });
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fetch pages from API
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    let page = Number(params.get("page"));
    let limit = Number(params.get("limit"));

    // Nếu thiếu thì set luôn vào URL
    if (!page) {
      page = 1;
      params.set("page", "1");
    }

    if (!limit) {
      limit = 10;
      params.set("limit", "10");
    }

    // Nếu URL vừa được bổ sung thì update lại và dừng
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
      return;
    }

    const fetchPages = async () => {
      try {
        setLoading(true);

        const response = await pagesService.getPages({
          page,
          limit,
          search: params.get("search") || undefined,
          sortBy: params.get("sortBy") || undefined,
          sortOrder: params.get("sortOrder") as "ASC" | "DESC" | undefined,
          status: params.get("status") as "PUBLISHED" | "DRAFT" | undefined,
        });

        if (response.success) {
          setPages(response.data.items);
          setTotalPages(response.data.meta.totalPages);
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to load pages.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [searchParams]);
  // Reset to page 1 when search term changes
  useEffect(() => {
    updateQuery({
      search: debouncedSearchTerm || undefined,
      page: 1,
    });
  }, [debouncedSearchTerm]);

  const handleCreateClick = () => {
    setSelectedPage(null);
    setDialogOpen(true);
  };

  const handleEditClick = (page: ContentPage) => {
    setSelectedPage(page);
    setDialogOpen(true);
  };

  const handleDeleteClick = (page: ContentPage) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (
    data: Omit<ContentPage, "id" | "createdAt" | "updatedAt"> & { id?: string },
  ) => {
    try {
      if (data.id) {
        // Update existing
        await pagesService.updatePage(data.id, {
          id: data.id,
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          featuredImage: data.featuredImage,
        });
        toast({
          title: "Page updated",
          description: `${data.title} has been updated.`,
        });
      } else {
        // Create new
        await pagesService.createPage({
          title: data.title,
          slug: data.slug,
          content: data.content,
          status: data.status,
          featuredImage: data.featuredImage,
        });
        toast({
          title: "Page created",
          description: `${data.title} has been published.`,
        });
      }
      // Refetch data to ensure consistency
      const response = await pagesService.getPages({
        page,
        limit,
        search: debouncedSearchTerm || undefined,
      });
      if (response.success) {
        setPages(response.data.items);
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Failed to save page:", error);
      toast({
        title: "Error",
        description: "Failed to save page. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (pageToDelete) {
      try {
        await pagesService.deletePage(pageToDelete.id);
        toast({
          title: "Page deleted",
          description: `${pageToDelete.title} has been removed.`,
        });
        setPageToDelete(null);

        // Refetch data to ensure consistency
        const response = await pagesService.getPages({
          page,
          limit,
          search: debouncedSearchTerm || undefined,
        });
        if (response.success) {
          setPages(response.data.items);
          setTotalPages(response.data.meta.totalPages);
        }
      } catch (error) {
        console.error("Failed to delete page:", error);
        toast({
          title: "Error",
          description: "Failed to delete page. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Content Pages"
        description="System management and detailed overview."
      />

      {/* Search and Add */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="gap-2" onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Create Page
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">PAGE CONTENT</TableHead>
              <TableHead className="font-semibold">STATUS</TableHead>
              <TableHead className="font-semibold">HISTORY</TableHead>
              <TableHead className="font-semibold text-right">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading pages...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : pages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchTerm
                    ? "No pages found matching your search."
                    : "No pages created yet."}
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow
                  key={page.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <Image className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {page.title}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          <span>/pages/{page.slug}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        page.status === "PUBLISHED" ? "default" : "secondary"
                      }
                      className={
                        page.status === "PUBLISHED"
                          ? "bg-success/10 text-success border-0"
                          : ""
                      }
                    >
                      <span
                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${page.status === "PUBLISHED" ? "bg-success" : "bg-muted-foreground"}`}
                      />
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>CREATED: {formatDate(page.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-success">
                        <Pencil className="h-3 w-3" />
                        <span>UPDATED: {formatDate(page.updatedAt)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditClick(page)}
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteClick(page)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => updateQuery({ page: newPage })}
      />

      {/* Content Page Dialog */}
      <ContentPageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        page={selectedPage}
        onSubmit={handleSubmit}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Page"
        itemName={pageToDelete?.title || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ContentPages;
