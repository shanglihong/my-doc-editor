import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { ImageBlockView } from '../components/ImageBlock/ImageBlockView';
import type { ImageBlockAttributes } from '../components/ImageBlock/types';
import { validateImageFile } from '../components/ImageBlock/utils';
import { ImageUploadService } from '../services/imageUploadService';

export interface ImageBlockOptions {
  HTMLAttributes: Record<string, any>;
  onUploadImage?: (file: File) => Promise<string>;
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
      onUploadImage: undefined,
    };
  },

  addAttributes() {
    return {
      src: {
        default: '',
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
    const self = this;
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

            const validation = validateImageFile(file);
            if (!validation.valid) {
              alert(validation.error);
              return true;
            }

            const previewUrl = URL.createObjectURL(file);
            const nodeType = view.state.schema.nodes.imageBlock;
            if (!nodeType) return false;

            const node = nodeType.create({
              src: previewUrl,
              status: 'uploading',
              alignment: 'center',
            });

            const transaction = view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);

            const uploadPromise = self.options.onUploadImage
              ? self.options.onUploadImage(file).then((url) => ({ url }))
              : ImageUploadService.uploadImage(file);

            uploadPromise
              .then((result) => {
                view.state.doc.descendants((docNode, pos) => {
                  if (
                    docNode.type.name === 'imageBlock' &&
                    docNode.attrs.src === previewUrl
                  ) {
                    const trUpdate = view.state.tr.setNodeMarkup(pos, undefined, {
                      ...docNode.attrs,
                      src: result.url,
                      status: 'ready',
                    });
                    view.dispatch(trUpdate);
                  }
                });
              })
              .catch((err) => {
                view.state.doc.descendants((docNode, pos) => {
                  if (
                    docNode.type.name === 'imageBlock' &&
                    docNode.attrs.src === previewUrl
                  ) {
                    const trUpdate = view.state.tr.setNodeMarkup(pos, undefined, {
                      ...docNode.attrs,
                      status: 'error',
                      errorMessage: err?.message || '图片保存失败',
                    });
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
              status: 'uploading',
              alignment: 'center',
            });

            const insertPos = dropPos ?? view.state.selection.from;
            const tr = view.state.tr.insert(insertPos, node);
            view.dispatch(tr);

            const dropUploadPromise = self.options.onUploadImage
              ? self.options.onUploadImage(imageFile).then((url) => ({ url }))
              : ImageUploadService.uploadImage(imageFile);

            dropUploadPromise
              .then((result) => {
                view.state.doc.descendants((docNode, pos) => {
                  if (
                    docNode.type.name === 'imageBlock' &&
                    docNode.attrs.src === previewUrl
                  ) {
                    const trUpdate = view.state.tr.setNodeMarkup(pos, undefined, {
                      ...docNode.attrs,
                      src: result.url,
                      status: 'ready',
                    });
                    view.dispatch(trUpdate);
                  }
                });
              })
              .catch((err) => {
                view.state.doc.descendants((docNode, pos) => {
                  if (
                    docNode.type.name === 'imageBlock' &&
                    docNode.attrs.src === previewUrl
                  ) {
                    const trUpdate = view.state.tr.setNodeMarkup(pos, undefined, {
                      ...docNode.attrs,
                      status: 'error',
                      errorMessage: err?.message || '图片保存失败',
                    });
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
