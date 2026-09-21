import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Clock, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdBanner } from '@/components/AdBanner';
import { fetchGiveaways } from '@/utils/gameData';
import {
  calculateDDay,
  getPlatformBadge,
  getGiveawayTypeBadge,
  normalizeGiveawayType,
  parseWorthToUsd,
  formatKrw,
  getGameSlug,
  parseGameIdFromSlug,
} from '@/utils/formatters';
import { getClaimGuide } from '@/utils/platformGuides';
import type { GiveawayGame } from '@/types/game';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getGame(slug: string): Promise<GiveawayGame | null> {
  const id = parseGameIdFromSlug(slug);
  if (id === null) return null;
  const games = await fetchGiveaways();
  return games.find((g) => g.id === id) ?? null;
}

export async function generateStaticParams() {
  try {
    const games = await fetchGiveaways();
    return games.map((game) => ({ slug: getGameSlug(game) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) {
    return { title: '배포가 종료된 게임입니다 - 겜줍 (GameJub)' };
  }

  const title = `${game.title} 무료 다운로드 받는 법 - 겜줍 (GameJub)`;
  const description =
    (game.description || `${game.title} 기간 한정 100% 무료 배포 중입니다.`).slice(0, 150);

  return {
    title,
    description,
    alternates: { canonical: `/game/${getGameSlug(game)}` },
    openGraph: {
      title,
      description,
      images: game.image ? [game.image] : undefined,
      type: 'website',
    },
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) {
    notFound();
  }

  const platformInfo = getPlatformBadge(game.platforms);
  const typeInfo = getGiveawayTypeBadge(game.type);
  const ddayInfo = calculateDDay(game.end_date);
  const worthUsd = parseWorthToUsd(game.worth);
  const worthKrw = worthUsd > 0 ? formatKrw(worthUsd) : '';
  const claimUrl = game.open_giveaway_url || game.gamerpower_url;
  const claimGuide = getClaimGuide(platformInfo.platformGroup, normalizeGiveawayType(game.type));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>전체 목록으로 돌아가기</span>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          {game.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={game.image}
              alt={game.title}
              className="w-full aspect-video object-cover bg-gray-100"
            />
          )}

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${platformInfo.badgeStyle}`}
              >
                {platformInfo.label}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${typeInfo.style}`}
              >
                {typeInfo.label}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                  ddayInfo.isEndingSoon
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                {ddayInfo.isEndingSoon ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
                {ddayInfo.label}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 tracking-tight">
              {game.title}
            </h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed whitespace-pre-line">
              {game.description || '기간 한정 100% 무료 배포 게임입니다.'}
            </p>

            <div className="flex items-baseline justify-between py-3 border-t border-b border-gray-100 mb-6">
              <div>
                <span className="text-[11px] text-gray-400 font-medium block">정상가</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm line-through text-gray-400 font-mono">
                    {game.worth && game.worth !== 'N/A' ? game.worth : '유료'}
                  </span>
                  {worthKrw && (
                    <span className="text-xs text-gray-400 line-through">(~{worthKrw}원)</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-gray-400 font-medium block">혜택가</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-gray-900">0원</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    무료
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 bg-gray-50 border border-gray-100 rounded-xl p-4 sm:p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-3">{claimGuide.title}</h2>
              <ol className="space-y-2 mb-3">
                {claimGuide.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="flex items-start gap-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{claimGuide.tip}</span>
              </div>
            </div>

            {game.instructions && (
              <div className="mb-6">
                <h2 className="text-sm font-bold text-gray-900 mb-2">배포처 제공 추가 안내</h2>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {game.instructions}
                </p>
              </div>
            )}

            <a
              href={claimUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-lg font-bold text-sm bg-gray-900 hover:bg-black text-white transition-colors shadow-2xs"
            >
              <span>0원에 줍줍하러 가기</span>
              <ExternalLink className="w-4 h-4 text-gray-300" />
            </a>
          </div>
        </div>

        <div className="mt-8">
          <AdBanner
            slotId="gamejub-detail-slot"
            format="rectangle"
            label="스폰서 / 추천 배너"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
