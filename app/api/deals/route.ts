import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(
      'https://www.cheapshark.com/api/1.0/deals?sortBy=Savings&desc=0&pageSize=60&onSale=1',
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'GameJub/1.0 (https://gamejub.com)',
        },
        next: { revalidate: 1800 }, // 30분 캐시
      }
    );
    if (!response.ok) {
      throw new Error(`CheapShark API responded with status ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching deals from CheapShark API:', error);
    return NextResponse.json(
      { error: '할인 게임 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
