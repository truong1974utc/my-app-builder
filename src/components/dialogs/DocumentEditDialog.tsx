import { useState, useEffect } from "react";
import { FileText, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface DocumentEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    name: string;
    type: string;
  } | null;
  onSubmit: (data: { id: string; title: string }) => void;
}

export function DocumentEditDialog({
  open,
  onOpenChange,
  document,
  onSubmit,
}: DocumentEditDialogProps) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (document) {
      setTitle(document.name);
    }
  }, [document]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (document) {
      onSubmit({ id: document.id, title });
      onOpenChange(false);
    }
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Info Banner */}
          <div className="flex items-start gap-3 rounded-lg bg-primary/10 p-4">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary">
                Supported formats: PDF, DOCX, XLSX, JPG.
              </p>
              <p className="text-primary/80">Maximum file size: 5MB.</p>
            </div>
          </div>

          {/* Document Title */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Document Title *
            </Label>
            <Input
              placeholder="e.g. Q4 Financial Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11"
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
