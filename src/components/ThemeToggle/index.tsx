import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import styles from './ThemeToggle.module.css';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // 初始化读取用户保存的主题或系统首选项
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'light';
      setTheme(initial);
      document.documentElement.setAttribute('data-theme', initial);
    }
  }, []);

  // 切换主题
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('app-theme', next);
      return next;
    });
  }, []);

  return (
    <button
      type="button"
      className={styles.themeToggleBtn}
      onClick={toggleTheme}
      title={theme === 'light' ? '切换至深色模式' : '切换至浅色模式'}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};
