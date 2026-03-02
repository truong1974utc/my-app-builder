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
import { PaginationLimit } from "@/enums/pagination.enum";

const ContentPages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [meta, setMeta] = useState<any>(null)
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchValue, 500);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || PaginationLimit.TEN;
  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = searchParams.get("sortOrder") as "ASC" | "DESC"
  const status = searchParams.get("status") as "PUBLISHED" | "DRAFT";
  const [mode, setMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch?.trim())
      params.set("search", debouncedSearch.trim());
    else {
      params.delete("search");
    }
    params.set("page", "1");
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

  const fetchPages = async () => {
    try {
      const data = await pagesService.getPages(searchParams as any)
      setPages(data.items)
      setMeta(data.meta)
    } catch (error) {
      console.error("Failed to fetch pages:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!page || !limit) return;
    fetchPages()
  }, [searchParams])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };


  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [pageToDelete, setPageToDelete] = useState<ContentPage | null>(null);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  const handleCreateClick = () => {
    setMode("create")
    setSelectedPage(null);
    setDialogOpen(true);
  };

  const handleEditClick = (page: ContentPage) => {
    console.log("CLICK EDIT PAGE:", page);
    setMode("edit")
    setSelectedPage(page);
    setDialogOpen(true);
  };

  const handleDeleteClick = (page: ContentPage) => {
    setPageToDelete(page);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    console.log("===== SUBMIT START =====");
    console.log("ID:", selectedPage?.id);
    console.log("TITLE:", data.title);
    console.log("FEATURED IMAGE:", data.featuredImage);
    console.log("IS FILE:", data.featuredImage instanceof File);
    console.log("TYPE:", typeof data.featuredImage);
    try {
      if (mode === "create") {
        await pagesService.createPage(data)
        toast({
          title: "Page created",
          description: `${data.title} has been created.`,
        });
      } else {
        await pagesService.updatePage(selectedPage?.id, data)
        console.log("EDIT DOCUMENT:", data);
        toast({
          title: "Page updated",
          description: `${data.title} has been updated.`,
        });
      }
      setDialogOpen(false)
      setSelectedPage(null)
      setMode("create")
      fetchPages()
    } catch (error) {
      console.error("Failed to save page:", error);
      toast({
        title: "Error",
        description: "Failed to save page. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await pagesService.deletePage(pageToDelete?.id)
      toast({
        title: "Page deleted",
        description: `${pageToDelete?.title} has been deleted.`,
      });
      setDeleteDialogOpen(false)
      setPageToDelete(null)
      fetchPages()
    } catch (error) {
      console.error("Failed to delete page:", error);
      toast({
        title: "Error",
        description: "Failed to delete page. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Content Pages"
        description="System management and detailed overview."
      />

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or slug..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
                  {searchValue
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
        totalPages={meta?.totalPages}
        onPageChange={handlePageChange}
      />

      {/* Content Page Dialog */}
      <ContentPageDialog
        mode={mode}
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
