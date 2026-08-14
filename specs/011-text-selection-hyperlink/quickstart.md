# 快速验证与测试指南 (Quickstart & Validation Guide)

**Feature Branch**: `011-text-selection-hyperlink`  
**Date**: 2026-08-14  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## 1. 验证前置准备

在前端项目根目录下运行开发服务或单元测试：

```bash
# 启动前端本地开发服务器
npm run dev --prefix frontend

# 运行自动化前端测试
npm test --prefix frontend
```

---

## 2. 手工验证场景 (Manual Verification Steps)

### 场景 A：添加新超链接
1. 打开浏览器登录/访问文档编辑器主页。
2. 鼠标选中任意段落中的文本内容，观察是否正常调出 `BubbleToolbar`（选中文本浮动工具栏）。
3. 点击工具栏上的“超链接”图标按钮，验证是否正确展开 `LinkInputPanel` 输入浮窗，且 URL 输入框已被自动聚焦。
4. 输入 `github.com` 并按下 Enter 键。
5. 校验选中文本是否成功转换为超链接形式（例如添加下划线与链接文本样式），并且超链接图标在选中该区域时显示高亮。

### 场景 B：编辑与预览已有超链接
1. 光标点击刚才创建的超链接文本，工具栏超链接按钮呈现高亮激活状态。
2. 点击超链接按钮展开面板，输入框中应正确预填 `https://github.com`。
3. 修改地址为 `https://google.com` 并点击保存。
4. 校验文本超链接 `href` 变更为 `https://google.com`。
5. 点击链接面板中的预览/新标签页打开按钮，验证是否成功在浏览器新标签页中打开目标网址。

### 场景 C：取消超链接 (Unlink)
1. 选中已附带超链接的文本，展开超链接面板。
2. 点击“取消链接”按钮（或清空输入框后保存）。
3. 校验超链接样式被完全移除，文本恢复为普通格式，工具栏超链接按钮不再高亮。

---

## 3. 单元测试关注点 (Unit Test Scenarios)

1. `normalizeUrl` 函数测试：
   - 输入 `example.com` 格式化为 `https://example.com`
   - 输入 `http://example.com` 保持 `http://example.com`
   - 输入为空或纯空格时，返回空字符串。
2. `BubbleToolbar` 链接状态联动测试：
   - 包含 `link` mark 的选区中 `editor.isActive('link')` 为 `true`。
