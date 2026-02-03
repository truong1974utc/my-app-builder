import { useState, useEffect, useRef } from "react";
<<<<<<< HEAD
import {
  LayoutGrid,
  X,
  Globe,
  Image as ImageIcon,
=======
import { 
  LayoutGrid, 
  X, 
  Globe, 
  Image as ImageIcon, 
>>>>>>> 7ff2db269d6f8e780f016f7ffc439452cdee141e
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
<<<<<<< HEAD
  FileText,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
=======
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
>>>>>>> 7ff2db269d6f8e780f016f7ffc439452cdee141e
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "PUBLISHED" | "DRAFT";
  createdAt: string;
  updatedAt: string;
  featuredImage?: string;
}

interface ContentPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: ContentPage | null;
<<<<<<< HEAD
  onSubmit: (
    data: Omit<ContentPage, "id" | "createdAt" | "updatedAt"> & { id?: string },
  ) => void;
=======
  onSubmit: (data: Omit<ContentPage, "id" | "createdAt" | "updatedAt"> & { id?: string }) => void;
>>>>>>> 7ff2db269d6f8e780f016f7ffc439452cdee141e
}

export function ContentPageDialog({
  open,
  onOpenChange,
  page,
  onSubmit,
}: ContentPageDialogProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">("DRAFT");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isEditing = !!page;

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setSlug(page.slug.replace("/pages/", ""));
      setContent(page.content || "");
      setStatus(page.status);
      setFeaturedImage(page.featuredImage || null);
    } else {
      setTitle("");
      setSlug("");
      setContent("");
      setStatus("DRAFT");
      setFeaturedImage(null);
    }
  }, [page, open]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing && !slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFeaturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: page?.id,
      title,
      slug: `/pages/${slug}`,
      content: contentRef.current?.innerHTML || content,
      status,
      featuredImage: featuredImage || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1100px] p-0 gap-0 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {isEditing ? "Edit Content Page" : "Create New Page"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Design and publish custom HTML pages for your platform.
              </p>
            </div>
          </div>
<<<<<<< HEAD
          {/* <Button
=======
          <Button
>>>>>>> 7ff2db269d6f8e780f016f7ffc439452cdee141e
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
<<<<<<< HEAD
          </Button> */}
=======
          </Button>
>>>>>>> 7ff2db269d6f8e780f016f7ffc439452cdee141e
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-auto space-y-6">
            {/* Page Title */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">
                PAGE TITLE
              </Label>
              <Input
                placeholder="Enter page title..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="h-12 text-lg"
                required
              />
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase text-muted-foreground">
                CONTENT EDITOR (HTML SUPPORTED) *
              </Label>
              <div className="border rounded-lg overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => execCommand("undo")}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => execCommand("redo")}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-5 bg-border mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => execCommand("bold")}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => execCommand("italic")}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => execCommand("strikeThrough")}
                  >
                    <Strikethrough className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-5 bg-border mx-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => execCommand("insertUnorderedList")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => execCommand("insertOrderedList")}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const url = prompt("Enter URL:");
                      if (url) execCommand("createLink", url);
                    }}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
                {/* Editor */}
                <div
                  ref={contentRef}
                  contentEditable
                  className="min-h-[300px] p-4 focus:outline-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                  onInput={(e) => setContent(e.currentTarget.innerHTML)}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l p-6 space-y-6 bg-muted/30 overflow-auto">
            {/* Publishing Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <Label className="text-xs font-medium uppercase">
                  PUBLISHING DETAILS
                </Label>
              </div>

              {/* URL Slug */}
              <div className="space-y-2">
<<<<<<< HEAD
                <Label className="text-xs text-muted-foreground">
                  PERMANENT URL SLUG
                </Label>
=======
                <Label className="text-xs text-muted-foreground">PERMANENT URL SLUG</Label>
>>>>>>> 7ff2db269d6f8e780f016f7ffc439452cdee141e
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">/pages/</span>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="h-8 text-primary"
                    placeholder="page-slug"
                  />
                </div>
              </div>

              {/* Page Status */}
              <div className="space-y-2">
<<<<<<< HEAD
                <Label className="text-xs text-muted-foreground">
                  PAGE STATUS
                </Label>
=======
                <Label className="text-xs text-muted-foreground">PAGE STATUS</Label>
>>>>>>> 7ff2db269d6f8e780f016f7ffc439452cdee141e
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={status === "PUBLISHED" ? "default" : "outline"}
                    className={cn(
                      "flex-1 gap-2",
<<<<<<< HEAD
                      status === "PUBLISHED" &&
                        "bg-success hover:bg-success/90",
=======
                      status === "PUBLISHED" && "bg-success hover:bg-success/90"
>>>>>>> 7ff2db269d6f8e780f016f7ffc439452cdee141e
                    )}
                    onClick={() => setStatus("PUBLISHED")}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Published
                  </Button>
                  <Button
                    type="button"
                    variant={status === "DRAFT" ? "default" : "outline"}
                    className="flex-1 gap-2"
                    onClick={() => setStatus("DRAFT")}
                  >
                    <FileText className="h-4 w-4" />
                    Draft
                  </Button>
                </div>
              </div>

              {/* Timestamps */}
              {isEditing && page && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CREATED AT</span>
                    <span className="text-foreground">{page.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LAST MODIFIED</span>
                    <span className="text-foreground">{page.updatedAt}</span>
                  </div>
                </div>
              )}
              {!isEditing && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CREATED AT</span>
                    <span className="text-foreground">NOW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LAST MODIFIED</span>
                    <span className="text-foreground">NOW</span>
                  </div>
                </div>
              )}
            </div>

            {/* Featured Image */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <Label className="text-xs font-medium uppercase">
                  FEATURED IMAGE
                </Label>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {featuredImage ? (
                <div className="relative rounded-lg overflow-hidden border">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-32 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => setFeaturedImage(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
<<<<<<< HEAD
                  <span className="text-sm text-muted-foreground">
                    Click to upload
                  </span>
=======
                  <span className="text-sm text-muted-foreground">Click to upload</span>
>>>>>>> 7ff2db269d6f8e780f016f7ffc439452cdee141e
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
<<<<<<< HEAD
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
=======
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
>>>>>>> 7ff2db269d6f8e780f016f7ffc439452cdee141e
            Discard Changes
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? "Update Page" : "Publish Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
