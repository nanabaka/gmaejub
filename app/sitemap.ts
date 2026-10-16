import type { MetadataRoute } from 'next';
import { fetchGiveaways } from '@/utils/gameData';
import { getGameSlug } from '@/utils/formatters';
import { PLATFORM_HUBS } from '@/utils/platformGuides';

// 봇이 드물게 호출해서 ISR 재생성이 사실상 일어나지 않으므로, 요청마다 최신 배포 목록으로 생성
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.gamejub.com';

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    ...PLATFORM_HUBS.map((hub) => ({
      url: `${baseUrl}/free/${hub.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
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
