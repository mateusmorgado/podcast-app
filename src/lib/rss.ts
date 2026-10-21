import { XMLParser } from 'fast-xml-parser';

export type Episode = {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  image?: string | number; // URL, or a bundled asset (require) in demo mode
  number?: string;
  publishedAt: string;
  exclusive?: boolean;
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

export async function fetchFeed(url: string): Promise<Episode[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Feed error ${res.status}`);
  const xml = await res.text();
  const channel = parser.parse(xml)?.rss?.channel;
  const items = Array.isArray(channel?.item) ? channel.item : channel?.item ? [channel.item] : [];
  const channelImage = channel?.['itunes:image']?.['@_href'] ?? channel?.image?.url;

  return items
    .filter((i: any) => i.enclosure?.['@_url'])
    .map((i: any) => ({
      id: String(i.guid?.['#text'] ?? i.guid ?? i.enclosure['@_url']),
      title: String(i.title ?? ''),
      description: String(i.description ?? '').replace(/<[^>]+>/g, '').trim(),
      audioUrl: i.enclosure['@_url'],
      image: i['itunes:image']?.['@_href'] ?? channelImage,
      number: episodeNumber(i),
      publishedAt: String(i.pubDate ?? ''),
    }));
}

// Prefer <itunes:episode>, else an "EP 392" / "#392" in the title.
function episodeNumber(i: any): string | undefined {
  if (i['itunes:episode'] != null) return String(i['itunes:episode']);
  const m = String(i.title ?? '').match(/(?:\bEP\.?\s*#?|#)\s*(\d+)/i);
  return m?.[1];
}
