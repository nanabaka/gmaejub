import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CalendarX } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  cleanGameTitle,
  formatKoreanDate,
  formatKrw,
  getGameSlug,
  getPlatformBadge,
  normalizeGiveawayType,
  parseEndDate,
  parseWorthToUsd,
} from '@/utils/formatters';
import { DEVICE_LABEL, getDeviceKind } from '@/utils/claimInfo';
import { PLATFORM_HUBS } from '@/utils/platformGuides';
import type { GiveawayGame } from '@/types/game';

interface EndedGameProps {
  game: GiveawayGame;
  liveGames: GiveawayGame[];
}

export function EndedGame({ game, liveGames }: EndedGameProps) {
  const platformInfo = getPlatformBadge(game.platforms);
  const device = getDeviceKind(game.platforms);
  const name = cleanGameTitle(game.title);
  const endDate = parseEndDate(game.end_date);
  const endLabel = endDate ? formatKoreanDate(endDate) : '';
  const worthUsd = parseWorthToUsd(game.worth);
  const hub = PLATFORM_HUBS.find((h) => h.group === platformInfo.platformGroup);

  const currentGames = liveGames
    .filter(
      (g) =>
        getDeviceKind(g.platforms) === 'pc' &&
        getPlatformBadge(g.platforms).platformGroup === platformInfo.platformGroup
    )
    .sort((a, b) => {
      const aIsGame = normalizeGiveawayType(a.type) === 'game' ? 0 : 1;
      const bIsGame = normalizeGiveawayType(b.type) === 'game' ? 0 : 1;
      return aIsGame - bIsGame || b.id - a.id;
    })
    .slice(0, 6);

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
            <div className="relative w-full aspect-video bg-gray-100">
              <Image
                src={game.image}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                className="object-cover grayscale"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  device === 'pc'
                    ? platformInfo.badgeStyle
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {device === 'pc' ? platformInfo.label : DEVICE_LABEL[device]}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-gray-200 text-gray-700">
                <CalendarX className="w-3 h-3" />
                배포 종료
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 tracking-tight">
              {name} 무료 배포 종료
            </h1>

            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {name}의 {platformInfo.label} 무료 배포는{' '}
              {endLabel ? <strong>{endLabel}</strong> : '이미'} 종료되었습니다.
              {worthUsd > 0 &&
                ` 배포 당시 정가는 ${game.worth}(약 ${formatKrw(worthUsd)}원)였어요.`}{' '}
              지금은 이 페이지에서 받을 수 없고, 같은 게임이 다시 무료로 풀리면 겜줍의 무료 게임 목록에 올라옵니다.
            </p>

            {game.description && (
              <div className="mb-2">
                <h2 className="text-sm font-bold text-gray-900 mb-2">게임 소개</h2>
                <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
                  {game.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {(currentGames.length > 0 || hub) && (
          <section className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            {currentGames.length > 0 && (
              <>
                <h2 className="text-sm font-bold text-gray-900 mb-3">
                  지금 받을 수 있는 {platformInfo.label} 무료 게임
                </h2>
                <ul className="space-y-2 mb-4">
                  {currentGames.map((g) => (
                    <li key={g.id}>
                      <Link
                        href={`/game/${getGameSlug(g)}`}
                        className="text-sm text-gray-700 hover:text-black underline underline-offset-2"
                      >
                        {cleanGameTitle(g.title)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {hub && (
              <Link
                href={`/free/${hub.slug}`}
                className="inline-flex items-center text-sm font-semibold text-gray-900 hover:underline"
              >
                {hub.name} 무료 게임 전체 보기 →
              </Link>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
