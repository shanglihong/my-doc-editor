import { Node } from '@tiptap/core';

export const DocumentTitleExtension = Node.create({
  name: 'doc',
  topNode: true,
  content: 'title block+',
});
