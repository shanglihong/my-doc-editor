import { useState, useCallback, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import type { DrawIOModalState } from '../types';
import { ImageUploadService } from '../services/imageUploadService';

export function useDocEditorModals(editor: Editor | null) {
  const [drawioModalState, setDrawioModalState] = useState<DrawIOModalState>({
    isOpen: false,
    initialXml: '',
    nodePos: null,
  });

  const handleSaveDrawIO = useCallback(
    (xml: string, svg: string) => {
      if (!editor || drawioModalState.nodePos === null) return;
      editor
        .chain()
        .focus()
        .setNodeSelection(drawioModalState.nodePos)
        .updateAttributes('drawioBlock', { xml, svg })
        .run();
    },
    [editor, drawioModalState.nodePos]
  );

  const handleInsertLocalImageFile = useCallback(
    (file: File) => {
      if (!editor) return;
      const previewUrl = URL.createObjectURL(file);
      editor
        .chain()
        .focus()
        .setImageBlock({
          src: previewUrl,
          status: 'uploading',
          alignment: 'center',
        })
        .run();

      ImageUploadService.uploadImage(file)
        .then((result) => {
          editor.state.doc.descendants((docNode, pos) => {
            if (
              docNode.type.name === 'imageBlock' &&
              docNode.attrs.src === previewUrl
            ) {
              const trUpdate = editor.state.tr.setNodeMarkup(pos, undefined, {
                ...docNode.attrs,
                src: result.url,
                status: 'ready',
              });
              editor.view.dispatch(trUpdate);
            }
          });
        })
        .catch((err) => {
          editor.state.doc.descendants((docNode, pos) => {
            if (
              docNode.type.name === 'imageBlock' &&
              docNode.attrs.src === previewUrl
            ) {
              const trUpdate = editor.state.tr.setNodeMarkup(pos, undefined, {
                ...docNode.attrs,
                status: 'error',
                errorMessage: err?.message || '图片保存失败',
              });
              editor.view.dispatch(trUpdate);
            }
          });
        });
    },
    [editor]
  );

  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent;
      setDrawioModalState({
        isOpen: true,
        initialXml: customEvent.detail?.xml || '',
        nodePos: customEvent.detail?.nodePos ?? null,
      });
    };

    const handleOpenImageFilePicker = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: Event) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          handleInsertLocalImageFile(files[0]);
        }
      };
      input.click();
    };

    window.addEventListener('OPEN_DRAWIO_MODAL', handleOpenModal);
    window.addEventListener('TRIGGER_OPEN_IMAGE_FILE_PICKER', handleOpenImageFilePicker);
    window.addEventListener('OPEN_IMAGE_MODAL', handleOpenImageFilePicker);

    return () => {
      window.removeEventListener('OPEN_DRAWIO_MODAL', handleOpenModal);
      window.removeEventListener('TRIGGER_OPEN_IMAGE_FILE_PICKER', handleOpenImageFilePicker);
      window.removeEventListener('OPEN_IMAGE_MODAL', handleOpenImageFilePicker);
    };
  }, [editor, handleInsertLocalImageFile]);

  return {
    drawioModalState,
    setDrawioModalState,
    handleSaveDrawIO,
    handleInsertLocalImageFile,
  };
}
