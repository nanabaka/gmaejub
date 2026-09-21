import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Vercel Cron이 매일 호출해 데이터 캐시를 미리 데워두는 라우트.
// 방문자가 없는 시간대에도 배포/할인/환율 정보가 최신 상태를 유지하도록 함.
const ENDPOINTS = ['/api/giveaways', '/api/deals', '/api/deals/stores', '/api/exchange-rate'];

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const baseUrl = new URL(request.url).origin;

  const results = await Promise.all(
    ENDPOINTS.map(async (path) => {
      try {
        const res = await fetch(`${baseUrl}${path}`, { cache: 'no-store' });
        return { path, ok: res.ok, status: res.status };
      } catch (error) {
        return {
          path,
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    })
  );

  return NextResponse.json({ refreshedAt: new Date().toISOString(), results });
}
