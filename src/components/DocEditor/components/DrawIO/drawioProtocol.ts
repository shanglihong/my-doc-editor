/**
 * draw.io postMessage 通信辅助与协议解析
 */

export interface DrawIOMessageEvent {
  event?: 'init' | 'save' | 'export' | 'exit' | 'drawio-ready';
  xml?: string;
  svg?: string;
  xmlpng?: string;
}

/**
 * 安全解析 draw.io 消息数据
 */
export function parseDrawIOMessage(data: any): DrawIOMessageEvent | null {
  if (!data) return null;
  
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  if (typeof data === 'object') {
    return data as DrawIOMessageEvent;
  }

  return null;
}

/**
 * 向 draw.io iframe 发送初始 XML 数据
 */
export function sendInitialXmlToDrawIO(iframeEl: HTMLIFrameElement | null, xml: string) {
  if (!iframeEl || !iframeEl.contentWindow) return;

  iframeEl.contentWindow.postMessage(
    {
      type: 'SET_INITIAL_XML',
      xml: xml || '',
    },
    '*'
  );
}
