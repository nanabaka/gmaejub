import { HomeClient } from '@/components/HomeClient';
import type { CheapSharkDeal, CheapSharkStore, GiveawayGame } from '@/types/game';
import { fetchDeals, fetchExchangeRate, fetchGiveaways, fetchStores } from '@/utils/gameData';

export default async function Home() {
  const [giveawaysResult, dealsResult, storesResult, exchangeRateResult] =
    await Promise.allSettled([
      fetchGiveaways(),
      fetchDeals(),
      fetchStores(),
      fetchExchangeRate(),
    ]);

  const initialGames: GiveawayGame[] =
    giveawaysResult.status === 'fulfilled' && Array.isArray(giveawaysResult.value)
      ? giveawaysResult.value
      : [];
  const initialError =
    giveawaysResult.status === 'rejected'
      ? '실시간 배포 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      : null;

  const initialDeals: CheapSharkDeal[] =
    dealsResult.status === 'fulfilled' && Array.isArray(dealsResult.value)
      ? dealsResult.value
      : [];

  const initialStoreMap: Record<string, string> = {};
  if (storesResult.status === 'fulfilled') {
    (storesResult.value as CheapSharkStore[]).forEach((s) => {
      initialStoreMap[s.storeID] = s.storeName;
    });
  }

  const initialExchangeRate = exchangeRateResult.status === 'fulfilled' ? exchangeRateResult.value : 1380;

  return (
    <HomeClient
      initialGames={initialGames}
      initialError={initialError}
      initialDeals={initialDeals}
      initialStoreMap={initialStoreMap}
      initialExchangeRate={initialExchangeRate}
    />
  );
}
