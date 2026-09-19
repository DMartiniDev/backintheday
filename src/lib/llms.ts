import type { CollectionEntry } from 'astro:content';
import { SITE_NAME, SITE_DESCRIPTION, AUTHOR_NAME, AUTHOR_SITE_URL } from '../config/site';
import { getSortedPosts, buildPostLink } from './posts';

export { getSortedPosts, buildPostLink };

export function buildHeader(): string {
  return [
    `# ${SITE_NAME}`,
    '',
    SITE_DESCRIPTION,
    '',
    `Author: ${AUTHOR_NAME} (${AUTHOR_SITE_URL})`,
    '',
    `Index: ${import.meta.env.SITE}/llms.txt`,
    `Full content: ${import.meta.env.SITE}/llms-full.txt`,
    '',
  ].join('\n');
}

export function buildPostSummaryLine(post: CollectionEntry<'posts'>): string {
  return `- [${post.data.title}](${buildPostLink(post)}): ${post.data.excerpt}`;
}
