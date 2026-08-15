import React, { useState } from 'react';
import { DARK_THEME_COLOR_PRESETS, LIGHT_THEME_COLOR_PRESETS } from '../../utils/defaultTheme';
import type { ColorCategory } from '../../utils/defaultTheme';
import styles from './UnifiedColorPicker.module.css';

export interface UnifiedColorPickerProps {
  allowedCategories?: ColorCategory[];
  defaultCategory?: ColorCategory;
  currentColor?: string;
  currentTextColor?: string;
  currentBgColor?: string;
  currentBorderColor?: string;
  bgSingleRowOnly?: boolean;
  onSelectColor: (color: string, category: ColorCategory) => void;
  onResetColor?: () => void;
  className?: string;
}

export const UnifiedColorPicker: React.FC<UnifiedColorPickerProps> = ({
  allowedCategories = ['textColor', 'backgroundColor', 'borderColor'],
  currentColor,
  currentTextColor,
  currentBgColor,
  currentBorderColor,
  bgSingleRowOnly = false,
  onSelectColor,
  onResetColor,
  className = '',
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });

  // 监听 html[data-theme] 的变动，确保切换日/夜间模式时调色板色系 100% 实时同步切换
  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver(() => {
      const currentTheme =
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const isDarkMode = theme === 'dark';

  const presets = isDarkMode ? DARK_THEME_COLOR_PRESETS : LIGHT_THEME_COLOR_PRESETS;
  const hasTextColor = allowedCategories.includes('textColor');
  const hasBgColor = allowedCategories.includes('backgroundColor');
  const hasBorderColor = allowedCategories.includes('borderColor');

  const textColorVal = currentTextColor !== undefined ? currentTextColor : currentColor;
  const bgColorVal = currentBgColor !== undefined ? currentBgColor : currentColor;
  const borderColorVal = currentBorderColor !== undefined ? currentBorderColor : currentColor;

  return (
    <div
      className={`${styles.container} ${className}`}
      style={{ width: '228px', padding: '10px' }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* 边框颜色分类 (使用纯浅色块展示) */}
      {hasBorderColor && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '6px', fontWeight: 500 }}>
            边框颜色
          </div>
          <div className={styles.colorGrid8Cols} style={{ display: 'grid', gap: '3px' }}>
            {presets.map((preset, idx) => {
              const borderVal = preset.borderValue || preset.bgValueSecondary || preset.textValue;
              const lightPreset = LIGHT_THEME_COLOR_PRESETS.find((p) => p.hue === preset.hue);
              const darkPreset = DARK_THEME_COLOR_PRESETS.find((p) => p.hue === preset.hue);

              const isDefaultSelected = idx === 0 && (!borderColorVal || borderColorVal === 'transparent' || borderColorVal === 'none' || borderColorVal === 'default');

              const isSelected =
                isDefaultSelected ||
                (borderColorVal &&
                  idx !== 0 &&
                  ((borderColorVal.toLowerCase() === borderVal.toLowerCase()) ||
                    (lightPreset && (lightPreset.borderValue?.toLowerCase() === borderColorVal.toLowerCase() || lightPreset.bgValueSecondary?.toLowerCase() === borderColorVal.toLowerCase())) ||
                    (darkPreset && (darkPreset.borderValue?.toLowerCase() === borderColorVal.toLowerCase() || darkPreset.bgValueSecondary?.toLowerCase() === borderColorVal.toLowerCase()))));

              if (idx === 0) {
                return (
                  <button
                    key="border-none"
                    type="button"
                    className={`${styles.colorSwatch} ${isSelected ? styles.colorSwatchActive : ''}`}
                    style={{
                      backgroundColor: isDarkMode ? '#27272a' : '#ffffff',
                      position: 'relative',
                    }}
                    title="无边框"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSelectColor('transparent', 'borderColor')}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '1px',
                        backgroundColor: '#94a3b8',
                        transform: 'rotate(-45deg)',
                      }}
                    />
                  </button>
                );
              }

              return (
                <button
                  key={`border-${preset.hue}`}
                  type="button"
                  className={`${styles.colorSwatch} ${isSelected ? styles.colorSwatchActive : ''}`}
                  style={{
                    backgroundColor: borderVal,
                  }}
                  title={`边框: ${preset.name}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelectColor(borderVal, 'borderColor')}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 字体颜色分类 */}
      {hasTextColor && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '6px', fontWeight: 500 }}>
            字体颜色
          </div>
          <div className={styles.colorGrid8Cols} style={{ display: 'grid', gap: '3px' }}>
            {presets.map((preset, idx) => {
              // 当无传入色值或传入为默认值时，高亮选中第一个默认色块
              const isDefaultSelected = idx === 0 && (!textColorVal || textColorVal === 'inherit' || textColorVal === 'default');

              const isSelected =
                isDefaultSelected ||
                (textColorVal &&
                  idx !== 0 &&
                  (textColorVal.toLowerCase() === preset.textValue.toLowerCase() ||
                    LIGHT_THEME_COLOR_PRESETS.find((p) => p.hue === preset.hue)?.textValue.toLowerCase() === textColorVal.toLowerCase() ||
                    DARK_THEME_COLOR_PRESETS.find((p) => p.hue === preset.hue)?.textValue.toLowerCase() === textColorVal.toLowerCase()));

              return (
                <button
                  key={`text-${preset.hue}`}
                  type="button"
                  className={`${styles.colorSwatch} ${isSelected ? styles.colorSwatchActive : ''}`}
                  style={{
                    backgroundColor: isDarkMode ? '#27272a' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={`字体: ${preset.name}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelectColor(preset.textValue, 'textColor')}
                >
                  <span style={{ color: preset.textValue, fontSize: '11px', fontWeight: 600, lineHeight: 1 }}>
                    A
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 背景颜色分类 */}
      {hasBgColor && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '11px', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '6px', fontWeight: 500 }}>
            背景颜色
          </div>
          {/* 第一排 8 个（含斜线无背景） */}
          <div className={styles.colorGrid8Cols} style={{ display: 'grid', gap: '3px', marginBottom: bgSingleRowOnly ? '0' : '3px' }}>
            {presets.map((preset, idx) => {
              const lightPreset = LIGHT_THEME_COLOR_PRESETS.find((p) => p.hue === preset.hue);
              const darkPreset = DARK_THEME_COLOR_PRESETS.find((p) => p.hue === preset.hue);

              // 当无背景色或传入为 transparent 时，高亮选中第一个斜线无背景块
              const isDefaultSelected = idx === 0 && (!bgColorVal || bgColorVal === 'transparent' || bgColorVal === 'none');

              const isSelected =
                isDefaultSelected ||
                (bgColorVal &&
                  idx !== 0 &&
                  ((bgColorVal.toLowerCase() === preset.bgValue.toLowerCase()) ||
                    (lightPreset && lightPreset.bgValue.toLowerCase() === bgColorVal.toLowerCase()) ||
                    (darkPreset && darkPreset.bgValue.toLowerCase() === bgColorVal.toLowerCase())));

              if (idx === 0) {
                return (
                  <button
                    key="bg-none"
                    type="button"
                    className={`${styles.colorSwatch} ${isSelected ? styles.colorSwatchActive : ''}`}
                    style={{
                      backgroundColor: isDarkMode ? '#27272a' : '#ffffff',
                      position: 'relative',
                    }}
                    title="无背景"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSelectColor('transparent', 'backgroundColor')}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '1px',
                        backgroundColor: '#94a3b8',
                        transform: 'rotate(-45deg)',
                      }}
                    />
                  </button>
                );
              }

              return (
                <button
                  key={`bg-1-${preset.hue}`}
                  type="button"
                  className={`${styles.colorSwatch} ${isSelected ? styles.colorSwatchActive : ''}`}
                  style={{
                    backgroundColor: preset.bgValue,
                  }}
                  title={`背景: ${preset.name}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onSelectColor(preset.bgValue, 'backgroundColor')}
                />
              );
            })}
          </div>

          {/* 第二排 8 个（仅当 !bgSingleRowOnly 时渲染） */}
          {!bgSingleRowOnly && (
            <div className={styles.colorGrid8Cols} style={{ display: 'grid', gap: '3px' }}>
              {presets.map((preset) => {
                const bgVal = preset.bgValueSecondary || preset.bgValue;
                const lightPreset = LIGHT_THEME_COLOR_PRESETS.find((p) => p.hue === preset.hue);
                const darkPreset = DARK_THEME_COLOR_PRESETS.find((p) => p.hue === preset.hue);

                const isSelected =
                  bgColorVal &&
                  ((bgColorVal.toLowerCase() === bgVal.toLowerCase()) ||
                    (lightPreset && lightPreset.bgValueSecondary?.toLowerCase() === bgColorVal.toLowerCase()) ||
                    (darkPreset && darkPreset.bgValueSecondary?.toLowerCase() === bgColorVal.toLowerCase()));

                return (
                  <button
                    key={`bg-2-${preset.hue}`}
                    type="button"
                    className={`${styles.colorSwatch} ${isSelected ? styles.colorSwatchActive : ''}`}
                    style={{
                      backgroundColor: bgVal,
                    }}
                    title={`背景: ${preset.name}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSelectColor(bgVal, 'backgroundColor')}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 恢复默认长条按钮 */}
      {onResetColor && (
        <button
          type="button"
          className={styles.fullResetBtn}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onResetColor}
        >
          恢复默认
        </button>
      )}
    </div>
  );
};
