import type { Editor } from '@tiptap/core';
import { TextSelection, NodeSelection } from '@tiptap/pm/state';

export type ToolbarType = 'text' | 'table' | 'callout' | 'image' | 'codeBlock' | 'drawio' | 'default' | null;

export interface HoverTarget {
  id: string;
  type: ToolbarType;
  depth: number;
  nodePos?: number;
  getPos?: (() => number | undefined) | boolean;
  nodeSize?: number;
  deleteNode?: () => void;
  domElement?: HTMLElement;
}

export interface ActiveToolbarInfo {
  type: ToolbarType;
  depth: number;
  target?: HoverTarget | null;
}

/**
 * 全局 Hover 状态管理器：维护全局 Block 悬停栈，确保深层嵌套 Block 优先且全局独占展示工具栏。
 * 支持鼠标在 Block 与工具栏缝隙穿梭时的平滑防抖缓冲（Buffer Delay）。
 */
class HoverStackManager {
  private stack: HoverTarget[] = [];
  private listeners: Set<() => void> = new Set();
  private hideTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  public register(target: HoverTarget) {
    console.log('[HoverStackManager] register:', target);
    this.keepActive();
    this.stack = this.stack.filter((item) => item.id !== target.id);
    this.stack.push(target);
    // 按 depth 降序排序，嵌套最深的位于栈顶
    this.stack.sort((a, b) => b.depth - a.depth);
    console.log('[HoverStackManager] current stack after register:', this.stack);
    this.notify();
  }

  public keepActive(id?: string) {
    if (id && this.hideTimers.has(id)) {
      clearTimeout(this.hideTimers.get(id)!);
      this.hideTimers.delete(id);
    } else if (!id) {
      this.hideTimers.forEach((timer) => clearTimeout(timer));
      this.hideTimers.clear();
    }
  }

  public unregister(id: string, delayMs = 0) {
    console.log('[HoverStackManager] unregister requested for:', id, 'delayMs:', delayMs);
    const doRemove = () => {
      this.stack = this.stack.filter((item) => item.id !== id);
      this.hideTimers.delete(id);
      console.log('[HoverStackManager] stack after unregister removed:', id, 'remaining stack:', this.stack);
      this.notify();
    };

    if (this.hideTimers.has(id)) {
      clearTimeout(this.hideTimers.get(id)!);
      this.hideTimers.delete(id);
    }

    if (delayMs > 0) {
      const timer = setTimeout(doRemove, delayMs);
      this.hideTimers.set(id, timer);
    } else {
      doRemove();
    }
  }

  public setExclusiveTarget(target: HoverTarget | null, delayMs = 0) {
    console.log('[HoverStackManager] setExclusiveTarget:', target, 'delayMs:', delayMs);
    this.keepActive();

    if (!target) {
      if (delayMs > 0) {
        const timer = setTimeout(() => {
          this.hideTimers.delete('__exclusive__');
          if (this.stack.length > 0) {
            console.log('[HoverStackManager] setExclusiveTarget timer triggered: clearing stack');
            this.stack = [];
            this.notify();
          }
        }, delayMs);
        this.hideTimers.set('__exclusive__', timer);
      } else {
        if (this.stack.length > 0) {
          console.log('[HoverStackManager] setExclusiveTarget immediately clearing stack');
          this.stack = [];
          this.notify();
        }
      }
      return;
    }

    const currentActive = this.getActiveTarget();
    if (currentActive?.id === target.id) return;

    this.stack = [target];
    this.notify();
  }

  public getActiveTarget(): HoverTarget | null {
    return this.stack.length > 0 ? this.stack[0] : null;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public clear() {
    this.hideTimers.forEach((timer) => clearTimeout(timer));
    this.hideTimers.clear();
    if (this.stack.length > 0) {
      this.stack = [];
      this.notify();
    }
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }
}

export const hoverStackManager = new HoverStackManager();

/**
 * 统一调度算子：计算当前选区或鼠标悬浮在语法树层次结构中的“唯一活动工具栏”。
 * 严格遵循专注原则与悬停驱动：全局同一时间最多只允许展示一个活动工具栏。
 */
export function getActiveToolbarInfo(
  editor: Editor | null,
  hoveredBlockType?: ToolbarType
): ActiveToolbarInfo {
  if (!editor || !editor.state) {
    return { type: null, depth: -1 };
  }

  const { state } = editor;
  const { selection } = state;
  const { $anchor } = selection;

  // 1. NodeSelection 检查 (如选中的图片或 DrawIO 架构图)
  if (selection instanceof NodeSelection) {
    if (selection.node.type.name === 'imageBlock') {
      return { type: 'image', depth: $anchor.depth };
    } else if (selection.node.type.name === 'drawioBlock') {
      return { type: 'drawio', depth: $anchor.depth };
    }
  }

  // 2. 非空文本选区：优先于 Block Hover 栈 (当高亮块内选中文本时弹出 BubbleToolbar)
  if (selection instanceof TextSelection && !selection.empty && selection.from !== selection.to) {
    if (!editor.isActive('codeBlock')) {
      return { type: 'text', depth: $anchor.depth };
    }
  }

  // 3. 从全局 HoverStack 获取悬停目标
  const activeHover = hoverStackManager.getActiveTarget();
  if (activeHover) {
    return {
      type: activeHover.type,
      depth: activeHover.depth,
      target: activeHover,
    };
  }

  // 4. 仅在 HoverStack 为空且无选区时，若 hoveredBlockType 存在作为最后的低优先级兜底
  if (hoveredBlockType) {
    return { type: hoveredBlockType, depth: 0 };
  }

  return { type: null, depth: -1 };
}
