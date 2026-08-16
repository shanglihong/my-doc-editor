import React, { useEffect, useRef, useState } from 'react';
import { parseDrawIOMessage, sendInitialXmlToDrawIO } from './drawioProtocol';
import { X } from 'lucide-react';

interface DrawIOModalProps {
  isOpen: boolean;
  initialXml: string;
  onSave: (xml: string, svg: string) => void;
  onClose: () => void;
}

const DEFAULT_DRAWIO_EMBED = 'https://embed.diagrams.net/?embed=1&ui=min&spin=1&modified=unsaved&proto=json';
const LOCAL_DRAWIO_APP = '/drawio/drawio-app.html';

const INLINE_BRIDGE_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #f8f9fa; }
    #drawio-iframe { width: 100%; height: 100%; border: none; }
  </style>
</head>
<body>
  <iframe id="drawio-iframe" src="${LOCAL_DRAWIO_APP}?embed=1&ui=min&spin=1&modified=unsavedChanges&proto=json" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"></iframe>
  <script>
    (function() {
      const iframe = document.getElementById('drawio-iframe');
      let currentXml = '';
      window.addEventListener('message', function(e) {
        if (!e.data) return;
        let msg = e.data;
        if (typeof msg === 'string') { try { msg = JSON.parse(msg); } catch (err) {} }
        if (typeof msg !== 'object') return;
        if (msg.type === 'SET_INITIAL_XML') { currentXml = msg.xml || ''; return; }
        if (msg.event === 'init') {
          try { iframe.contentWindow.postMessage(JSON.stringify({ action: 'load', xml: currentXml, autosave: 1 }), '*'); } catch (err) {}
          try { window.parent.postMessage(JSON.stringify({ event: 'drawio-ready' }), '*'); } catch (err) {}
        }
        if (msg.event === 'save') {
          try { iframe.contentWindow.postMessage(JSON.stringify({ action: 'export', format: 'xmlsvg', spin: 'Saving' }), '*'); } catch (err) {}
        }
        if (msg.event === 'export') {
          const previewData = msg.data || msg.xmlpng || '';
          try { window.parent.postMessage(JSON.stringify({ event: 'save', xml: msg.xml || currentXml, svg: previewData }), '*'); } catch (err) {}
        }
        if (msg.event === 'exit') {
          try { window.parent.postMessage(JSON.stringify({ event: 'exit' }), '*'); } catch (err) {}
        }
      });
    })();
  </script>
</body>
</html>`;

type RenderMode = { type: 'url'; url: string } | { type: 'srcdoc'; html: string };

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

    // 如果是宿主 SPA 降级返回的 index.html (通常含有 root 挂载点) 且缺少 draw.io 关键字，判定为不可用
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
    () => cachedMode || { type: 'url', url: DEFAULT_DRAWIO_EMBED }
  );

  useEffect(() => {
    if (cachedMode) {
      setRenderMode(cachedMode);
      return;
    }

    let isMounted = true;

    // 探针检测调用方是否部署了离线画图主程序 /drawio/drawio-app.html
    checkRealDrawIOFile(LOCAL_DRAWIO_APP, 'drawio')
      .then((isOfflineAvailable) => {
        const mode: RenderMode = isOfflineAvailable
          ? { type: 'srcdoc', html: INLINE_BRIDGE_HTML }
          : { type: 'url', url: DEFAULT_DRAWIO_EMBED };

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
          src={renderMode.type === 'url' ? renderMode.url : undefined}
          srcDoc={renderMode.type === 'srcdoc' ? renderMode.html : undefined}
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
