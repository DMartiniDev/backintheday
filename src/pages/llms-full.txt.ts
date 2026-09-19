import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getSortedPosts, buildHeader, buildPostLink } from '../lib/llms';

export const GET: APIRoute = async () => {
  const posts = getSortedPosts(await getCollection('posts'));

  const dateStr = (date: Date) =>
    date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

  // Strip the body's own leading H1 -- the wrapper heading below already carries
  // the (authoritative, frontmatter) title, so an unstripped body H1 either
  // duplicates it verbatim or, when it doesn't match, creates a confusing
  // H2-then-H1 hierarchy inversion.
  const stripLeadingH1 = (body: string) => body.replace(/^\s*#\s+.+\n+/, '');

  const postSections = posts.map(post => [
    `## ${post.data.title}`,
    '',
    `${dateStr(post.data.date)} — ${buildPostLink(post)}`,
    '',
    stripLeadingH1(post.body),
  ].join('\n'));

  const body = [
    buildHeader(),
    postSections.join('\n\n---\n\n'),
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
