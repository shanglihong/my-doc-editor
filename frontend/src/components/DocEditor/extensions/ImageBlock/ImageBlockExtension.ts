import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { ImageBlockView } from './ImageBlockView';
import type { ImageBlockAttributes } from './types';
import { validateImageFile } from './utils';
import { ImageUploadService } from '../../services/imageUploadService';

export interface ImageBlockOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageBlock: {
      setImageBlock: (attributes: Partial<ImageBlockAttributes>) => ReturnType;
    };
  }
}

export const ImageBlockExtension = Node.create<ImageBlockOptions>({
  name: 'imageBlock',

  group: 'block',

  draggable: true,

  selectable: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: '',
      },
      blobSrc: {
        default: null,
      },
      alt: {
        default: '',
      },
      caption: {
        default: '',
      },
      showCaption: {
        default: false,
      },
      width: {
        default: 'auto',
      },
      height: {
        default: 'auto',
      },
      alignment: {
        default: 'center',
      },
      storageType: {
        default: 'local',
      },
      status: {
        default: 'ready',
      },
      errorMessage: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'image-block',
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockView);
  },

  addCommands() {
    return {
      setImageBlock:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imageBlockPasteDropHandler'),
        props: {
          handlePaste(view, event) {
            const items = Array.from(event.clipboardData?.items || []);
            const imageItem = items.find((item) => item.type.startsWith('image/'));

            if (!imageItem) return false;

            const file = imageItem.getAsFile();
            if (!file) return false;

            event.preventDefault();

            // 校验文件
            const validation = validateImageFile(file);
            if (!validation.valid) {
              alert(validation.error);
              return true;
            }

            // 乐观 UI 即时预览
            const previewUrl = URL.createObjectURL(file);
            const { tr } = view.state;
            const nodeType = view.state.schema.nodes.imageBlock;

            if (!nodeType) return false;

            const node = nodeType.create({
              src: previewUrl,
              blobSrc: previewUrl,
              storageType: 'local',
              status: 'uploading',
              alignment: 'center',
            });

            const transaction = tr.replaceSelectionWith(node);
            view.dispatch(transaction);

            // 异步后台上传
            ImageUploadService.uploadImage(file)
              .then((result) => {
                view.state.doc.descendants((docNode, pos) => {
                  if (
                    docNode.type.name === 'imageBlock' &&
                    docNode.attrs.blobSrc === previewUrl
                  ) {
                    const trUpdate = view.state.tr.setNodeMarkup(
                      pos,
                      undefined,
                      {
                        ...docNode.attrs,
                        src: result.url,
                        blobSrc: null,
                        status: 'ready',
                      }
                    );
                    view.dispatch(trUpdate);
                  }
                });
              })
              .catch((err) => {
                view.state.doc.descendants((docNode, pos) => {
                  if (
                    docNode.type.name === 'imageBlock' &&
                    docNode.attrs.blobSrc === previewUrl
                  ) {
                    const trUpdate = view.state.tr.setNodeMarkup(
                      pos,
                      undefined,
                      {
                        ...docNode.attrs,
                        status: 'error',
                        errorMessage: err?.message || '图片上传保存失败',
                      }
                    );
                    view.dispatch(trUpdate);
                  }
                });
              });

            return true;
          },

          handleDrop(view, event) {
            const files = Array.from(event.dataTransfer?.files || []);
            const imageFile = files.find((f) => f.type.startsWith('image/'));

            if (!imageFile) return false;

            event.preventDefault();

            const validation = validateImageFile(imageFile);
            if (!validation.valid) {
              alert(validation.error);
              return true;
            }

            const dropPos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })?.pos;

            const previewUrl = URL.createObjectURL(imageFile);
            const nodeType = view.state.schema.nodes.imageBlock;

            if (!nodeType) return false;

            const node = nodeType.create({
              src: previewUrl,
              blobSrc: previewUrl,
              storageType: 'local',
              status: 'uploading',
              alignment: 'center',
            });

            const insertPos = dropPos ?? view.state.selection.from;
            const tr = view.state.tr.insert(insertPos, node);
            view.dispatch(tr);

            // 异步后台上传
            ImageUploadService.uploadImage(imageFile)
              .then((result) => {
                view.state.doc.descendants((docNode, pos) => {
                  if (
                    docNode.type.name === 'imageBlock' &&
                    docNode.attrs.blobSrc === previewUrl
                  ) {
                    const trUpdate = view.state.tr.setNodeMarkup(
                      pos,
                      undefined,
                      {
                        ...docNode.attrs,
                        src: result.url,
                        blobSrc: null,
                        status: 'ready',
                      }
                    );
                    view.dispatch(trUpdate);
                  }
                });
              })
              .catch((err) => {
                view.state.doc.descendants((docNode, pos) => {
                  if (
                    docNode.type.name === 'imageBlock' &&
                    docNode.attrs.blobSrc === previewUrl
                  ) {
                    const trUpdate = view.state.tr.setNodeMarkup(
                      pos,
                      undefined,
                      {
                        ...docNode.attrs,
                        status: 'error',
                        errorMessage: err?.message || '图片上传保存失败',
                      }
                    );
                    view.dispatch(trUpdate);
                  }
                });
              });

            return true;
          },
        },
      }),
    ];
  },
});
