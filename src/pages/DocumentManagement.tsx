import { useState } from "react";
import { Upload, Eye, Pencil, Trash2, Download, FileText, FileSpreadsheet } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  owner: string;
  updatedAt: string;
}

const documents: Document[] = [
  { id: "1", name: "Q3 Financial Report", type: "PDF File", size: "2.4 MB", owner: "Alex Thompson", updatedAt: "2024-03-15" },
  { id: "2", name: "Product Roadmap 2024", type: "DOCX File", size: "1.1 MB", owner: "Sarah Miller", updatedAt: "2024-03-12" },
];

const DocumentManagement = () => {
  const getFileIcon = (type: string) => {
    if (type.includes("PDF")) {
      return <FileText className="h-5 w-5 text-destructive" />;
    }
    return <FileSpreadsheet className="h-5 w-5 text-info" />;
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Document Management"
        description="System management and detailed overview."
      />

      {/* Header with Upload */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Recent Documents</h2>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload New
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">DOCUMENT NAME</TableHead>
              <TableHead className="font-semibold">SIZE</TableHead>
              <TableHead className="font-semibold">OWNER</TableHead>
              <TableHead className="font-semibold">UPDATED AT</TableHead>
              <TableHead className="font-semibold text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      {getFileIcon(doc.type)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.type}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                <TableCell className="text-foreground">{doc.owner}</TableCell>
                <TableCell className="text-muted-foreground">{doc.updatedAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4 text-muted-foreground" />
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

export default DocumentManagement;
