'use client';

import React from 'react';
import { PlatformFilter, SortOption } from '@/types/game';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
  currentFilter: PlatformFilter;
  onFilterChange: (filter: PlatformFilter) => void;
  counts: Record<PlatformFilter, number>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const FILTER_TABS: { id: PlatformFilter; label: string }[] = [
  { id: 'all', label: '전체 줍줍' },
  { id: 'epic', label: '에픽게임즈' },
  { id: 'steam', label: '스팀 (Steam)' },
  { id: 'gog', label: 'GOG' },
  { id: 'indie', label: '인디/기타 (Itch.io)' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  counts,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div className="flex flex-col gap-4">
        {/* Top row: Platform Tabs */}
        <div className="flex items-center overflow-x-auto pb-1 gap-2 scrollbar-none">
          {FILTER_TABS.map((tab) => {
            const isActive = currentFilter === tab.id;
            const count = counts[tab.id] || 0;

            return (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded font-bold ${
                    isActive
                      ? 'bg-gray-800 text-gray-200'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom row: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="게임 제목, 설명, 플랫폼 검색..."
              className="w-full pl-10 pr-9 py-2 rounded-lg bg-white border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                title="검색어 지우기"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>정렬:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-white border border-gray-300 text-gray-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-gray-900 cursor-pointer shadow-2xs"
            >
              <option value="newest">최신 등록순</option>
              <option value="worth">높은 정가순</option>
              <option value="ending-soon">마감 임박순</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
