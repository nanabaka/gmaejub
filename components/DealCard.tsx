'use client';

import React, { useState } from 'react';
import { CheapSharkDeal } from '@/types/game';
import { parseSavings, formatPrice } from '@/utils/dealFormatters';
import { ExternalLink, Tag } from 'lucide-react';

interface DealCardProps {
  deal: CheapSharkDeal;
  storeName: string;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, storeName }) => {
  const [imgError, setImgError] = useState(false);
  const savingsPercent = parseSavings(deal.savings);
  const dealUrl = `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`;

  return (
    <div className="group flex flex-col justify-between bg-white border border-gray-200 hover:border-gray-300 rounded-xl overflow-hidden clean-card">
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        {!imgError && deal.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={deal.thumb}
            alt={deal.title}
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <Tag className="w-10 h-10 text-gray-300" />
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border shadow-2xs bg-gray-100 text-gray-800 border-gray-200">
            {storeName}
          </span>
        </div>
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-red-600 text-white shadow-2xs">
            -{savingsPercent}%
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between">
        <h2
          className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1 mb-3"
          title={deal.title}
        >
          {deal.title}
        </h2>
        <div>
          <div className="flex items-baseline justify-between py-2 border-t border-gray-100 mb-3">
            <span className="text-xs line-through text-gray-400 font-mono">
              {formatPrice(deal.normalPrice)}
            </span>
            <span className="text-lg font-black text-red-600 tracking-tight">
              {formatPrice(deal.salePrice)}
            </span>
          </div>
          <a
            href={dealUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm bg-gray-900 hover:bg-black text-white active:scale-[0.99] transition-colors cursor-pointer shadow-2xs"
          >
            <span>할인가로 구매하기</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
          </a>
        </div>
      </div>
    </div>
  );
};
