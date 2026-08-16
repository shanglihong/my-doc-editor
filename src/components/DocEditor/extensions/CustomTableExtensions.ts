import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element) =>
          element.style.backgroundColor || element.getAttribute('data-background-color') || null,
        renderHTML: (attributes) => {
          if (attributes.backgroundColor === null || attributes.backgroundColor === undefined) {
            return {};
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`,
            'data-background-color': attributes.backgroundColor,
          };
        },
      },
    };
  },
});

export const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: '#f1f5f9',
        parseHTML: (element) =>
          element.style.backgroundColor || element.getAttribute('data-background-color') || null,
        renderHTML: (attributes) => {
          if (attributes.backgroundColor === null || attributes.backgroundColor === undefined) {
            return {};
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`,
            'data-background-color': attributes.backgroundColor,
          };
        },
      },
    };
  },
});
