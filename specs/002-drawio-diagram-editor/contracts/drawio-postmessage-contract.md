# Contract: draw.io postMessage 交互契约

## 概述

定义前端宿主应用（DocEditor）与嵌入式 `draw.io` iframe 之间的 `window.postMessage` 事件通信接口规范。

## 消息协议定义

协议交互采用 JSON 格式的消息负载，通过监听 `window.addEventListener('message')` 以及调用 `iframe.contentWindow.postMessage()` 进行双向通信。

---

### 1. 宿主收到：初始化消息 (Init Event)

- **发送方**：draw.io iframe
- **接收方**：宿主应用
- **触发时机**：draw.io 编辑器静态 Web 资源及初始化脚本加载完成时。

```json
{
  "event": "init"
}
```

---

### 2. 宿主发送：载入数据指令 (Load Action)

- **发送方**：宿主应用
- **接收方**：draw.io iframe
- **触发时机**：收到 `init` 事件后，将当前 TipTap 块存储的 XML 图表数据推送到 draw.io。

```json
{
  "action": "load",
  "xml": "<mxfile>...</mxfile>",
  "autosave": 1
}
```

---

### 3. 宿主收到：保存图表事件 (Save / Export Event)

- **发送方**：draw.io iframe
- **接收方**：宿主应用
- **触发时机**：用户在 draw.io 界面中点击“保存/Save”或触发保存动作时。

```json
{
  "event": "save",
  "xml": "<mxfile>...</mxfile>",
  "xmlpng": "data:image/png;base64,..."
}
```

*注：宿主收到 save 事件后，随后向 iframe 请求或同时解析导出 SVG 矢量预览数据。*

---

### 4. 宿主发送：导出 SVG 请求 (Export Action)

- **发送方**：宿主应用
- **接收方**：draw.io iframe
- **触发时机**：需要从 draw.io 显式获取高质量 SVG 格式时。

```json
{
  "action": "export",
  "format": "xmlsvg",
  "spin": "Updating preview"
}
```

---

### 5. 宿主收到：退出/关闭事件 (Exit Event)

- **发送方**：draw.io iframe
- **接收方**：宿主应用
- **触发时机**：用户在 draw.io 界面点击“关闭/Cancel/Exit”或完成保存退出时。

```json
{
  "event": "exit"
}
```

---

## 错误与边界处理

1. **源身份验证 (Origin Check)**：由于使用本地打包的静态 draw.io 资源，必须验证消息来源 `event.origin` 与当前应用的静态资源 origin 一致。
2. **超时重试机制**：如果打开弹窗后 3 秒内未收到 `init` 事件，提示“图表编辑器加载失败，请刷新页面”，防止界面无限等待。
