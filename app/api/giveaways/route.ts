import { NextResponse } from 'next/server';
import { fetchGiveaways } from '@/utils/gameData';

export async function GET() {
  try {
    const data = await fetchGiveaways();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching giveaways from GamerPower API:', error);
    return NextResponse.json(
      { error: '배포 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
