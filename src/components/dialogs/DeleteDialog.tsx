import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  itemName: string;
  onConfirm: () => void;
}

export function DeleteDialog({
  open,
  onOpenChange,
  title = "Delete User",
  itemName,
  onConfirm,
}: DeleteDialogProps) {
  const handleDelete = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] text-center">
        <DialogHeader className="flex flex-col items-center pt-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground py-2">
          Are you sure you want to delete <span className="font-medium text-foreground">{itemName}</span>?
          <br />
          This action cannot be undone.
        </p>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="w-full h-11"
          >
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full h-11"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
