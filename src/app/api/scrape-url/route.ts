import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
  try {
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    // Title
    const name = $('meta[property="og:title"]').attr('content') || $('title').text();

    // Image
    let imageUrl = $('meta[property="og:image"]').attr('content');
    if (!imageUrl) {
      // Fallback: largest <img> by width/height
      let largestImg = null;
      let largestArea = 0;
      $('img').each((_, el) => {
        const w = parseInt($(el).attr('width') || '0');
        const h = parseInt($(el).attr('height') || '0');
        const area = w * h;
        if (area > largestArea) {
          largestArea = area;
          largestImg = $(el).attr('src');
        }
      });
      imageUrl = largestImg || '';
    }

    // Description
    let description = $('meta[property="og:description"]').attr('content');
    if (!description) {
      description = $('meta[name="description"]').attr('content') || '';
    }

    // Price
    let price = $('meta[property="product:price:amount"]').attr('content');
    if (!price) {
      price = $('[itemprop="price"]').attr('content') || $('[class*="price"]').first().text();
    }

    return NextResponse.json({ name, imageUrl, description, price });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to scrape' }, { status: 500 });
  }
}
