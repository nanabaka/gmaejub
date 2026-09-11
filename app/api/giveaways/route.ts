import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch('https://www.gamerpower.com/api/giveaways?type=game', {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GameJub/1.0',
      },
      next: { revalidate: 300 }, // 5 minutes cache
    });

    if (!response.ok) {
      throw new Error(`GamerPower API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching giveaways from GamerPower API:', error);
    return NextResponse.json(
      { error: '무료 게임 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
