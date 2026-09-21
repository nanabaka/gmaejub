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
