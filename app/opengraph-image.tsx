import { ImageResponse } from 'next/og';

export const alt = '겜줍 (GameJub) - 0원 무료 게임 실시간 트래커';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #111827 0%, #000000 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 20,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 56,
            }}
          >
            🎮
          </div>
          <div style={{ display: 'flex', fontSize: 80, fontWeight: 900, color: '#ffffff' }}>
            겜줍
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#9ca3af', marginBottom: 40 }}>
          GameJub · 0원 무료 게임 실시간 트래커
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 28px',
            borderRadius: 999,
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid rgba(16, 185, 129, 0.5)',
          }}
        >
          <div style={{ display: 'flex', width: 16, height: 16, borderRadius: 999, background: '#10b981' }} />
          <div style={{ display: 'flex', fontSize: 28, color: '#34d399', fontWeight: 700 }}>
            Steam · Epic Games · GOG 실시간 배포 레이더
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
