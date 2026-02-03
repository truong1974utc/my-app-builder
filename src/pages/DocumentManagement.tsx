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
import { DocumentDialog } from "@/components/dialogs/DocumentDialog";
import { DocumentPreviewDialog } from "@/components/dialogs/DocumentPreviewDialog";
import { DocumentEditDialog } from "@/components/dialogs/DocumentEditDialog";
import { DeleteDialog } from "@/components/dialogs/DeleteDialog";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  owner: string;
  updatedAt: string;
}

const initialDocuments: Document[] = [
  { id: "1", name: "Q3 Financial Report", type: "PDF File", size: "2.4 MB", owner: "Alex Thompson", updatedAt: "2024-03-15" },
  { id: "2", name: "Product Roadmap 2024", type: "DOCX File", size: "1.1 MB", owner: "Sarah Miller", updatedAt: "2024-03-12" },
];

const DocumentManagement = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const { toast } = useToast();

  const getFileIcon = (type: string) => {
    if (type.includes("PDF")) {
      return <FileText className="h-5 w-5 text-destructive" />;
    }
    return <FileSpreadsheet className="h-5 w-5 text-info" />;
  };

  const handleUpload = () => {
    setDialogOpen(true);
  };

  const handlePreviewClick = (doc: Document) => {
    setSelectedDocument(doc);
    setPreviewDialogOpen(true);
  };

  const handleEditClick = (doc: Document) => {
    setSelectedDocument(doc);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (doc: Document) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = (data: { id: string; title: string }) => {
    setDocuments(documents.map((d) => 
      d.id === data.id ? { ...d, name: data.title } : d
    ));
    toast({ title: "Document updated", description: `${data.title} has been updated.` });
  };

  const handleDocumentSubmit = (data: { file: File | null; title: string }) => {
    if (data.file) {
      const newDocument: Document = {
        id: Date.now().toString(),
        name: data.title,
        type: data.file.type.includes("pdf") ? "PDF File" : "DOCX File",
        size: `${(data.file.size / 1024 / 1024).toFixed(1)} MB`,
        owner: "Alex Thompson",
        updatedAt: new Date().toISOString().split("T")[0],
      };
      setDocuments([...documents, newDocument]);
      toast({ title: "Document uploaded", description: `${data.title} has been uploaded successfully.` });
    }
  };

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      setDocuments(documents.filter((d) => d.id !== documentToDelete.id));
      toast({ title: "Document deleted", description: `${documentToDelete.name} has been removed.` });
      setDocumentToDelete(null);
    }
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
        <Button className="gap-2" onClick={handleUpload}>
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handlePreviewClick(doc)}
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEditClick(doc)}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteClick(doc)}
                    >
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

      {/* Upload Dialog */}
      <DocumentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleDocumentSubmit}
      />

      {/* Preview Dialog */}
      <DocumentPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        document={selectedDocument}
      />

      {/* Edit Dialog */}
      <DocumentEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        document={selectedDocument}
        onSubmit={handleEditSubmit}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Document"
        itemName={documentToDelete?.name || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default DocumentManagement;
