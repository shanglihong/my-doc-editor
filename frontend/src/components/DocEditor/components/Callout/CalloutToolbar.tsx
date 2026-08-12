import React, { useState } from 'react';
import { CALLOUT_THEMES } from '../../utils/defaultTheme';
import type { CalloutTheme } from '../../utils/defaultTheme';
import styles from '../../DocEditor.module.css';

interface CalloutToolbarProps {
  currentTheme: string;
  currentIcon: string;
  onSelectTheme: (themeId: string) => void;
  onSelectIcon: (icon: string, iconType: 'lucide' | 'emoji') => void;
}

const PRESET_EMOJIS = ['💡', 'ℹ️', '⚠️', '🚨', '✅', '📌', '🔥', '⭐', '🚀', '📝', '❓', '🎉'];

export const CalloutToolbar: React.FC<CalloutToolbarProps> = ({
  currentTheme,
  currentIcon: _currentIcon,
  onSelectTheme,
  onSelectIcon,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className={styles.calloutToolbar}>
      <button
        type="button"
        className={styles.calloutToolbarBtn}
        onClick={() => setShowPicker(!showPicker)}
        title="更换主题与图标"
      >
        样式与图标
      </button>

      {showPicker && (
        <div className={styles.calloutPickerPopover}>
          <div className={styles.pickerSection}>
            <div className={styles.pickerTitle}>预设主题</div>
            <div className={styles.themeGrid}>
              {CALLOUT_THEMES.map((theme: CalloutTheme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={`${styles.themeOption} ${currentTheme === theme.id ? styles.themeOptionActive : ''}`}
                  style={{ backgroundColor: theme.bgColor, borderColor: theme.borderColor, color: theme.textColor }}
                  onClick={() => {
                    onSelectTheme(theme.id);
                  }}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.pickerSection}>
            <div className={styles.pickerTitle}>常用图标</div>
            <div className={styles.emojiGrid}>
              {PRESET_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={styles.emojiOption}
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
        </div>
      )}
    </div>
  );
};
