import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getSortedPosts, buildHeader, buildPostSummaryLine } from '../lib/llms';

export const GET: APIRoute = async () => {
  const posts = getSortedPosts(await getCollection('posts'));

  const body = [
    buildHeader(),
    '## Posts',
    '',
    ...posts.map(buildPostSummaryLine),
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
