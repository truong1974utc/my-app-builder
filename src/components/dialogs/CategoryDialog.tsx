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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ICategory } from "@/interface/category.interface";
import { CreateCategoryFormValues, createCategorySchema } from "@/schemas/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  category?: {
    id: string;
    name: string;
    description: string;
  };
  onSubmit: (data: CreateCategoryFormValues) => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  mode,
  category,
  onSubmit,
}: CategoryDialogProps) {
  const isEdit = mode === "edit";
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      reset({
        name: "",
        description: "",
      })
    }

    if (mode === "edit" && category) {
      reset({
        name: category.name,
        description: category.description,
      })
    }
  }, [open, mode, category, reset])

  const submit = async (data: CreateCategoryFormValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      })
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-5 pt-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Category Name
            </Label>
            <Input
              placeholder="e.g. Smart Home"
              {...register("name")}
              className="h-11"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Description
            </Label>
            <Textarea
              placeholder="Brief description of the category..."
              {...register("description")}
              className="min-h-[120px] resize-none"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Save Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
