import { useState } from "react";
import { Search, Plus, ExternalLink, Pencil, Trash2, Image, Globe, Calendar } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "PUBLISHED" | "DRAFT";
  createdAt: string;
  updatedAt: string;
  featuredImage?: string;
}

const initialPages: ContentPage[] = [
  { 
    id: "1", 
    title: "About Us", 
    slug: "/pages/about-us", 
    content: "<p>About</p>",
    status: "PUBLISHED", 
    createdAt: "2024-01-10", 
    updatedAt: "2024-03-05" 
  },
];

const ContentPages = () => {
  const [pages, setPages] = useState(initialPages);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [pageToDelete, setPageToDelete] = useState<ContentPage | null>(null);
  const { toast } = useToast();

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleSubmit = (data: Omit<ContentPage, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    if (data.id) {
      // Update existing
      setPages(pages.map((p) => 
        p.id === data.id 
          ? { ...p, ...data, updatedAt: new Date().toISOString().split("T")[0] } 
          : p
      ));
      toast({ title: "Page updated", description: `${data.title} has been updated.` });
    } else {
      // Create new
      const newPage: ContentPage = {
        id: Date.now().toString(),
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
        featuredImage: data.featuredImage,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setPages([...pages, newPage]);
      toast({ title: "Page created", description: `${data.title} has been published.` });
    }
  };

  const handleDeleteConfirm = () => {
    if (pageToDelete) {
      setPages(pages.filter((p) => p.id !== pageToDelete.id));
      toast({ title: "Page deleted", description: `${pageToDelete.title} has been removed.` });
      setPageToDelete(null);
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
              <TableHead className="font-semibold text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPages.map((page) => (
              <TableRow key={page.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      <Image className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{page.title}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Globe className="h-3 w-3" />
                        <span>{page.slug}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={page.status === "PUBLISHED" ? "default" : "secondary"}
                    className={page.status === "PUBLISHED" ? "bg-success/10 text-success border-0" : ""}
                  >
                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${page.status === "PUBLISHED" ? "bg-success" : "bg-muted-foreground"}`} />
                    {page.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>CREATED: {page.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-success">
                      <Pencil className="h-3 w-3" />
                      <span>UPDATED: {page.updatedAt}</span>
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
            ))}
          </TableBody>
        </Table>
      </div>

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
