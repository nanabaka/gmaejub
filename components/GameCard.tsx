'use client';

import React, { useState } from 'react';
import { GiveawayGame } from '@/types/game';
import {
  calculateDDay,
  getPlatformBadge,
  parseWorthToUsd,
  formatKrw,
} from '@/utils/formatters';
import { ExternalLink, Clock, AlertTriangle, Gamepad2 } from 'lucide-react';

interface GameCardProps {
  game: GiveawayGame;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const [imgError, setImgError] = useState(false);

  const platformInfo = getPlatformBadge(game.platforms);
  const ddayInfo = calculateDDay(game.end_date);
  const worthUsd = parseWorthToUsd(game.worth);
  const worthKrw = worthUsd > 0 ? formatKrw(worthUsd) : '';

  const imageSrc = game.image || game.thumbnail;

  return (
    <div className="group flex flex-col justify-between bg-white border border-gray-200 hover:border-gray-300 rounded-xl overflow-hidden clean-card">
      {/* Top Media Area */}
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        {!imgError && imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={game.title}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-4">
            <Gamepad2 className="w-10 h-10 text-gray-300 mb-1" />
            <span className="text-xs text-gray-400 text-center line-clamp-1">
              {game.title}
            </span>
          </div>
        )}

        {/* Platform Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border shadow-2xs ${platformInfo.badgeStyle}`}
          >
            {platformInfo.label}
          </span>
        </div>

        {/* 100% OFF Tag (Top Right) */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-gray-900 text-white shadow-2xs">
            100% OFF
          </span>
        </div>

        {/* Deadline Indicator (Bottom Left inside Image) */}
        <div className="absolute bottom-2 left-2.5 right-2.5 z-10">
          <div
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium backdrop-blur-md border shadow-2xs ${
              ddayInfo.isEndingSoon
                ? 'bg-red-50/95 text-red-700 border-red-200'
                : ddayInfo.isLimitedQuantity
                ? 'bg-amber-50/95 text-amber-800 border-amber-200'
                : 'bg-white/95 text-gray-700 border-gray-200'
            }`}
          >
            {ddayInfo.isEndingSoon ? (
              <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
            ) : (
              <Clock className="w-3 h-3 text-gray-500 shrink-0" />
            )}
            <span>{ddayInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Title */}
          <h2
            className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-1 mb-1"
            title={game.title}
          >
            {game.title}
          </h2>

          {/* Description */}
          <p
            className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 min-h-[2.5rem]"
            title={game.description}
          >
            {game.description || '기간 한정 100% 무료 배포 게임입니다.'}
          </p>
        </div>

        <div>
          {/* Pricing Row */}
          <div className="flex items-baseline justify-between py-2 border-t border-gray-100 mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium">정상가</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs line-through text-gray-400 font-mono">
                  {game.worth && game.worth !== 'N/A' ? game.worth : '유료'}
                </span>
                {worthKrw && (
                  <span className="text-[10px] text-gray-400 line-through">
                    (~{worthKrw}원)
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-medium block">혜택가</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-black text-gray-900 tracking-tight">0원</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  무료
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <a
            href={game.open_giveaway_url || game.gamerpower_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm bg-gray-900 hover:bg-black text-white active:scale-[0.99] transition-colors cursor-pointer shadow-2xs"
          >
            <span>0원에 줍줍하기</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
          </a>
        </div>
      </div>
    </div>
  );
};
