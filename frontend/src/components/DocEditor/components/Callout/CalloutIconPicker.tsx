import React, { useState } from 'react';
import styles from '../../DocEditor.module.css';

interface CalloutIconPickerProps {
  currentIcon: string;
  onSelectIcon: (icon: string, iconType: 'lucide' | 'emoji') => void;
}

const PRESET_EMOJIS = [
  '💡', 'ℹ️', '⚠️', '🚨', '✅', '📌',
  '🔥', '⭐', '🚀', '📝', '❓', '🎉',
  '📎', '🔖', '🧩', '💬', '🎯', '🔐',
];

export const CalloutIconPicker: React.FC<CalloutIconPickerProps> = ({
  currentIcon,
  onSelectIcon,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className={styles.calloutToolbar}>
      <button
        type="button"
        className={styles.calloutIcon}
        onClick={() => setShowPicker(!showPicker)}
        title="点击切换图标"
      >
        {currentIcon || '💡'}
      </button>

      {showPicker && (
        <div className={styles.calloutPickerPopover}>
          <div className={styles.pickerTitle} style={{ marginBottom: 8 }}>选择图标</div>
          <div className={styles.emojiGrid}>
            {PRESET_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`${styles.emojiOption} ${currentIcon === emoji ? styles.themeOptionActive : ''}`}
                onClick={() => {
                  onSelectIcon(emoji, 'emoji');
                  setShowPicker(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
