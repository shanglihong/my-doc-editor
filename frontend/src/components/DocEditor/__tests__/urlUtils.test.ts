import { describe, it, expect } from 'vitest';
import { normalizeUrl } from '../utils/urlUtils';

describe('normalizeUrl', () => {
  it('应给缺少协议前缀的纯域名增加 https:// 前缀', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com');
    expect(normalizeUrl('www.google.com/search?q=test')).toBe('https://www.google.com/search?q=test');
  });

  it('应保持已含有 http:// 或 https:// 协议前缀的 URL 原样', () => {
    expect(normalizeUrl('http://example.com')).toBe('http://example.com');
    expect(normalizeUrl('https://example.com/foo')).toBe('https://example.com/foo');
  });

  it('应保持相对路径、锚点、mailto 及 tel 协议原样', () => {
    expect(normalizeUrl('/relative/path')).toBe('/relative/path');
    expect(normalizeUrl('#section-1')).toBe('#section-1');
    expect(normalizeUrl('mailto:test@example.com')).toBe('mailto:test@example.com');
    expect(normalizeUrl('tel:12345678')).toBe('tel:12345678');
  });

  it('对于空字符串或仅包含空格的输入应返回空字符串', () => {
    expect(normalizeUrl('')).toBe('');
    expect(normalizeUrl('   ')).toBe('');
  });
});
