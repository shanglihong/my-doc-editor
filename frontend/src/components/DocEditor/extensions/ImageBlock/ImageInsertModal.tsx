import React, { useState, useRef } from 'react';
import { X, UploadCloud } from 'lucide-react';
import styles from './ImageInsertModal.module.css';
import { validateImageFile } from './utils';

export interface ImageInsertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertLocalFile: (file: File) => void;
  onInsertUrl: (url: string, storeLocally: boolean) => void;
}

export const ImageInsertModal: React.FC<ImageInsertModalProps> = ({
  isOpen,
  onClose,
  onInsertLocalFile,
  onInsertUrl,
}) => {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [storeLocally, setStoreLocally] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }
      onInsertLocalFile(file);
      onClose();
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onInsertUrl(urlInput.trim(), storeLocally);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>插入图片 Block</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${tab === 'upload' ? styles.activeTab : ''}`}
            onClick={() => setTab('upload')}
          >
            本地文件导入
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === 'url' ? styles.activeTab : ''}`}
            onClick={() => setTab('url')}
          >
            网络图片链接
          </button>
        </div>

        <div className={styles.body}>
          {tab === 'upload' ? (
            <div
              className={styles.dropzone}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={36} />
              <span>点击选择本地图片或拖拽图片到此处</span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                支持 PNG, JPEG, GIF, WebP (最大 10MB)
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <form onSubmit={handleUrlSubmit} className={styles.urlForm}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>图片 URL 地址</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.png"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className={styles.input}
                  autoFocus
                  required
                />
              </div>

              <label className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  checked={storeLocally}
                  onChange={(e) => setStoreLocally(e.target.checked)}
                />
                <span>转存至本地存储目录（防盗链 / 离线可用）</span>
              </label>

              <div className={styles.footer} style={{ padding: 0, background: 'transparent' }}>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>
                  取消
                </button>
                <button type="submit" className={styles.submitBtn}>
                  确认插入
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
