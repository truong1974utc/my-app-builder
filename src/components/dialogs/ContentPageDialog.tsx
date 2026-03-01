import { useState, useEffect, useRef } from "react";
import {
  LayoutGrid,
  X,
  Globe,
  Image as ImageIcon,
  Upload,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Link,
  Undo,
  Redo,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ContentPage } from "@/types/page.type";
import { CreatePageFormValues, createPageSchema } from "@/schemas/page.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { API_BASE_URL } from "@/constants/api";

interface ContentPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  page?: ContentPage;
  onSubmit: (data: CreatePageFormValues) => void;
}

export function ContentPageDialog({
  open,
  onOpenChange,
  mode,
  page,
  onSubmit,
}: ContentPageDialogProps) {
  const isEditing = mode === "edit";
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePageFormValues>({
    resolver: zodResolver(createPageSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "DRAFT",
      featuredImage: null,
    },
  });

  const status = watch("status");
  const featuredImage = watch("featuredImage");

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      reset({
        title: "",
        slug: "",
        content: "",
        status: "DRAFT",
        featuredImage: null,
      });
    }

    if (mode === "edit" && page) {
      reset({
        title: page.title,
        slug: page.slug,
        content: page.content,
        status: page.status,
        featuredImage: page.featuredImage,
      })
    }
  }, [open, mode, page, reset]);

  const submit = (data: CreatePageFormValues) => {
    console.log("🔥 FORM SUBMIT TRIGGERED");
    console.log("📦 DATA:", data);
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("📁 FILE:", file);
    console.log("📁 instanceof File:", file instanceof File);

    setValue("featuredImage", file); // 🔥 LƯU FILE, KHÔNG LƯU BLOB STRING
  };

  const handleEditorInput = () => {
    const html = editorRef.current?.innerHTML || "";
    setValue("content", html);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1200px] h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center gap-4 px-8 py-6 border-b bg-white">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary text-white">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <DialogTitle className="text-xl font-semibold">
              {isEditing ? "Edit Content Page" : "Create New Page"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Design and publish custom HTML pages for your platform.
            </DialogDescription>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-1 overflow-hidden bg-muted/20"
        >
          {/* LEFT SIDE */}
          <div className="flex-1 p-8 space-y-6 overflow-y-auto bg-white">

            {/* TITLE */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold tracking-wide">
                PAGE TITLE *
              </Label>
              <Input
                placeholder="Enter a descriptive title..."
                {...register("title")}
                className="h-12 text-lg rounded-xl"
              />
            </div>

            {/* EDITOR */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold tracking-wide">
                CONTENT EDITOR (HTML SUPPORTED) *
              </Label>

              <div className="border rounded-2xl overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
                  <Button type="button" size="icon" variant="ghost" onClick={() => execCommand("undo")}>
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" onClick={() => execCommand("redo")}>
                    <Redo className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" onClick={() => execCommand("bold")}>
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="icon" variant="ghost" onClick={() => execCommand("italic")}>
                    <Italic className="h-4 w-4" />
                  </Button>
                </div>

                {/* Editable */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleEditorInput}
                  className="min-h-[400px] p-4 focus:outline-none"
                  dangerouslySetInnerHTML={{ __html: watch("content") || "" }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-[360px] p-8 space-y-6 overflow-y-auto">

            {/* Publishing Card */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 font-semibold">
                <Globe className="h-4 w-4" />
                Publishing Details
              </div>

              {/* SLUG */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide">
                  PERMANENT URL SLUG
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    /pages/
                  </span>
                  <Input {...register("slug")} className="rounded-xl" />
                </div>
              </div>

              {/* STATUS */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide">
                  PAGE STATUS
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={status === "PUBLISHED" ? "default" : "outline"}
                    className="w-full rounded-xl"
                    onClick={() => setValue("status", "PUBLISHED")}
                  >
                    Published
                  </Button>
                  <Button
                    type="button"
                    variant={status === "DRAFT" ? "secondary" : "outline"}
                    className="w-full rounded-xl"
                    onClick={() => setValue("status", "DRAFT")}
                  >
                    Draft
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>CREATED AT</span>
                  <span>NOW</span>
                </div>
                <div className="flex justify-between">
                  <span>LAST MODIFIED</span>
                  <span>NOW</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
              <Label className="text-sm font-semibold">
                Featured Image
              </Label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {featuredImage ? (
                <div className="relative">
                  <img
                    src={
                      featuredImage instanceof File
                        ? URL.createObjectURL(featuredImage)
                        : featuredImage
                          ? `${API_BASE_URL}${featuredImage}`
                          : featuredImage
                    }
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full"
                    onClick={() => setValue("featuredImage", null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-40 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer text-muted-foreground hover:bg-muted/30 transition"
                >
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 h-6 w-6" />
                    Click to upload
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 px-8 py-6 border-t bg-white">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Discard Changes
          </Button>
          <Button onClick={handleSubmit(submit)} className="px-8">
            {isEditing ? "Update Page" : "Publish Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}