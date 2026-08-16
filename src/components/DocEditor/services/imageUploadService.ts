import type { UploadImageResult } from '../components/ImageBlock/types';

/**
 * 统一图片上传服务
 * 处理本地文件/二进制 Blob 上传以及网络 URL 转存本地目录
 */
export class ImageUploadService {
  /**
   * 上传图片文件/二进制到存储目录
   */
  static async uploadImage(file: File | Blob): Promise<UploadImageResult> {
    const formData = new FormData();
    const fileName = file instanceof File ? file.name : 'pasted_image.png';
    formData.append('file', file, fileName);

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data?.url) {
          return json.data;
        }
      }
    } catch {
      // 在开发阶段/静默回退处理：如果后端未启动 API 服务，生成本地 Blob 数据 URL / 假持久化 URL
    }

    // 开发/备用回退机制：将 Blob 转化为持久 DataURL 或存入 IndexedDB/localStorage 模拟存储
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve({
            url: reader.result,
            filename: fileName,
            size: file.size,
            mimeType: file.type || 'image/png',
          });
        } else {
          reject(new Error('读取图片二进制数据失败'));
        }
      };
      reader.onerror = () => reject(new Error('文件读取错误'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * 转存网络外链图片到本地存储目录
   */
  static async fetchAndStoreUrl(url: string): Promise<UploadImageResult> {
    try {
      const response = await fetch('/api/upload/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data?.url) {
          return json.data;
        }
      }
    } catch {
      // 静默回退
    }

    // 备用回退逻辑：尝试前端 fetch blob 并转为持久化对象
    try {
      const imgRes = await fetch(url);
      if (imgRes.ok) {
        const blob = await imgRes.blob();
        return this.uploadImage(blob);
      }
    } catch {
      // 无法获取时使用原 URL 兜底
    }

    return { url };
  }
}
