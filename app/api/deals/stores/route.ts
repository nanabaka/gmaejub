import { NextResponse } from 'next/server';
import { fetchStores } from '@/utils/gameData';

export const revalidate = 86400; // 24시간 캐시

export async function GET() {
  try {
    const stores = await fetchStores();
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
