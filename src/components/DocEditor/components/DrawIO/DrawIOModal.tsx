import React, { useEffect, useRef } from 'react';
import { parseDrawIOMessage, sendInitialXmlToDrawIO } from './drawioProtocol';
import { X } from 'lucide-react';

interface DrawIOModalProps {
  isOpen: boolean;
  initialXml: string;
  onSave: (xml: string, svg: string) => void;
  onClose: () => void;
  drawioUrl?: string;
}

const DEFAULT_DRAWIO_EMBED = 'https://embed.diagrams.net/?embed=1&ui=min&spin=1&modified=unsaved&proto=json';

export const DrawIOModal: React.FC<DrawIOModalProps> = ({
  isOpen,
  initialXml,
  onSave,
  onClose,
  drawioUrl,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const targetUrl = drawioUrl || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? '/drawio-embed.html' : DEFAULT_DRAWIO_EMBED);

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
          src={targetUrl}
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
