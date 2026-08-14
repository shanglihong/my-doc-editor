import { describe, it, expect } from 'vitest';
import { validateImageFile, isLikelyImageUrl } from '../utils';

describe('ImageBlock Utilities', () => {
  it('应当正确校验合规的图片文件格式与大小', () => {
    const validFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const result = validateImageFile(validFile);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('应当拦截不支持的文件格式', () => {
    const invalidFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const result = validateImageFile(invalidFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('不支持的文件格式');
  });

  it('应当拦截超大体积的图片文件', () => {
    const hugeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });
    const result = validateImageFile(hugeFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('超限');
  });

  it('应当正确识别常用的图片 URL 路径', () => {
    expect(isLikelyImageUrl('https://example.com/demo.png')).toBe(true);
    expect(isLikelyImageUrl('data:image/jpeg;base64,xxxx')).toBe(true);
    expect(isLikelyImageUrl('blob:http://localhost:5173/123')).toBe(true);
    expect(isLikelyImageUrl('https://example.com/document.pdf')).toBe(false);
  });
});
