export type ImageAlignment = 'left' | 'center' | 'right';

export interface ImageBlockAttributes {
  src: string;
  alt?: string;
  width?: string;
  height?: string;
  align?: ImageAlignment;
  alignment?: ImageAlignment;
  caption?: string;
  showCaption?: boolean;
  status?: 'ready' | 'uploading' | 'error' | 'success';
  file?: File;
  errorMessage?: string | null;
}

export interface UploadImageResult {
  url: string;
  filename?: string;
  size?: number;
  mimeType?: string;
}
