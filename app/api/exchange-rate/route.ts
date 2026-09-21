import { NextResponse } from 'next/server';
import { fetchExchangeRate } from '@/utils/gameData';

export const revalidate = 86400; // 24시간 캐시

export async function GET() {
  try {
    const rate = await fetchExchangeRate();
    return NextResponse.json(
      { rate },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    // 실패 시 기본값 반환 (서비스 중단 방지)
    return NextResponse.json({ rate: 1380, fallback: true });
  }
}
