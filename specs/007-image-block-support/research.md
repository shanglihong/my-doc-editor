# Phase 0 Research: 图片 Block 支持与文件存储

## 方案调研与技术决策

### 决策一：Tiptap 自定义 Node 扩展 (ImageBlock Node)

- **决策结果**: 自定义 Tiptap `Node` 扩展 `ImageBlock`。
- **决定依据**: 
  - 需要在图片 Block 中承载丰富状态（如乐观 UI 预览、加载等待 Icon、上传失败重试遮罩、外链/本地存储模式标识以及悬浮菜单）。
  - 自定义 Node 可通过 React Component (NodeView) 实现高灵活度的交互与动画。
- **备选方案对比**: 
  - *备选方案 A*: 原生 `@tiptap/extension-image`。缺点是仅支持简单 `<img>` 标签渲染，无法无缝嵌入加载 Icon、转存按钮与上传状态指示器。
  - *备选方案 B*: 纯文本 Markdown 语法渲染。缺点是无法支持拖拽交互与状态动画。

---

### 决策二：剪贴板粘贴 (Paste) 与拖拽 (Drag & Drop) 事件拦截机制

- **决策结果**: 在 Tiptap 编辑器 `editorProps` 中配置 `handlePaste` 与 `handleDrop` 拦截器。
- **决定依据**: 
  - 当拦截到 `image/*` MIME 类型的 `File` 对象或剪贴板数据时，阻止浏览器默认行为。
  - 立即通过 `URL.createObjectURL(file)` 获得临时 Blob 路径，创建一个初始状态为 `status: "uploading"`、`storageType: "local"` 的图片 Block。
  - 异步调用存储服务上传，上传成功后通过 Node 属性更新（`updateAttributes`）静默将 src 替换为持久化路径，同时将 status 改为 `"ready"`。
- **备选方案对比**: 
  - *备选方案*: 等待上传 HTTP 响应返回后再插入 Block。缺点是会导致用户感知延迟，违背乐观 UI 即时预览原则。

---

### 决策三：网络外链直嵌与本地转存双模式策略

- **决策结果**: 
  - 用户输入网络图片 URL 时，提供“直接外链”与“转存本地目录”选项。
  - 选择外链时，`storageType` 标记为 `"external"`，直接关联原始 URL。
  - 选择转存时，触发后台下载接口，将其拉取存入存储目录（如 `public/uploads/` 或应用后端存储目录），并升级 `storageType` 为 `"local"`。
- **决定依据**: 
  - 满足防盗链/离线访问场景（转存本地），同时兼顾不需要占用本地存储空间的轻量使用需求（外链直嵌）。

---

### 决策四：存储服务与路径规范

- **决策结果**: 构建前端 `imageUploadService` 统一抽象层，生产环境/开发环境对接 Backend `/api/upload` 或本地存储挂载目录。
- **决定依据**: 
  - 存储目录使用 Hash + 时间戳重命名文件（如 `img_20260814_a1b2c3d4.png`），避免文件名冲突。
  - 支持文件类型（PNG、JPEG、GIF、WebP）与大小（默认限制 10MB）校验。
