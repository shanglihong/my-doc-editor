import React, { useEffect, useRef, useState } from 'react';
import { parseDrawIOMessage, sendInitialXmlToDrawIO } from './drawioProtocol';
import { X } from 'lucide-react';
import drawioBridgeTemplate from './drawioBridgeTemplate.html?raw';

interface DrawIOModalProps {
  isOpen: boolean;
  initialXml: string;
  onSave: (xml: string, svg: string) => void;
  onClose: () => void;
}

const ONLINE_DRAWIO_APP = 'https://embed.diagrams.net/?embed=1&ui=min&spin=1&modified=unsavedChanges&proto=json&lang=zh';
const LOCAL_DRAWIO_APP = '/drawio/drawio-app.html';

/**
 * 生成内置的 Bridge 桥接 HTML，统一离线与在线 draw.io 的 postMessage 协议转换
 */
function getBridgeHtml(targetAppUrl: string): string {
  return drawioBridgeTemplate.replace('__TARGET_APP_URL__', targetAppUrl);
}

type RenderMode = { type: 'srcdoc'; html: string };

let cachedMode: RenderMode | null = null;

/**
 * 校验 HTTP 响应文本，防止 Vite/Webpack DevServer SPA 路由兜底拦截将 404 请求误判为 200 (返回宿主 index.html)
 */
async function checkRealDrawIOFile(url: string, expectedPattern: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) return false;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return false;

    const text = await res.text();
    const lowerText = text.toLowerCase();
    const lowerPattern = expectedPattern.toLowerCase();

    if (lowerText.includes('id="root"') && !lowerText.includes(lowerPattern) && !lowerText.includes('drawio')) {
      return false;
    }
    return lowerText.includes(lowerPattern) || lowerText.includes('drawio');
  } catch {
    return false;
  }
}

export const DrawIOModal: React.FC<DrawIOModalProps> = ({
  isOpen,
  initialXml,
  onSave,
  onClose,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [renderMode, setRenderMode] = useState<RenderMode>(
    () => cachedMode || { type: 'srcdoc', html: getBridgeHtml(ONLINE_DRAWIO_APP) }
  );

  useEffect(() => {
    if (cachedMode) {
      setRenderMode(cachedMode);
      return;
    }

    let isMounted = true;

    // 探针检测：判断调用方是否部署了离线画图主程序 /drawio/drawio-app.html
    checkRealDrawIOFile(LOCAL_DRAWIO_APP, 'drawio')
      .then((isOfflineAvailable) => {
        const targetUrl = isOfflineAvailable
          ? `${LOCAL_DRAWIO_APP}?embed=1&ui=min&spin=1&modified=unsavedChanges&proto=json&lang=zh`
          : ONLINE_DRAWIO_APP;

        const mode: RenderMode = { type: 'srcdoc', html: getBridgeHtml(targetUrl) };

        cachedMode = mode;
        if (isMounted) {
          setRenderMode(mode);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (e: MessageEvent) => {
      const msg = parseDrawIOMessage(e.data);
      if (!msg) return;

      if (msg.event === 'drawio-ready') {
        sendInitialXmlToDrawIO(iframeRef.current, initialXml);
      }

      if (msg.event === 'save') {
        onSave(msg.xml || '', msg.svg || '');
        onClose();
      }

      if (msg.event === 'exit') {
        onClose();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen, initialXml, onSave, onClose]);

  const handleIframeLoad = () => {
    sendInitialXmlToDrawIO(iframeRef.current, initialXml);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          height: '48px',
          backgroundColor: '#1e1e1e',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid #333333',
        }}
      >
        <div style={{ fontWeight: 600, fontSize: '15px' }}>draw.io 架构与流程图编辑器</div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#aaaaaa',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
          title="关闭"
        >
          <X size={20} />
        </button>
      </div>
      <div style={{ flex: 1, position: 'relative', width: '100%', height: 'calc(100% - 48px)' }}>
        <iframe
          ref={iframeRef}
          srcDoc={renderMode.html}
          onLoad={handleIframeLoad}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="draw.io Editor"
        />
      </div>
    </div>
  );
};
