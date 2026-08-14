import React, { useState, useRef } from 'react';
import { X, Upload, Link2 } from 'lucide-react';
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
          <span className={styles.title}>插入图片</span>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className={styles.segmentedControl}>
          <button
            type="button"
            className={`${styles.segment} ${tab === 'upload' ? styles.segmentActive : ''}`}
            onClick={() => setTab('upload')}
          >
            <Upload size={14} />
            <span>本地图片</span>
          </button>
          <button
            type="button"
            className={`${styles.segment} ${tab === 'url' ? styles.segmentActive : ''}`}
            onClick={() => setTab('url')}
          >
            <Link2 size={14} />
            <span>网络外链</span>
          </button>
        </div>

        <div className={styles.body}>
          {tab === 'upload' ? (
            <div
              className={styles.dropzone}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} className={styles.uploadIcon} />
              <div className={styles.dropzoneText}>点击或拖拽图片至此处上传</div>
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
              <input
                type="url"
                placeholder="粘贴图片 URL 链接..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className={styles.input}
                autoFocus
                required
              />

              <label className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  checked={storeLocally}
                  onChange={(e) => setStoreLocally(e.target.checked)}
                />
                <span>自动转存至本地目录</span>
              </label>

              <div className={styles.footer}>
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
