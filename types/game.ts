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
