import type { MetadataRoute } from 'next';
import { fetchGiveaways } from '@/utils/gameData';
import { getGameSlug } from '@/utils/formatters';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.gamejub.com';

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  let gameEntries: MetadataRoute.Sitemap = [];
  try {
    const games = await fetchGiveaways();
    gameEntries = games.map((game) => {
      const published = new Date((game.published_date || '').replace(' ', 'T'));
      return {
        url: `${baseUrl}/game/${getGameSlug(game)}`,
        lastModified: isNaN(published.getTime()) ? new Date() : published,
        changeFrequency: 'daily',
        priority: 0.6,
      };
    });
  } catch {
    // 원본 API 실패 시 정적 페이지만 포함
  }

  return [...staticEntries, ...gameEntries];
}
