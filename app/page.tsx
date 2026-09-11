'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GiveawayGame, PlatformFilter, SortOption } from '@/types/game';
import {
  calculateTotalSavings,
  filterAndSortGames,
  getPlatformBadge,
} from '@/utils/formatters';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { FilterBar } from '@/components/FilterBar';
import { GameCard } from '@/components/GameCard';
import { GameCardSkeleton } from '@/components/GameCardSkeleton';
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

  // Fetch games from GamerPower API with internal fallback
  const fetchGiveaways = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data: GiveawayGame[] | null = null;

      // 1. Direct fetch
      try {
        const directRes = await fetch(
          'https://www.gamerpower.com/api/giveaways?type=game',
          { cache: 'no-store' }
        );
        if (directRes.ok) {
          const json = await directRes.json();
          if (Array.isArray(json)) {
            data = json;
          }
        }
      } catch (clientErr) {
        console.warn('Direct API fetch failed or blocked. Trying proxy...', clientErr);
      }

      // 2. Server proxy fallback
      if (!data) {
        const proxyRes = await fetch('/api/giveaways');
        if (!proxyRes.ok) {
          throw new Error('서버 프록시 호출 실패');
        }
        const json = await proxyRes.json();
        if (Array.isArray(json)) {
          data = json;
        } else {
          throw new Error('올바르지 않은 응답 데이터 형식입니다.');
        }
      }

      setGames(data || []);
    } catch (err) {
      console.error('Failed to load giveaways:', err);
      setError('실시간 무료 게임 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGiveaways();
  }, [fetchGiveaways]);

  // Platform count calculation
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

  // Real-time savings calculation
  const savings = useMemo(() => {
    return calculateTotalSavings(games);
  }, [games]);

  // Filtered & sorted games
  const displayedGames = useMemo(() => {
    return filterAndSortGames(games, currentFilter, searchQuery, sortBy);
  }, [games, currentFilter, searchQuery, sortBy]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      {/* 1. Header */}
      <Header
        totalCount={games.length}
        isLoading={isLoading}
        onRefresh={fetchGiveaways}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroBanner
          totalCount={games.length}
          totalUsd={savings.totalUsd}
          totalKrw={savings.totalKrw}
          isLoading={isLoading}
        />

        {/* 3. Top Ad Placement */}
        <AdBanner
          slotId="gamejub-hero-bottom-slot"
          format="horizontal"
          label="스폰서 / 추천 배너"
        />

        {/* 4. Filter & Search Controls */}
        <FilterBar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          counts={platformCounts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* 5. Game Cards Grid Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
          {/* Section Heading */}
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

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <GameCardSkeleton key={idx} />
              ))}
            </div>
          )}

          {/* Error State */}
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

          {/* Empty State */}
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

          {/* Game Cards Grid */}
          {!isLoading && !error && displayedGames.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {displayedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </section>

        {/* 6. Bottom Ad Placement */}
        <AdBanner
          slotId="gamejub-footer-top-slot"
          format="rectangle"
          label="하단 디스플레이 배너"
        />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
