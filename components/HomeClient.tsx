'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  GiveawayGame,
  PlatformFilter,
  SortOption,
  GiveawayTypeFilter,
  GiveawayTypeCount,
  CheapSharkDeal,
} from '@/types/game';
import {
  calculateTotalSavings,
  filterAndSortGames,
  filterGamesByType,
  normalizeGiveawayType,
  getPlatformBadge,
} from '@/utils/formatters';
import { filterDiscountedGames } from '@/utils/dealFormatters';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { FilterBar } from '@/components/FilterBar';
import { GameCard } from '@/components/GameCard';
import { GameCardSkeleton } from '@/components/GameCardSkeleton';
import { DealCard } from '@/components/DealCard';
import { FaqSection } from '@/components/FaqSection';
import { AdBanner } from '@/components/AdBanner';
import { Footer } from '@/components/Footer';
import { AlertCircle, RefreshCw, Gamepad2 } from 'lucide-react';

interface HomeClientProps {
  initialGames: GiveawayGame[];
  initialError: string | null;
  initialDeals: CheapSharkDeal[];
  initialStoreMap: Record<string, string>;
  initialExchangeRate: number;
}

export function HomeClient({
  initialGames,
  initialError,
  initialDeals,
  initialStoreMap,
  initialExchangeRate,
}: HomeClientProps) {
  // 서버에서 이미 데이터를 받아 렌더링하므로, 초기 로딩 스피너 없이 바로 시작
  const [games, setGames] = useState<GiveawayGame[]>(initialGames);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(initialError);

  // 카테고리 필터 (기본값: 'game' 무료 게임)
  const [typeFilter, setTypeFilter] = useState<GiveawayTypeFilter>('game');
  const [currentFilter, setCurrentFilter] = useState<PlatformFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // 할인 게임/환율은 서버에서 받은 값을 그대로 사용 (새로고침 대상 아님)
  const deals = initialDeals;
  const storeMap = initialStoreMap;
  const exchangeRate = initialExchangeRate;

  // D-Day 라벨을 1분마다 재계산하기 위한 강제 리렌더 트리거
  const [, forceTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  // 배포 목록 새로고침 (CORS 이슈 없는 서버 프록시 사용)
  const fetchGiveaways = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/giveaways');
      if (!res.ok) {
        throw new Error('서버 프록시 호출 실패');
      }
      const json = await res.json();
      if (!Array.isArray(json)) {
        throw new Error('올바르지 않은 응답 데이터 형식입니다.');
      }
      setGames(json);
    } catch (err) {
      console.error('Failed to load giveaways:', err);
      setError('실시간 배포 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 히어로 배너 및 헤더 통계는 탭 선택과 무관하게 항상 '순수 본편 게임' 기준 (사이트 정체성 유지)
  const gameOnlyForStats = useMemo(() => filterGamesByType(games, 'game'), [games]);

  const savings = useMemo(() => {
    return calculateTotalSavings(gameOnlyForStats, exchangeRate);
  }, [gameOnlyForStats, exchangeRate]);

  // 카테고리별 개수 (게임/DLC·쿠폰/베타)
  const typeCounts = useMemo((): GiveawayTypeCount => {
    const counts: GiveawayTypeCount = { game: 0, loot: 0, beta: 0 };
    games.forEach((g) => {
      const t = normalizeGiveawayType(g.type);
      counts[t]++;
    });
    return counts;
  }, [games]);

  // 현재 선택된 카테고리 탭에 해당하는 항목 목록
  const gamesOfSelectedType = useMemo(
    () => filterGamesByType(games, typeFilter),
    [games, typeFilter]
  );

  // 선택된 카테고리 내에서의 플랫폼별 개수
  const platformCounts = useMemo(() => {
    const counts: Record<PlatformFilter, number> = {
      all: gamesOfSelectedType.length,
      epic: 0,
      steam: 0,
      gog: 0,
      indie: 0,
    };
    gamesOfSelectedType.forEach((g) => {
      const badge = getPlatformBadge(g.platforms);
      if (counts[badge.platformGroup] !== undefined) {
        counts[badge.platformGroup]++;
      }
    });
    return counts;
  }, [gamesOfSelectedType]);

  const displayedGames = useMemo(() => {
    return filterAndSortGames(gamesOfSelectedType, currentFilter, searchQuery, sortBy);
  }, [gamesOfSelectedType, currentFilter, searchQuery, sortBy]);

  const discountedGames = useMemo(() => filterDiscountedGames(deals, 50), [deals]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* 1. 헤더 (순수 게임 개수 전달) */}
      <Header
        totalCount={gameOnlyForStats.length}
        isLoading={isLoading}
        onRefresh={fetchGiveaways}
      />
      <main className="flex-1">
        {/* 2. 히어로 배너 (순수 게임 개수 및 정산액 표기) */}
        <HeroBanner
          totalCount={gameOnlyForStats.length}
          totalUsd={savings.totalUsd}
          totalKrw={savings.totalKrw}
          isLoading={isLoading}
        />
        {/* 3. 상단 광고 슬롯 */}
        <AdBanner
          slotId="gamejub-hero-bottom-slot"
          format="horizontal"
          label="스폰서 / 추천 배너"
        />
        {/* 4. 필터 바 (카테고리 탭 + 플랫폼 탭 + 검색/정렬) */}
        <FilterBar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          counts={platformCounts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          currentType={typeFilter}
          onTypeChange={setTypeFilter}
          typeCounts={typeCounts}
        />
        {/* 5. 0원 줍줍 라인업 그리드 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span>
                  {typeFilter === 'game'
                    ? '0원 줍줍 라인업'
                    : typeFilter === 'loot'
                    ? 'DLC · 쿠폰 모음'
                    : '베타 · 얼리 액세스'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                  {isLoading ? '...' : `${displayedGames.length}개`}
                </span>
              </h2>
            </div>
            {searchQuery && (
              <span className="text-xs text-gray-500">
                &quot;{searchQuery}&quot; 검색 결과
              </span>
            )}
          </div>
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <GameCardSkeleton key={idx} />
              ))}
            </div>
          )}
          {!isLoading && error && (
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl border border-red-200 text-center max-w-md mx-auto my-8 shadow-xs">
              <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
              <h3 className="text-sm font-bold text-gray-900 mb-1">데이터 로드 오류</h3>
              <p className="text-xs text-gray-500 mb-5">{error}</p>
              <button
                onClick={fetchGiveaways}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 hover:bg-black text-white font-medium text-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>다시 시도</span>
              </button>
            </div>
          )}
          {!isLoading && !error && displayedGames.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 text-center max-w-md mx-auto my-10 shadow-xs">
              <Gamepad2 className="w-10 h-10 text-gray-300 mb-2" />
              <h3 className="text-sm font-bold text-gray-900 mb-1">조건에 맞는 항목이 없습니다</h3>
              <p className="text-xs text-gray-500 mb-5">
                선택한 필터 또는 검색어에 해당하는 배포 항목이 현재 없습니다.
              </p>
              <button
                onClick={() => {
                  setCurrentFilter('all');
                  setSearchQuery('');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                필터 초기화
              </button>
            </div>
          )}
          {!isLoading && !error && displayedGames.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {displayedGames.map((game) => (
                <GameCard key={game.id} game={game} exchangeRate={exchangeRate} />
              ))}
            </div>
          )}
        </section>

        {/* 5.5. 50% 이상 할인 게임 섹션 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span>🔥 50% 이상 할인 중인 게임</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                {`${discountedGames.length}개`}
              </span>
            </h2>
          </div>
          {discountedGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {discountedGames.slice(0, 12).map((deal) => (
                <DealCard
                  key={deal.dealID}
                  deal={deal}
                  storeName={storeMap[deal.storeID] || '스토어'}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-8">
              현재 50% 이상 할인 중인 게임이 없습니다.
            </p>
          )}
        </section>

        {/* 6. 자주 묻는 질문 (FAQ) 섹션 */}
        <FaqSection />

        {/* 7. 하단 광고 슬롯 */}
        <AdBanner
          slotId="gamejub-footer-top-slot"
          format="rectangle"
          label="하단 디스플레이 배너"
        />
      </main>
      {/* 8. 푸터 */}
      <Footer />
    </div>
  );
}
