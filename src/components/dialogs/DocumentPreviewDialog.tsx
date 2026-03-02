import { Printer, Share2, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentItem } from "@/types/document.type";
import { documentService } from "@/services/documents/document.service";
import { API_BASE_URL } from "@/constants/api";

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentItem | null;
}

export function DocumentPreviewDialog({
  open,
  onOpenChange,
  document,
}: DocumentPreviewDialogProps) {
  if (!document) return null;

  const previewSrc = `${API_BASE_URL}${document.fileUrl}`;
  const handleDownload = async (doc: DocumentItem) => {
    try {
      const file = await documentService.downloadDocument(doc.id);

      const blob = file instanceof Blob ? file : file?.data;
      if (!blob) return;

      const url = window.URL.createObjectURL(blob);

      const link = window.document.createElement("a");
      link.href = url;
      link.download = doc.fileName || "downloaded-file";

      window.document.body.appendChild(link);
      link.click();

      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("DOWNLOAD ERROR:", error);
    }
  };

  const isImage =
    document.fileType.includes("JPG") ||
    document.fileType.includes("PNG") ||
    document.fileType.includes("JPEG");

  const isPDF = document.fileType.includes("PDF");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] p-0 gap-0 max-h-[90vh] overflow-hidden rounded-2xl">

        {/* HEADER */}
        <div className="flex items-start justify-between p-6 border-b bg-background">
          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              📄
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">
                  {document.title}
                </h2>

                <Badge variant="secondary">
                  {document.fileType}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                <p>File: {document.fileName}</p>
                <p>Size: {document.fileSizeFormatted}</p>
                <p>
                  Owner: {document.owner.fullName} ({document.owner.email})
                </p>
                <p>
                  Created: {new Date(document.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Printer className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDownload(document)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* PREVIEW BODY */}
        <div className="flex items-center justify-center h-[600px] bg-muted/20 px-6 overflow-auto">

          {isImage && (
            <img
              src={previewSrc}
              alt="preview"
              className="max-h-[550px] object-contain rounded-xl shadow-lg"
            />
          )}

          {isPDF && (
            <iframe
              src={previewSrc}
              className="w-full h-[550px] rounded-xl shadow-lg"
            />
          )}

          {!isImage && !isPDF && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Preview not available
              </p>
              <p className="text-xs font-mono break-all">
                {previewSrc}
              </p>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground">
            NEXUS CLOUD STORAGE
          </p>
          <p className="text-xs text-primary font-medium">
            CONFIDENTIAL • ENTERPRISE
          </p>
        </div>

      </DialogContent>
    </Dialog>
  );
}