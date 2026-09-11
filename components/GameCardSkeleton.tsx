'use client';

import React from 'react';

export const GameCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      {/* Thumbnail skeleton */}
      <div className="w-full aspect-video bg-gray-100 relative">
        <div className="absolute top-2.5 left-2.5 w-14 h-5 bg-gray-200 rounded" />
        <div className="absolute top-2.5 right-2.5 w-14 h-5 bg-gray-200 rounded" />
        <div className="absolute bottom-2 left-2.5 w-24 h-5 bg-gray-200 rounded" />
      </div>

      {/* Body skeleton */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Title */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          {/* Description */}
          <div className="h-3 bg-gray-100 rounded w-full mb-1.5" />
          <div className="h-3 bg-gray-100 rounded w-4/5" />
        </div>

        <div>
          {/* Price line */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100 mb-3">
            <div className="h-3.5 bg-gray-100 rounded w-14" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          {/* Button */}
          <div className="h-9 bg-gray-200 rounded-lg w-full" />
        </div>
      </div>
    </div>
  );
};
