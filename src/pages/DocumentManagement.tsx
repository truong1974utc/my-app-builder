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
import { useDebounce } from "@/hooks/useDebounce";
import { documentService } from "@/services/documents/document.service";
import { DocumentItem } from "@/types/document.type";
import { useSearchParams } from "react-router-dom";

const DocumentManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(
    null,
  );
  const [documentToDelete, setDocumentToDelete] = useState<DocumentItem | null>(
    null,
  );
  const { toast } = useToast();

  const getFileIcon = (type: string) => {
    if (type.includes("PDF")) {
      return <FileText className="h-5 w-5 text-destructive" />;
    }
    return <FileSpreadsheet className="h-5 w-5 text-info" />;
  };

  // Fetch documents from API
  useEffect(() => {
    const currentPage = searchParams.get("page");
    const currentLimit = searchParams.get("limit");

    // Nếu thiếu page hoặc limit → thêm mặc định vào URL
    if (!currentPage || !currentLimit) {
      const params = new URLSearchParams(searchParams);

      if (!currentPage) params.set("page", "1");
      if (!currentLimit) params.set("limit", "10");

      setSearchParams(params);
      return; // đợi URL update rồi effect chạy lại
    }

    const fetchDocuments = async () => {
      try {
        setLoading(true);

        const response = await documentService.getDocuments({
          page: Number(currentPage),
          limit: Number(currentLimit),
          search: searchParams.get("search") || undefined,
          sortBy: searchParams.get("sortBy") || undefined,
          sortOrder: searchParams.get("sortOrder") as
            | "ASC"
            | "DESC"
            | undefined,
          fileType: searchParams.get("fileType") || undefined,
          ownerId: searchParams.get("ownerId") || undefined,
        });

        if (response.success) {
          setDocuments(response.data.items);
          setTotalPages(response.data.meta.totalPages);
        }
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

    fetchDocuments();
  }, [searchParams]);

  const handleUpload = () => {
    setDialogOpen(true);
  };

  const handlePreviewClick = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setPreviewDialogOpen(true);
  };

  const handleEditClick = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (doc: DocumentItem) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
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

  const handleEditSubmit = async (data: { id: string; title: string }) => {
    try {
      await documentService.updateDocument(data.id, {
        title: data.title,
      });
      toast({
        title: "Document updated",
        description: `${data.title} has been updated.`,
      });
      // Refetch data
      const response = await documentService.getDocuments({
        page,
        limit,
        search: debouncedSearchTerm || undefined,
        fileType: fileTypeFilter || undefined,
      });
      if (response.success) {
        setDocuments(response.data.items);
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Failed to update document:", error);
      toast({
        title: "Error",
        description: "Failed to update document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDocumentSubmit = async (data: {
    file: File | null;
    title: string;
  }) => {
    try {
      if (data.file) {
        // Validate file
        if (data.file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: "File size must not exceed 5 MB.",
            variant: "destructive",
          });
          return;
        }

        const formData = new FormData();
        formData.append("title", data.title || data.file.name);
        formData.append("file", data.file);

        const response = await documentService.uploadDocument(formData);
        if (response.success) {
          toast({
            title: "Document uploaded",
            description: `${data.title} has been uploaded successfully.`,
          });
          setDialogOpen(false);
          // Refetch data
          const listResponse = await documentService.getDocuments({
            page: 1,
            limit,
          });
          if (listResponse.success) {
            setDocuments(listResponse.data.items);
            setTotalPages(listResponse.data.meta.totalPages);
            searchParams.set("page", "1");
            searchParams.set("limit", String(limit));
            setSearchParams(searchParams);
          }
        }
      }
    } catch (error) {
      console.error("Failed to upload document:", error);
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (documentToDelete) {
      try {
        await documentService.deleteDocument(documentToDelete.id);
        toast({
          title: "Document deleted",
          description: `${documentToDelete.title} has been removed.`,
        });
        setDocumentToDelete(null);

        // Refetch data
        const response = await documentService.getDocuments({
          page,
          limit,
          search: debouncedSearchTerm || undefined,
          fileType: fileTypeFilter || undefined,
        });
        if (response.success) {
          setDocuments(response.data.items);
          setTotalPages(response.data.meta.totalPages);
        }
      } catch (error) {
        console.error("Failed to delete document:", error);
        toast({
          title: "Error",
          description: "Failed to delete document. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDownload = async (doc: DocumentItem) => {
    try {
      const response = await documentService.downloadDocument(doc.id);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", doc.fileName);
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
    } catch (error) {
      console.error("Failed to download document:", error);
      toast({
        title: "Error",
        description: "Failed to download document. Please try again.",
        variant: "destructive",
      });
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
            value={searchParams.get("search") || ""}
            onChange={(e) => {
              if (e.target.value) {
                searchParams.set("search", e.target.value);
              } else {
                searchParams.delete("search");
              }
              searchParams.set("page", "1");
              setSearchParams(searchParams);
            }}
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
                  {searchTerm
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
        totalPages={totalPages}
        onPageChange={(newPage) => {
          searchParams.set("page", String(newPage));
          searchParams.set("limit", String(limit));
          setSearchParams(searchParams);
        }}
      />

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
        itemName={documentToDelete?.title || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default DocumentManagement;
