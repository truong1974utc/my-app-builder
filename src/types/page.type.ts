export interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "PUBLISHED" | "DRAFT";
  createdAt: string;
  updatedAt: string;
  featuredImage?: File
}

export interface CreatePagePayload {
  title: string;
  slug: string;
  content: string;
  status: "PUBLISHED" | "DRAFT";
  featuredImage?: string;
}

export interface UpdatePagePayload extends CreatePagePayload {
  id: string;
}