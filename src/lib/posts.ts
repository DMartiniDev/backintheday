import type { CollectionEntry } from 'astro:content';

export function getSortedPosts(posts: CollectionEntry<'posts'>[]) {
  return [...posts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function buildPostLink(post: CollectionEntry<'posts'>): string {
  return `${import.meta.env.SITE}/posts/${post.slug}`;
}
