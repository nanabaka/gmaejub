import type { CheapSharkDeal, CheapSharkStore, GiveawayGame } from '@/types/game';

const GAMERPOWER_API = 'https://www.gamerpower.com/api/giveaways';
const CHEAPSHARK_DEALS_API =
  'https://www.cheapshark.com/api/1.0/deals?sortBy=Savings&desc=0&pageSize=60&onSale=1';
const CHEAPSHARK_STORES_API = 'https://www.cheapshark.com/api/1.0/stores';
const EXCHANGE_RATE_API = 'https://open.er-api.com/v6/latest/USD';

export async function fetchGiveaways(): Promise<GiveawayGame[]> {
  const response = await fetch(GAMERPOWER_API, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'GameJub/1.0',
    },
    next: { revalidate: 300 },
  });
  if (!response.ok) {
    throw new Error(`GamerPower API responded with status ${response.status}`);
  }
  return response.json();
}

const GAMERPOWER_SINGLE_API = 'https://www.gamerpower.com/api/giveaway';

// 종료된 배포도 단건 조회로 가져올 수 있고, 종료 후에는 내용이 바뀌지 않아 하루 캐시
export async function fetchGiveawayById(id: number): Promise<GiveawayGame | null> {
  try {
    const response = await fetch(`${GAMERPOWER_SINGLE_API}?id=${id}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'GameJub/1.0' },
      next: { revalidate: 86400 },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data && typeof data.id === 'number' ? (data as GiveawayGame) : null;
  } catch {
    return null;
  }
}

// 현재 진행 중이 아닌 최근 id들을 조회해 막 종료된 배포를 모음 (원본이 종료 목록을 따로 주지 않음)
export async function fetchRecentEnded(
  live: GiveawayGame[],
  windowSize = 70,
  concurrency = 3
): Promise<GiveawayGame[]> {
  const liveIds = new Set(live.map((g) => g.id));
  const maxId = live.reduce((max, g) => Math.max(max, g.id), 0);
  const candidates: number[] = [];
  for (let id = maxId - 1; id > maxId - windowSize; id--) {
    if (!liveIds.has(id)) candidates.push(id);
  }

  const results: GiveawayGame[] = [];
  let next = 0;
  async function worker() {
    while (next < candidates.length) {
      const id = candidates[next++];
      const game = await fetchGiveawayById(id);
      if (game) results.push(game);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

export async function fetchDeals(): Promise<CheapSharkDeal[]> {
  const response = await fetch(CHEAPSHARK_DEALS_API, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'GameJub/1.0 (https://gamejub.com)',
    },
    next: { revalidate: 1800 },
  });
  if (!response.ok) {
    throw new Error(`CheapShark API responded with status ${response.status}`);
  }
  return response.json();
}

export async function fetchStores(): Promise<CheapSharkStore[]> {
  const response = await fetch(CHEAPSHARK_STORES_API, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'GameJub/1.0 (https://gamejub.com)',
    },
    next: { revalidate: 86400 },
  });
  if (!response.ok) {
    throw new Error(`CheapShark stores API responded with status ${response.status}`);
  }
  return response.json();
}

export async function fetchExchangeRate(): Promise<number> {
  const response = await fetch(EXCHANGE_RATE_API, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'GameJub/1.0 (https://gamejub.com)',
    },
    next: { revalidate: 86400 },
  });
  if (!response.ok) {
    throw new Error(`Exchange rate API responded with status ${response.status}`);
  }
  const data = await response.json();
  const rate = data?.rates?.KRW;
  if (typeof rate !== 'number') {
    throw new Error('Invalid exchange rate response');
  }
  return rate;
}
