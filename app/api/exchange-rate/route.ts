import { NextResponse } from 'next/server';

export const revalidate = 86400; // 24시간 캐시

export async function GET() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'GameJub/1.0 (https://gamejub.com)',
      },
      next: { revalidate: 86400 },
    });
    if (!response.ok) {
      throw new Error(`Exchange rate API responded with status ${response.status}`);
    }
    const data = await response.json();
    const rate = data?.rates?.KRW;
    if (typeof rate !== 'number') {
      throw new Error('Invalid exchange rate response');
    }
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
