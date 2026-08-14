# Image Storage API Contract

## 1. 上传图片文件接口 (POST /api/upload/image)

用户通过粘贴、拖拽或本地文件选择导入图片时调用的后端/服务接口。

### Request

- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `file`: File (二进制图片文件对象，支持 png, jpeg, gif, webp)

### Response

#### 成功响应 (200 OK)

```json
{
  "success": true,
  "data": {
    "url": "/uploads/img_20260814_8f9a2b.png",
    "filename": "img_20260814_8f9a2b.png",
    "size": 1048576,
    "mimeType": "image/png"
  }
}
```

#### 失败响应 (400 / 500)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "仅支持上传 PNG、JPEG、GIF、WebP 格式的图片文件"
  }
}
```

---

## 2. 网络外链转存接口 (POST /api/upload/fetch-url)

用户选择将网络图片外链转存至本地存储目录时调用的服务接口。

### Request

- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body**:

```json
{
  "url": "https://example.com/images/sample.jpg"
}
```

### Response

#### 成功响应 (200 OK)

```json
{
  "success": true,
  "data": {
    "url": "/uploads/img_20260814_c3d4e5.jpg",
    "originalUrl": "https://example.com/images/sample.jpg",
    "size": 524288,
    "mimeType": "image/jpeg"
  }
}
```

#### 失败响应 (400 / 502)

```json
{
  "success": false,
  "error": {
    "code": "FETCH_FAILED",
    "message": "无法从提供的网络链接下载图片或目标链接不可访问"
  }
}
```
