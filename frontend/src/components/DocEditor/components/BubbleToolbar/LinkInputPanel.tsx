import React, { useState, useEffect, useRef } from 'react';
import { Check, Unlink, ExternalLink, X } from 'lucide-react';

export interface LinkInputPanelProps {
  initialUrl?: string;
  hasLink: boolean;
  style?: React.CSSProperties;
  onConfirm: (url: string) => void;
  onUnlink?: () => void;
  onClose: () => void;
}

export const LinkInputPanel: React.FC<LinkInputPanelProps> = ({
  initialUrl = '',
  hasLink,
  style = {},
  onConfirm,
  onUnlink,
  onClose,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm(url);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleOpenExternal = () => {
    if (!url) return;
    const targetUrl = /^(https?:\/\/|mailto:|tel:)/i.test(url) ? url : `https://${url}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '6px 8px',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 100,
        ...style,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="输入或粘贴链接地址..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={(e) => e.stopPropagation()}
        onPaste={(e) => e.stopPropagation()}
        style={{
          border: '1px solid #cbd5e1',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '13px',
          outline: 'none',
          width: '200px',
          color: '#0f172a',
        }}
      />

      <button
        type="button"
        title="应用链接 (Enter)"
        onClick={() => onConfirm(url)}
        style={{
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          padding: '4px 6px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Check size={14} />
      </button>

      {url && (
        <button
          type="button"
          title="在新标签页预览"
          onClick={handleOpenExternal}
          style={{
            background: 'transparent',
            color: '#64748b',
            border: 'none',
            borderRadius: '4px',
            padding: '4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ExternalLink size={14} />
        </button>
      )}

      {hasLink && onUnlink && (
        <button
          type="button"
          title="清除链接"
          onClick={onUnlink}
          style={{
            background: 'transparent',
            color: '#ef4444',
            border: 'none',
            borderRadius: '4px',
            padding: '4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Unlink size={14} />
        </button>
      )}

      <button
        type="button"
        title="关闭 (Esc)"
        onClick={onClose}
        style={{
          background: 'transparent',
          color: '#94a3b8',
          border: 'none',
          borderRadius: '4px',
          padding: '4px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};
