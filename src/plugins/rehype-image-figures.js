import { visit } from 'unist-util-visit';

export default function rehypeImageFigures() {
  return (tree) => {
    // Collect replacements: [parent, index, figureNode]
    const replacements = [];

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p') return;

      // Find a single img child (ignore whitespace text nodes)
      const meaningful = node.children.filter(
        c => !(c.type === 'text' && c.value.trim() === '')
      );
      if (meaningful.length !== 1) return;

      const img = meaningful[0];
      if (img.type !== 'element' || img.tagName !== 'img') return;

      const src = img.properties?.src ?? '';
      const alt = img.properties?.alt ?? '';
      const isExternal = src.startsWith('http://') || src.startsWith('https://');

      const figureProperties = {
        class: 'image-wrapper image-loading',
      };
      if (isExternal) {
        figureProperties['data-external'] = 'true';
      }

      const figureChildren = [img];
      if (alt) {
        figureChildren.push({
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [{ type: 'text', value: alt }],
        });
      }

      const figure = {
        type: 'element',
        tagName: 'figure',
        properties: figureProperties,
        children: figureChildren,
      };

      replacements.push([parent, index, figure]);
    });

    // Apply replacements in reverse order to keep indices valid
    for (let i = replacements.length - 1; i >= 0; i--) {
      const [parent, index, figure] = replacements[i];
      parent.children.splice(index, 1, figure);
    }
  };
}
