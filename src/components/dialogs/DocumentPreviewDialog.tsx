import { Printer, Share2, Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    name: string;
    type: string;
    size: string;
    owner: string;
  } | null;
}

export function DocumentPreviewDialog({
  open,
  onOpenChange,
  document,
}: DocumentPreviewDialogProps) {
  if (!document) return null;

  const getFileTypeColor = (type: string) => {
    if (type.includes("PDF")) return "bg-destructive/10 text-destructive";
    if (type.includes("DOCX")) return "bg-info/10 text-info";
    if (type.includes("XLSX")) return "bg-success/10 text-success";
    return "bg-muted text-muted-foreground";
  };

  const getFileTypeBadge = (type: string) => {
    if (type.includes("PDF")) return "PDF";
    if (type.includes("DOCX")) return "DOCX";
    if (type.includes("XLSX")) return "XLSX";
    return "FILE";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${getFileTypeColor(document.type)}`}>
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-foreground">{document.name}</h2>
                <Badge variant="secondary" className="text-xs">
                  {getFileTypeBadge(document.type)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Added by {document.owner} • {document.size}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-9 w-9 rounded-full bg-foreground hover:bg-foreground/90"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 text-background" />
            </Button>
          </div>
        </div>

        {/* Document Preview Area */}
        <div className="p-6 min-h-[500px] bg-muted/30 overflow-auto">
          <div className="bg-background rounded-lg shadow-sm border p-8 min-h-[450px]">
            {/* Skeleton lines to simulate document content */}
            <div className="space-y-4">
              <div className="h-4 bg-primary/20 rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/5" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-8" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-primary/20 rounded w-1/2" />
              <div className="h-8" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-muted/50 rounded border" />
                <div className="h-24 bg-muted/50 rounded border" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground">
            SYSTEM: NEXUS CLOUD STORAGE &nbsp;&nbsp; REGION: US-EAST-1
          </p>
          <p className="text-xs text-destructive font-medium">
            CONFIDENTIAL • ENTERPRISE ONLY
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
