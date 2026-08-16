export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * 校验图片文件格式与体积限制
 */
export function validateImageFile(file: File | Blob): ImageValidationResult {
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `不支持的文件格式 (${file.type || '未知'})。仅支持 PNG、JPEG、GIF、WebP、SVG 图片。`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `文件体积超限 (${sizeMB}MB)。单张图片最大支持 10MB。`,
    };
  }

  return { valid: true };
}

/**
 * 校验 URL 是否具备图片访问路径特征
 */
export function isLikelyImageUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('data:image/') || url.includes('blob:')) return true;
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    return /\.(png|jpg|jpeg|gif|webp|svg)$/.test(pathname);
  } catch {
    return false;
  }
}
