export type ImageStorageType = 'local' | 'external';
export type ImageBlockStatus = 'uploading' | 'ready' | 'error';
export type ImageAlignment = 'left' | 'center' | 'right';

export interface ImageBlockAttributes {
  src: string;
  blobSrc?: string | null;
  alt?: string;
  caption?: string;
  showCaption?: boolean;
  width?: number | string;
  height?: number | string;
  alignment: ImageAlignment;
  storageType: ImageStorageType;
  status: ImageBlockStatus;
  errorMessage?: string | null;
}

export interface UploadImageResult {
  url: string;
  filename?: string;
  size?: number;
  mimeType?: string;
}

export interface UploadTask {
  taskId: string;
  file: File | Blob;
  previewUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'failed';
  resultUrl?: string;
  error?: string;
}
