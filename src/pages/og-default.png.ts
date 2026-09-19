import type { APIRoute } from 'astro';
  import { readFileSync } from 'node:fs';
  import { join } from 'node:path';
  import satori from 'satori';
  import { html } from 'satori-html';
  import sharp from 'sharp';
  import { SITE_NAME, SITE_DESCRIPTION, SITE_HOSTNAME, AUTHOR_NAME } from '../config/site';

  const fontPath = join(process.cwd(), 'src/assets/fonts/JetBrainsMono-Regular.ttf');
  const fontData = readFileSync(fontPath);

  // Mirror the header: BackInThe<span>Day</span>, with "Day" in the accent colour.
  const ACCENT_WORD = 'Day';
  const ACCENT_COLOR = '#58a6ff'; // --accent, dark theme (the image background is dark)
  const titleBase = SITE_NAME.endsWith(ACCENT_WORD) ? SITE_NAME.slice(0, -ACCENT_WORD.length) : SITE_NAME;
  const titleAccent = SITE_NAME.endsWith(ACCENT_WORD) ? ACCENT_WORD : '';

  // SITE_DESCRIPTION is "…notes by Dave Martínez - Senior Software Engineer and Instructor";
  // show the role on its own line.
  const [descLine1, descLine2 = ''] = SITE_DESCRIPTION.split(' - ');

  // Default Open Graph image for pages without their own (e.g. the home page).
  // Posts get a per-post image from src/pages/og/[slug].png.ts; this one is
  // generated from src/config/site.ts so it can never drift from the brand values.
  export const GET: APIRoute = async () => {
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
        ">${SITE_HOSTNAME}</div>
        <div style="
          display: flex;
          font-size: 52px; font-weight: 700;
          color: #e6edf3; line-height: 1.2;
          margin-bottom: 24px;
        ">
          <span>${titleBase}</span><span style="color: ${ACCENT_COLOR};">${titleAccent}</span>
        </div>
        <div style="
          display: flex; flex-direction: column;
          font-size: 22px; color: #8b949e;
          line-height: 1.5; max-width: 900px;
        ">
          <span>${descLine1}</span><span>${descLine2}</span>
        </div>
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