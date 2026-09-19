import type { CollectionEntry } from 'astro:content';
import MarkdownIt from 'markdown-it';
import markdownItFootnote from 'markdown-it-footnote';
import sanitizeHtml from 'sanitize-html';

export { getSortedPosts, buildPostLink } from './posts';

const md = new MarkdownIt().use(markdownItFootnote);

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'a', 'img',
  'pre', 'code',
  'blockquote',
  'ul', 'ol', 'li',
  'strong', 'em', 's', 'sup',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'section',
  'br', 'hr',
];

const ALLOWED_ATTRIBUTES = {
  a: ['href', 'rel', 'target', 'id', 'class'],
  img: ['src', 'alt'],
  code: ['class'],
  sup: ['class'],
  li: ['id', 'class'],
  ol: ['class'],
  section: ['class'],
  hr: ['class'],
};

export function renderPostContent(post: CollectionEntry<'posts'>): string {
  const html = md.render(post.body);
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
  });
}
