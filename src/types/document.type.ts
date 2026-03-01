export interface Document {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  owner: {
    id: string;
    fullName: string;
  };
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  fileSizeFormatted: string;
  previewUrl: string;
  downloadUrl: string;
  owner: {
    id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
}
