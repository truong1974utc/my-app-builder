import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  CreateDocumentFormValues,
  createDocumentSchema,
} from "@/schemas/document.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus, FileText, Info, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateDocumentFormValues) => Promise<void> | void;
}

export function DocumentDialog({
  open,
  onOpenChange,
  onSubmit,
}: DocumentDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateDocumentFormValues>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: {
      file: undefined,
      title: "",
    },
  });

  const watchedFile = watch("file");
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;
    reset({
      file: undefined,
      title: "",
    });
  }, [open, reset]);

  const submit = async (data: CreateDocumentFormValues) => {
    try {
      await onSubmit(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      })
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    setValue("file", droppedFile, { shouldValidate: true });

    if (!watch("title")) {
      setValue(
        "title",
        droppedFile.name.replace(/\.[^/.]+$/, "")
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Upload New Document
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submit)}
          className="space-y-5 pt-4"
        >
          {/* Info */}
          <div className="flex items-start gap-3 rounded-lg bg-primary/10 p-4">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-primary">
                Supported formats: PDF, DOCX, XLSX, JPG, PNG
              </p>
              <p className="text-primary/80">
                Maximum file size: 5MB
              </p>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <input
              type="file"
              accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png"
              className="hidden"
              {...register("file")}
              ref={(e) => {
                register("file").ref(e);
                fileInputRef.current = e;
              }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setValue("file", file, { shouldValidate: true });

                if (!watch("title")) {
                  setValue("title", file.name.replace(/\.[^/.]+$/, ""));
                }
              }}
            />

            {watchedFile ? (
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">
                  {watchedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(watchedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <FilePlus className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium text-foreground">
                  Click to select file
                </p>
                <p className="text-sm text-muted-foreground">
                  or drag and drop here
                </p>
              </>
            )}
          </div>

          {errors.file && (
            <p className="text-xs text-destructive">
              {errors.file.message as string}
            </p>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Document Title
            </Label>
            <Input
              placeholder="e.g. Q4 Financial Report"
              className="h-11"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}