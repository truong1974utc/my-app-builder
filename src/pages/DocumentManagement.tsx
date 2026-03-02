import { useEffect, useState } from "react";
import {
  Upload,
  Eye,
  Pencil,
  Trash2,
  Download,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Pagination } from "@/components/common/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { useToast } from "@/hooks/use-toast";
import { documentService } from "@/services/documents/document.service";
import { Document, DocumentItem } from "@/types/document.type";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { PaginationLimit } from "@/enums/pagination.enum";
import { CreateDocumentFormValues } from "@/schemas/document.schema";

const DocumentManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchValue, 500);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || undefined;
  const fileType = searchParams.get("fileType") || undefined;
  const ownerId = searchParams.get("ownerId") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = searchParams.get("sortOrder") as "ASC" | "DESC" | undefined;
  const [documentId, setDocumentId] = useState<string | null>(null);

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

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocuments(searchParams as any);
      setDocuments(data.items);
      setMeta(data.meta);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load documents.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!page || !limit) return;
    fetchDocuments();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };


  const [loading, setLoading] = useState(true);
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(
    null,
  );
  const [selectedDocumentEdit, setSelectedDocumentEdit] = useState<Document | null>(
    null,
  );
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null,
  );
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

  const handleSubmitDocument = async (data: CreateDocumentFormValues) => {
    try {
      setLoading(true);
      await documentService.createDocument({
        title: data.title,
        file: data.file,
      });
      toast({
        title: "Document uploaded",
        description: `${data.title} has been uploaded.`,
      })
      await fetchDocuments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  const handlePreviewClick = async (id: string) => {
    try {
      setLoading(true);
      const document = await documentService.getDocumentById(id);
      setSelectedDocument(document);
      setPreviewDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to preview document.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (doc: Document) => {
    setSelectedDocumentEdit(doc);
    setEditDialogOpen(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      setLoading(true);
      setDocumentId(documentToDelete.id);
      await documentService.deleteDocument(documentToDelete.id);
      toast({
        title: "Document deleted",
        description: `${documentToDelete?.title} has been deleted.`,
      });
      await fetchDocuments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete document.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setDocumentId(null);
    }
  };

  const handleDownload = async (doc: Document) => {
    console.log("CLICK DOWNLOAD:", doc.id);

    try {
      const blob = await documentService.downloadDocument(doc.id);
      console.log("BLOB RECEIVED:", blob);

      const url = window.URL.createObjectURL(blob);
      console.log("BLOB URL:", url);

      const link = document.createElement("a");
      link.href = url;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("DOWNLOAD ERROR:", error);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Document Management"
        description="System management and detailed overview."
      />

      {/* Header with Search and Upload */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search documents..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-10"
          />
        </div>
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
              <TableHead className="font-semibold text-right">
                ACTIONS
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading documents...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  {searchValue
                    ? "No documents found matching your search."
                    : "No documents uploaded yet."}
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {doc.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {doc.fileName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFileSize(doc.fileSize)}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {doc.owner.fullName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(doc.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePreviewClick(doc.id)}
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
                        onClick={() => {
                          setDocumentToDelete(doc);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4 text-muted-foreground" />
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
        totalPages={meta?.totalPages || 1}
        onPageChange={handlePageChange}
      />

      {/* Upload Dialog */}
      <DocumentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmitDocument}
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
        document={selectedDocumentEdit}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Document"
        itemName={documentToDelete?.title || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default DocumentManagement;
