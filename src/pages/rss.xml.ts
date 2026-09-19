import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_NAME, SITE_DESCRIPTION } from '../config/site';
import { getSortedPosts, buildPostLink, renderPostContent } from '../lib/rss';

export const GET: APIRoute = async (context) => {
  const posts = getSortedPosts(await getCollection('posts'));

  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: buildPostLink(post),
      description: post.data.excerpt,
      content: renderPostContent(post),
    })),
  });
};
