import { NextResponse } from 'next/server';
import { fetchDeals } from '@/utils/gameData';

export async function GET() {
  try {
    const data = await fetchDeals();
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
