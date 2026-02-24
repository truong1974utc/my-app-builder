export interface DocumentItem {
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

export interface CreateDocumentPayload {
  title: string;
  file: File;
}

export interface UpdateDocumentPayload {
  id: string;
  title: string;
}
