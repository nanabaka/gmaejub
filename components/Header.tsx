'use client';

import React from 'react';
import { Gamepad2, RefreshCw } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  isLoading: boolean;
  onRefresh: () => void;
  lastUpdated?: Date | null;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  isLoading,
  onRefresh,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-900 text-white">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-gray-900">
              겜줍
            </span>
            <span className="text-xs font-semibold text-gray-500">
              GameJub
            </span>
            <span className="hidden md:inline text-xs text-gray-400">
              | 0원 무료 게임 실시간 트래커
            </span>
          </div>
        </div>

        {/* Live Status & Counter Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-semibold text-emerald-700">LIVE</span>
            <span className="text-gray-300">|</span>
            <span>
              현재 <strong className="text-gray-900 font-bold">{isLoading ? '...' : totalCount}</strong>개 배포 중
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="목록 새로고침"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-gray-900' : 'text-gray-500'}`} />
            <span className="hidden md:inline">새로고침</span>
          </button>
        </div>
      </div>
    </header>
  );
};
