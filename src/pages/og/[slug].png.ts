import type { GetStaticPaths, APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import { SITE_NAME, SITE_HOSTNAME, AUTHOR_NAME } from '../../config/site';

const fontPath = join(process.cwd(), 'src/assets/fonts/JetBrainsMono-Regular.ttf');
const fontData = readFileSync(fontPath);

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { title: post.data.title, excerpt: post.data.excerpt },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { title, excerpt } = props as { title: string; excerpt: string };

  const displayTitle = title.length > 60 ? title.slice(0, 57) + '…' : title;
  const displayExcerpt = excerpt.length > 120 ? excerpt.slice(0, 117) + '…' : excerpt;

  const markup = html`
    <div style="
      width: 1200px; height: 630px;
      background: #0d1117;
      display: flex; flex-direction: column;
      justify-content: center;
      padding: 80px 80px;
      font-family: 'JetBrains Mono';
      box-sizing: border-box;
    ">
      <div style="
        font-size: 14px; font-weight: 500;
        color: #8b949e; letter-spacing: 0.08em;
        text-transform: uppercase; margin-bottom: 28px;
      ">${SITE_NAME}</div>
      <div style="
        font-size: 52px; font-weight: 700;
        color: #e6edf3; line-height: 1.2;
        margin-bottom: 24px;
      ">${displayTitle}</div>
      <div style="
        font-size: 22px; color: #8b949e;
        line-height: 1.5; max-width: 900px;
      ">${displayExcerpt}</div>
      <div style="
        margin-top: 48px; font-size: 14px;
        color: #6e7681;
      ">${SITE_HOSTNAME} · ${AUTHOR_NAME}</div>
    </div>
  `;

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [{ name: 'JetBrains Mono', data: fontData, weight: 700, style: 'normal' }],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
};
