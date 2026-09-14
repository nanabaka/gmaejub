import { GiveawayGame, PlatformFilter, SortOption } from "@/types/game";

export const DEFAULT_USD_TO_KRW_RATE = 1380;

/**
 * 정가 문자열("$19.99")에서 순수 숫자 USD 추출
 */
export function parseWorthToUsd(worth: string | undefined): number {
  if (!worth) return 0;
  const match = worth.replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
}

/**
 * USD를 원화(KRW) 문자열로 환산 (환율 인자 없으면 기본값 사용)
 */
export function formatKrw(usd: number, rate: number = DEFAULT_USD_TO_KRW_RATE): string {
  const krw = Math.round(usd * rate);
  return krw.toLocaleString('ko-KR');
}

/**
 * 실시간 전체 절약 총액 계산 (달러 및 원화)
 */
export function calculateTotalSavings(
  games: GiveawayGame[],
  rate: number = DEFAULT_USD_TO_KRW_RATE
): { totalUsd: number; totalKrw: string } {
  const totalUsd = games.reduce((sum, game) => sum + parseWorthToUsd(game.worth), 0);
  return {
    totalUsd: Math.round(totalUsd),
    totalKrw: formatKrw(totalUsd, rate),
  };
}

export interface DDayInfo {
  label: string;
  isEndingSoon: boolean;
  isLimitedQuantity: boolean;
  rawDiffMs: number;
}

/**
 * end_date 파싱하여 D-Day 및 남은 시간 표시
 */
export function calculateDDay(endDateStr: string | undefined): DDayInfo {
  if (!endDateStr || endDateStr.trim() === '' || endDateStr.toUpperCase() === 'N/A') {
    return {
      label: '한정 수량 / 소진 시 종료',
      isEndingSoon: false,
      isLimitedQuantity: true,
      rawDiffMs: Infinity,
    };
  }
  const normalizedDateStr = endDateStr.includes(' ') ? endDateStr.replace(' ', 'T') : endDateStr;
  const endDate = new Date(normalizedDateStr);
  const now = new Date();
  if (isNaN(endDate.getTime())) {
    return {
      label: '한정 수량 / 소진 시 종료',
      isEndingSoon: false,
      isLimitedQuantity: true,
      rawDiffMs: Infinity,
    };
  }
  const diffMs = endDate.getTime() - now.getTime();
  if (diffMs <= 0) {
    return {
      label: '배포 마감됨',
      isEndingSoon: false,
      isLimitedQuantity: false,
      rawDiffMs: 0,
    };
  }
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;
  if (days === 0) {
    return {
      label: `마감 임박 (${Math.max(1, totalHours)}시간 남음)`,
      isEndingSoon: true,
      isLimitedQuantity: false,
      rawDiffMs: diffMs,
    };
  }
  return {
    label: `D-${days} (${remainingHours}시간 남음)`,
    isEndingSoon: days <= 2,
    isLimitedQuantity: false,
    rawDiffMs: diffMs,
  };
}

export interface PlatformBadge {
  platformGroup: PlatformFilter;
  label: string;
  badgeStyle: string;
}

/**
 * 플랫폼 문자열을 분석해 깔끔한 라이트 뱃지 스타일 반환
 */
export function getPlatformBadge(platforms: string): PlatformBadge {
  const p = (platforms || '').toLowerCase();
  if (p.includes('epic')) {
    return {
      platformGroup: 'epic',
      label: 'Epic Games',
      badgeStyle: 'bg-gray-100 text-gray-800 border-gray-200',
    };
  }
  if (p.includes('steam')) {
    return {
      platformGroup: 'steam',
      label: 'Steam',
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
    };
  }
  if (p.includes('gog')) {
    return {
      platformGroup: 'gog',
      label: 'GOG',
      badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
    };
  }
  if (p.includes('itch')) {
    return {
      platformGroup: 'indie',
      label: 'Itch.io',
      badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
    };
  }
  const firstToken = platforms.split(',')[0]?.trim() || 'PC';
  return {
    platformGroup: 'indie',
    label: firstToken,
    badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
}

/**
 * 탭 필터링, 검색어, 정렬 로직 적용
 */
export function filterAndSortGames(
  games: GiveawayGame[],
  platform: PlatformFilter,
  searchQuery: string,
  sortBy: SortOption
): GiveawayGame[] {
  let result = [...games];
  if (platform !== 'all') {
    result = result.filter((game) => {
      const badge = getPlatformBadge(game.platforms);
      return badge.platformGroup === platform;
    });
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (game) =>
        game.title.toLowerCase().includes(q) ||
        game.description.toLowerCase().includes(q) ||
        game.platforms.toLowerCase().includes(q)
    );
  }
  result.sort((a, b) => {
    if (sortBy === 'worth') {
      return parseWorthToUsd(b.worth) - parseWorthToUsd(a.worth);
    }
    if (sortBy === 'ending-soon') {
      const aD = calculateDDay(a.end_date).rawDiffMs;
      const bD = calculateDDay(b.end_date).rawDiffMs;
      return aD - bD;
    }
    return b.id - a.id;
  });
  return result;
}
