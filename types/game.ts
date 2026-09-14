export interface GiveawayGame {
  id: number;
  title: string;
  worth: string;
  thumbnail: string;
  image: string;
  description: string;
  instructions: string;
  open_giveaway_url: string;
  published_date: string;
  type: string;
  platforms: string;
  end_date: string;
  users: number;
  status: string;
  gamerpower_url: string;
  open_giveaway: string;
}

export type PlatformFilter = 'all' | 'epic' | 'steam' | 'gog' | 'indie';
export type SortOption = 'newest' | 'worth' | 'ending-soon';

// '전체' 없이 세 카테고리 탭만 — 기본값은 'game'
export type GiveawayTypeFilter = 'game' | 'loot' | 'beta';

export interface GiveawayTypeCount {
  game: number;
  loot: number;
  beta: number;
}

export interface CheapSharkDeal {
  internalName: string;
  title: string;
  dealID: string;
  storeID: string;
  gameID: string;
  salePrice: string;
  normalPrice: string;
  savings: string;
  steamRatingPercent?: string;
  releaseDate: number;
  thumb: string;
}

export interface CheapSharkStore {
  storeID: string;
  storeName: string;
  isActive: number;
  images: {
    banner: string;
    logo: string;
    icon: string;
  };
}
