import React, { useState, useEffect, useRef } from 'react';
import { Check, Unlink, ExternalLink, X } from 'lucide-react';
import styles from './BubbleToolbar.module.css';

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
      className={styles.linkInputPanel}
      style={style}
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
        className={styles.linkInput}
      />

      <button
        type="button"
        title="应用链接 (Enter)"
        onClick={() => onConfirm(url)}
        className={`${styles.linkBtn} ${styles.linkBtnConfirm}`}
      >
        <Check size={14} />
      </button>

      {url && (
        <button
          type="button"
          title="在新标签页预览"
          onClick={handleOpenExternal}
          className={`${styles.linkBtn} ${styles.linkBtnAction}`}
        >
          <ExternalLink size={14} />
        </button>
      )}

      {hasLink && onUnlink && (
        <button
          type="button"
          title="清除链接"
          onClick={onUnlink}
          className={`${styles.linkBtn} ${styles.linkBtnUnlink}`}
        >
          <Unlink size={14} />
        </button>
      )}

      <button
        type="button"
        title="关闭 (Esc)"
        onClick={onClose}
        className={`${styles.linkBtn} ${styles.linkBtnClose}`}
      >
        <X size={14} />
      </button>
    </div>
  );
};
