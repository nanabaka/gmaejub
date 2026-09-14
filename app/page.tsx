'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GiveawayGame, PlatformFilter, SortOption, CheapSharkDeal, CheapSharkStore } from '@/types/game';
import {
  calculateTotalSavings,
  filterAndSortGames,
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

export default function Home() {
  const [games, setGames] = useState<GiveawayGame[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<PlatformFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const [deals, setDeals] = useState<CheapSharkDeal[]>([]);
  const [storeMap, setStoreMap] = useState<Record<string, string>>({});
  const [isDealsLoading, setIsDealsLoading] = useState<boolean>(true);

  const [exchangeRate, setExchangeRate] = useState<number>(1380);

  // D-Day 라벨을 1분마다 재계산하기 위한 강제 리렌더 트리거
  const [, forceTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => forceTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  // 무료 배포 목록 (CORS 이슈 없는 서버 프록시 사용)
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
      setError('실시간 무료 게임 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 50% 이상 할인 게임 목록
  const fetchDeals = useCallback(async () => {
    setIsDealsLoading(true);
    try {
      const [dealsRes, storesRes] = await Promise.all([
        fetch('/api/deals'),
        fetch('/api/deals/stores'),
      ]);
      if (dealsRes.ok) {
        const dealsData = await dealsRes.json();
        setDeals(Array.isArray(dealsData) ? dealsData : []);
      }
      if (storesRes.ok) {
        const storesData: CheapSharkStore[] = await storesRes.json();
        const map: Record<string, string> = {};
        storesData.forEach((s) => {
          map[s.storeID] = s.storeName;
        });
        setStoreMap(map);
      }
    } catch (err) {
      console.error('Failed to load deals:', err);
    } finally {
      setIsDealsLoading(false);
    }
  }, []);

  // 실시간 환율 (24시간 서버 캐시)
  const fetchExchangeRate = useCallback(async () => {
    try {
      const res = await fetch('/api/exchange-rate');
      if (res.ok) {
        const json = await res.json();
        if (typeof json.rate === 'number') {
          setExchangeRate(json.rate);
        }
      }
    } catch (err) {
      console.error('Failed to load exchange rate:', err);
    }
  }, []);

  useEffect(() => {
    fetchGiveaways();
    fetchDeals();
    fetchExchangeRate();
  }, [fetchGiveaways, fetchDeals, fetchExchangeRate]);

  const platformCounts = useMemo(() => {
    const counts: Record<PlatformFilter, number> = {
      all: games.length,
      epic: 0,
      steam: 0,
      gog: 0,
      indie: 0,
    };
    games.forEach((g) => {
      const badge = getPlatformBadge(g.platforms);
      if (counts[badge.platformGroup] !== undefined) {
        counts[badge.platformGroup]++;
      }
    });
    return counts;
  }, [games]);

  const savings = useMemo(() => {
    return calculateTotalSavings(games, exchangeRate);
  }, [games, exchangeRate]);

  const displayedGames = useMemo(() => {
    return filterAndSortGames(games, currentFilter, searchQuery, sortBy);
  }, [games, currentFilter, searchQuery, sortBy]);

  const discountedGames = useMemo(() => filterDiscountedGames(deals, 50), [deals]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* 1. 헤더 */}
      <Header
        totalCount={games.length}
        isLoading={isLoading}
        onRefresh={fetchGiveaways}
      />
      <main className="flex-1">
        {/* 2. 히어로 배너 */}
        <HeroBanner
          totalCount={games.length}
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
        {/* 4. 필터 바 */}
        <FilterBar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          counts={platformCounts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        {/* 5. 무료 게임 카드 그리드 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <span>0원 줍줍 라인업</span>
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
              <h3 className="text-sm font-bold text-gray-900 mb-1">조건에 맞는 게임이 없습니다</h3>
              <p className="text-xs text-gray-500 mb-5">
                선택한 필터 또는 검색어에 해당하는 0원 게임이 현재 없습니다.
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
                {isDealsLoading ? '...' : `${discountedGames.length}개`}
              </span>
            </h2>
          </div>
          {isDealsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 4 }).map((_, idx) => (
                <GameCardSkeleton key={idx} />
              ))}
            </div>
          ) : discountedGames.length > 0 ? (
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
      {/* 7. 푸터 */}
      <Footer />
    </div>
  );
}
