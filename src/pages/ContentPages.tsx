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

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  status: "PUBLISHED" | "DRAFT";
  createdAt: string;
  updatedAt: string;
}

const contentPages: ContentPage[] = [
  { id: "1", title: "About Us", slug: "/pages/about-us", status: "PUBLISHED", createdAt: "2024-01-10", updatedAt: "2024-03-05" },
];

const ContentPages = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPages = contentPages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Button className="gap-2">
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContentPages;
