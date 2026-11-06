import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Lightbulb, Gamepad2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { GameCard } from '@/components/GameCard';
import { fetchExchangeRate, fetchGiveaways } from '@/utils/gameData';
import { calculateDDay, getPlatformBadge, normalizeGiveawayType } from '@/utils/formatters';
import {
  PLATFORM_HUBS,
  getClaimGuide,
  getPlatformHub,
  type PlatformHub,
} from '@/utils/platformGuides';
import { getDeviceKind } from '@/utils/claimInfo';
import type { GiveawayGame } from '@/types/game';

interface PageProps {
  params: Promise<{ platform: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return PLATFORM_HUBS.map((hub) => ({ platform: hub.slug }));
}

function getHubGames(allGames: GiveawayGame[], hub: PlatformHub): GiveawayGame[] {
  return allGames
    .filter(
      (g) =>
        getDeviceKind(g.platforms) === 'pc' &&
        getPlatformBadge(g.platforms).platformGroup === hub.group
    )
    .sort((a, b) => {
      const aIsGame = normalizeGiveawayType(a.type) === 'game' ? 0 : 1;
      const bIsGame = normalizeGiveawayType(b.type) === 'game' ? 0 : 1;
      return aIsGame - bIsGame || b.id - a.id;
    });
}

function countFullGames(games: GiveawayGame[]): number {
  return games.filter((g) => normalizeGiveawayType(g.type) === 'game').length;
}

function buildHubTitle(hub: PlatformHub, games: GiveawayGame[]): string {
  const fullGames = countFullGames(games);
  if (games.length === 0 || (hub.titleWithCount.includes('{g}') && fullGames === 0)) {
    return hub.titleEmpty;
  }
  return hub.titleWithCount.replace('{n}', String(games.length)).replace('{g}', String(fullGames));
}

function buildHubDescription(hub: PlatformHub, games: GiveawayGame[]): string {
  if (games.length === 0) return hub.description;
  const fullGames = countFullGames(games);
  const composition =
    fullGames < games.length
      ? `${hub.name} 무료 배포 ${games.length}개(게임 ${fullGames}개, 나머지는 DLC·아이템·베타)를 모았습니다.`
      : `${hub.name} 무료 게임 ${games.length}개를 모았습니다.`;
  const soonest = games
    .map((g) => calculateDDay(g.end_date))
    .filter((d) => d.rawDiffMs > 0 && Number.isFinite(d.rawDiffMs))
    .sort((a, b) => a.rawDiffMs - b.rawDiffMs)[0];
  const deadline = soonest ? ` 가장 빨리 끝나는 배포는 ${soonest.label}입니다.` : '';
  return `${composition}${deadline} 정가(원화 환산)와 마감일, 받는 방법까지 한눈에 확인하세요.`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform } = await params;
  const hub = getPlatformHub(platform);
  if (!hub) return {};

  let games: GiveawayGame[] = [];
  try {
    games = getHubGames(await fetchGiveaways(), hub);
  } catch {
    // 원본 API 실패 시 개수 없는 기본 제목/설명 사용
  }

  const title = buildHubTitle(hub, games);
  const description = buildHubDescription(hub, games);

  return {
    title,
    description,
    alternates: { canonical: `/free/${hub.slug}` },
    openGraph: { title, description, type: 'website' },
  };
}

export default async function PlatformHubPage({ params }: PageProps) {
  const { platform } = await params;
  const hub = getPlatformHub(platform);
  if (!hub) notFound();

  const [giveawaysResult, rateResult] = await Promise.allSettled([
    fetchGiveaways(),
    fetchExchangeRate(),
  ]);
  const allGames = giveawaysResult.status === 'fulfilled' ? giveawaysResult.value : [];
  const exchangeRate = rateResult.status === 'fulfilled' ? rateResult.value : undefined;

  const games = getHubGames(allGames, hub);

  const guide = getClaimGuide(hub.group, 'game');
  const otherHubs = PLATFORM_HUBS.filter((h) => h.slug !== hub.slug);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>전체 목록으로 돌아가기</span>
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-3">
          {hub.name} 무료 게임 모음
          <span className="ml-2 text-base font-semibold text-gray-500">
            {games.length > 0 ? `지금 ${games.length}개 배포 중` : '현재 배포 없음'}
          </span>
        </h1>
        <div className="max-w-3xl space-y-2 mb-8">
          {hub.intro.map((paragraph, idx) => (
            <p key={idx} className="text-sm text-gray-600 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-12">
            {games.map((game) => (
              <GameCard key={game.id} game={game} exchangeRate={exchangeRate} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 text-center max-w-md mx-auto mb-12 shadow-xs">
            <Gamepad2 className="w-10 h-10 text-gray-300 mb-2" />
            <h2 className="text-sm font-bold text-gray-900 mb-1">
              지금은 진행 중인 {hub.name} 무료 배포가 없습니다
            </h2>
            <p className="text-xs text-gray-500">
              새 배포가 올라오면 이 페이지에 자동으로 표시됩니다. 아래에서 다른 플랫폼의 무료 게임을 확인해 보세요.
            </p>
          </div>
        )}

        <section className="max-w-3xl bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{guide.title}</h2>
          <ol className="space-y-2 mb-4">
            {guide.steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{guide.tip}</span>
          </div>
        </section>

        <nav aria-label="다른 플랫폼 무료 게임" className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-bold text-gray-700">다른 플랫폼</span>
          {otherHubs.map((h) => (
            <Link
              key={h.slug}
              href={`/free/${h.slug}`}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-black hover:border-gray-300 font-medium transition-colors"
            >
              {h.name} 무료 게임
            </Link>
          ))}
        </nav>
      </main>
      <Footer />
    </div>
  );
}
