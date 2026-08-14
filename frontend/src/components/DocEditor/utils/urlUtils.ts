/**
 * 规范化 URL 地址
 * 若用户输入的 URL 缺少协议前缀（如 example.com），自动补全 https:// 协议前缀
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  if (/^(https?:\/\/|mailto:|tel:|ftp:\/\/|\/|#)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
