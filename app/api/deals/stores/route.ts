import { NextResponse } from 'next/server';

export const revalidate = 86400; // 24시간 캐시

export async function GET() {
  try {
    const response = await fetch('https://www.cheapshark.com/api/1.0/stores', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'GameJub/1.0 (https://gamejub.com)',
      },
      next: { revalidate: 86400 },
    });
    if (!response.ok) {
      throw new Error(`CheapShark stores API responded with status ${response.status}`);
    }
    const stores = await response.json();
    return NextResponse.json(stores, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
      },
    });
  } catch (error) {
    console.error('Error fetching stores from CheapShark API:', error);
    return NextResponse.json(
      { error: '스토어 목록을 불러오지 못했습니다.' },
      { status: 500 }
    );
  }
}
