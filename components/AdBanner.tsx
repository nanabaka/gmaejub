'use client';

import React, { useEffect } from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
  label?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle?: any[];
    __adsenseScriptLoaded?: boolean;
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId,
  format = 'auto',
  className = '',
}) => {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!adClientId) return;
    let cancelled = false;
    let attempts = 0;

    const tryPush = () => {
      if (cancelled) return;
      if (window.__adsenseScriptLoaded || attempts > 20) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error('AdSense push error:', e);
        }
      } else {
        attempts++;
        setTimeout(tryPush, 250);
      }
    };
    tryPush();

    return () => {
      cancelled = true;
    };
  }, [adClientId]);

  // 애드센스 클라이언트 ID가 등록되지 않은 현재 상태에서는 화면에 아무것도 표시하지 않습니다.
  if (!adClientId || adClientId.trim() === '' || adClientId.includes('XXXXX')) {
    return null;
  }

  return (
    <div className={`w-full mx-auto my-6 px-4 max-w-7xl flex flex-col items-center justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};
