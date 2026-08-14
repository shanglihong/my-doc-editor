# Walkthrough: 图片 Block 支持与文件存储实现

## 概述

已完整开发实现图片 Block 功能。包含剪贴板粘贴、本地文件导入、拖拽图片导入、网络图片 URL 直嵌与转存存储目录功能。支持乐观 UI 即时预览（Blob 本地渲染 + 等待/加载 Icon）及气泡菜单（图片描述 Caption 编辑、左/中/右对齐控制）。

## 主要变更

### 前端模块扩展

1. **类型定义**: [types.ts](../../frontend/src/components/DocEditor/extensions/ImageBlock/types.ts)
   - 定义 `ImageBlockAttributes`、`ImageStorageType` (`local` | `external`)、`ImageBlockStatus` (`uploading` | `ready` | `error`) 及 `ImageAlignment` (`left` | `center` | `right`)。

2. **统一上传服务**: [imageUploadService.ts](../../frontend/src/components/DocEditor/services/imageUploadService.ts)
   - 实现 `uploadImage` 与 `fetchAndStoreUrl`，支持 API 调用与前端优雅持久化回退。

3. **校验工具**: [utils.ts](../../frontend/src/components/DocEditor/extensions/ImageBlock/utils.ts)
   - 支持图片格式 (PNG, JPEG, GIF, WebP, SVG) 与 10MB 大小限制校验。

4. **ImageBlock Tiptap 扩展**: [ImageBlockExtension.ts](../../frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockExtension.ts)
   - 自定义 Node 节点，配置 `handlePaste` 与 `handleDrop` 事件拦截器，实现剪贴板图片粘贴与图片拖拽放下的乐观 UI 自动上传流程。

5. **交互视图组件**: [ImageBlockView.tsx](../../frontend/src/components/DocEditor/extensions/ImageBlock/ImageBlockView.tsx)
   - 渲染图片 Block、乐观 UI 本地 Blob 预览、旋转加载 Icon 遮罩、错误重试与图片描述 Caption 输入框。

6. **气泡菜单工具栏**: [ImageBubbleMenu.tsx](../../frontend/src/components/DocEditor/extensions/ImageBlock/ImageBubbleMenu.tsx)
   - 选中图片 Block 时浮现，支持左对齐/居中/右对齐切换、图片描述编辑、外链转存本地与删除 Block。

7. **插入对话框组件**: [ImageInsertModal.tsx](../../frontend/src/components/DocEditor/extensions/ImageBlock/ImageInsertModal.tsx)
   - 包含“本地文件导入”与“网络图片链接”标签页，支持直接引用外链或勾选“转存至本地存储目录”。

8. **编辑器入口集成**: [index.tsx](../../frontend/src/components/DocEditor/index.tsx)
   - 注册 `ImageBlockExtension` 节点扩展，集成斜杠菜单快捷项 `/图片` 与遮罩弹窗。

---

## 验证与测试

### 1. 自动化单元测试

运行 `make test` 执行 Vitest 测试：
```bash
make test
```
**结果**: 9 个测试文件共 25 个测试用例全数通过（包括新增的 `ImageBlock.test.tsx`）。

### 2. 交互功能验证

- **剪贴板粘贴 (Paste)**: 在编辑器粘贴图片，即刻显示 Blob 预览与加载 Icon，静默上传存存后渲染正常。
- **拖拽导入 (Drag & Drop)**: 拖拽图片文件到编辑器任意空隙，插入 Image Block 并触发后台上传保存。
- **网络 URL 与转存**: 粘贴网络图片链接并选择转存，成功触发后台下载存储至存储目录。
- **气泡菜单栏**: 选中图片 Block 显示 Bubble Menu，点击左/中/右按钮实时改变样式，输入 Caption 框实时更新描述。
