export type ImageBlockStatus = 'uploading' | 'ready' | 'error';
export type ImageAlignment = 'left' | 'center' | 'right';

export interface ImageBlockAttributes {
  src: string;
  alt?: string;
  caption?: string;
  showCaption?: boolean;
  width?: number | string;
  height?: number | string;
  alignment: ImageAlignment;
  status: ImageBlockStatus;
  errorMessage?: string | null;
}

export interface UploadImageResult {
  url: string;
  filename?: string;
  size?: number;
  mimeType?: string;
}
