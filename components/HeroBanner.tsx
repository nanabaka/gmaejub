'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';

interface HeroBannerProps {
  totalCount: number;
  totalUsd: number;
  totalKrw: string;
  isLoading: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  totalCount,
  totalUsd,
  totalKrw,
  isLoading,
}) => {
  return (
    <section className="bg-white border-b border-gray-200 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-8">
            내가 보려고 만든 0원 줍줍 라인업
          </h1>

          {/* Clean Stat Cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {/* Stat 1: Total Games */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-xs font-medium text-gray-500 mb-1">
                현재 줍줍 가능
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {isLoading ? (
                  <span className="inline-block w-12 h-7 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <span>{totalCount} <span className="text-sm font-semibold text-gray-500">개</span></span>
                )}
              </div>
            </div>

            {/* Stat 2: Total USD Savings */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-xs font-medium text-gray-500 mb-1">
                실시간 절약 총액 ($)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                {isLoading ? (
                  <span className="inline-block w-20 h-7 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <span>${totalUsd.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Stat 3: Total KRW Savings */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-xs font-medium text-gray-500 mb-1">
                원화 환산 혜택
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {isLoading ? (
                  <span className="inline-block w-24 h-7 bg-gray-200 rounded animate-pulse" />
                ) : (
                  <span>약 {totalKrw} <span className="text-sm font-semibold text-emerald-600">원</span></span>
                )}
              </div>
            </div>
          </div>

          {/* Bookmark hint */}
          <div className="inline-flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <Bookmark className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white text-gray-800 font-mono text-[11px] border border-gray-300 shadow-2xs">Ctrl + D</kbd> 를 눌러 북마크에 추가하고 정기 0원 게임을 챙기세요.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
