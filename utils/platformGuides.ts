import type { GiveawayTypeFilter, PlatformFilter } from '@/types/game';

export interface ClaimGuide {
  title: string;
  steps: string[];
  tip: string;
}

const PLATFORM_GUIDES: Record<Exclude<PlatformFilter, 'all'>, ClaimGuide> = {
  steam: {
    title: 'Steam에서 받는 법',
    steps: [
      'Steam 클라이언트를 실행하거나 store.steampowered.com에 로그인합니다.',
      "위 '0원에 줍줍하러 가기' 버튼을 눌러 상점 페이지로 이동합니다.",
      "가격이 0원(무료)으로 표시된 '구매' 또는 '라이브러리에 추가' 버튼을 클릭해 결제를 완료합니다.",
      '완료 후 Steam 라이브러리에서 게임이 보이면 성공입니다.',
    ],
    tip: '무료 배포 기간이 지나면 버튼이 사라지거나 유료로 전환됩니다. 기간 내에 결제(등록)까지 마쳐야 이후에도 계속 무료로 보관돼요.',
  },
  epic: {
    title: '에픽게임즈에서 받는 법',
    steps: [
      'Epic Games 런처를 실행하거나 store.epicgames.com에 로그인합니다.',
      "위 버튼으로 이동해 상점 페이지에서 '무료로 받기(GET)' 버튼을 클릭합니다.",
      '결제 창이 뜨면 결제 금액이 0원인지 확인하고 주문을 완료합니다.',
      "라이브러리 탭에서 게임이 추가됐는지 확인합니다.",
    ],
    tip: '에픽게임즈는 보통 매주 목요일마다 무료 게임 라인업이 교체됩니다. 타이머가 끝나기 전에 꼭 받아두세요.',
  },
  gog: {
    title: 'GOG에서 받는 법',
    steps: [
      'gog.com 계정으로 로그인합니다.',
      '위 버튼으로 이동해 상점 페이지에서 무료 배포 버튼을 클릭합니다.',
      '장바구니/결제 과정을 0원으로 완료합니다.',
      "GOG 갤럭시 또는 계정의 '내가 소유한 게임' 목록에서 확인합니다.",
    ],
    tip: 'GOG는 DRM-free 방식이라 결제 완료 후 설치 파일을 바로 다운로드할 수 있어요.',
  },
  indie: {
    title: '인디 스토어에서 받는 법',
    steps: [
      '안내된 스토어(Itch.io 등) 페이지로 이동합니다.',
      "가격 책정 슬라이더가 있다면 0으로 낮춘 뒤 '지금 다운로드' 또는 '구매'를 클릭합니다.",
      '결제 없이 진행되는지 확인한 뒤 다운로드를 완료합니다.',
    ],
    tip: '배포처마다 진행 방식이 조금씩 다를 수 있어요. 페이지에 안내된 문구도 함께 확인하세요.',
  },
};

const TYPE_NOTES: Record<GiveawayTypeFilter, string | null> = {
  game: null,
  loot: 'DLC·쿠폰은 대상 게임 본편을 이미 보유하고 있어야 적용되는 경우가 많습니다. 소유 여부를 먼저 확인하세요.',
  beta: '베타·얼리 액세스 참가권은 별도 키 등록이나 설문 참여가 필요할 수 있습니다. 페이지 안내를 꼼꼼히 확인하세요.',
};

export interface PlatformHub {
  slug: string;
  group: Exclude<PlatformFilter, 'all'>;
  name: string;
  title: string;
  description: string;
  intro: string[];
}

export const PLATFORM_HUBS: PlatformHub[] = [
  {
    slug: 'epic',
    group: 'epic',
    name: '에픽게임즈',
    title: '에픽게임즈 무료 게임 모음 - 이번 주 0원 배포 (Epic Games Free)',
    description:
      '에픽게임즈 스토어에서 지금 무료로 받을 수 있는 게임을 한곳에 모았습니다. 마감일과 정가(원화 환산), 받는 방법까지 확인하세요.',
    intro: [
      '에픽게임즈 스토어는 정기적으로 게임을 기간 한정 무료로 배포합니다. 보통 매주 목요일에 라인업이 교체되고, 배포 기간 안에 라이브러리에 추가해 두면 이후에도 계속 보유할 수 있어요.',
      '겜줍은 지금 진행 중인 에픽게임즈 무료 배포를 모아서 보여주고, 마감 시점과 정가를 원화로 환산해 함께 안내합니다.',
    ],
  },
  {
    slug: 'steam',
    group: 'steam',
    name: 'Steam',
    title: '스팀 무료 게임 모음 - 지금 0원 배포 중인 게임 (Steam Free)',
    description:
      'Steam에서 기간 한정으로 무료 배포 중인 게임과 DLC를 모았습니다. 마감일, 정가, 라이브러리에 등록하는 방법을 한눈에 확인하세요.',
    intro: [
      'Steam에서는 개발사나 퍼블리셔의 프로모션으로 게임과 DLC가 기간 한정으로 무료 배포됩니다. 무료 체험 주말과 달리, 배포 기간 안에 라이브러리에 추가하면 이후에도 계속 보유할 수 있는 경우가 많아요.',
      '겜줍은 지금 받을 수 있는 Steam 무료 배포를 모아서 마감 시점과 정가(원화 환산)까지 함께 정리합니다.',
    ],
  },
  {
    slug: 'gog',
    group: 'gog',
    name: 'GOG',
    title: 'GOG 무료 게임 모음 - 지금 0원 배포 중인 게임 (GOG Free)',
    description:
      'GOG에서 기간 한정으로 무료 배포 중인 게임을 모았습니다. DRM-free 게임을 0원에 받는 방법과 마감일을 확인하세요.',
    intro: [
      'GOG는 DRM-free 방식의 게임 스토어로, 가끔 기간 한정 무료 배포를 진행합니다. 한 번 받아두면 설치 파일을 직접 내려받아 보관할 수 있어요.',
      'GOG 무료 배포는 자주 열리지 않아서, 진행 중일 때 바로 확인할 수 있도록 겜줍이 실시간으로 모아 보여줍니다.',
    ],
  },
  {
    slug: 'indie',
    group: 'indie',
    name: '인디 스토어',
    title: 'Itch.io · 인디 게임 무료 배포 모음 - 지금 0원으로 받기',
    description:
      'Itch.io, IndieGala 등 인디 스토어에서 무료로 배포 중인 게임을 모았습니다. 배포처별 받는 방법과 마감일을 확인하세요.',
    intro: [
      'Itch.io, IndieGala 같은 인디 스토어에서도 기간 한정 무료 배포가 자주 열립니다. 대작은 아니어도 취향에 맞는 숨은 게임을 0원에 발견할 수 있어요.',
      '배포처마다 받는 방식이 조금씩 달라서, 겜줍은 각 게임 페이지에 단계별 안내를 함께 정리해 두었습니다.',
    ],
  },
];

const SLUG_PLATFORM_TO_HUB: Record<string, string> = {
  'epic-games': 'epic',
  epic: 'epic',
  steam: 'steam',
  gog: 'gog',
  itchio: 'indie',
  'itch-io': 'indie',
  indiegala: 'indie',
};

// 종료된 게임 슬러그 끝의 "-steam-giveaway", "-epic-games-key-giveaway" 같은 꼬리표로 플랫폼 허브를 추정
export function inferHubPathFromSlug(slug: string): string {
  const match = slug.toLowerCase().match(/-(epic-games|epic|steam|gog|itchio|itch-io|indiegala)(?:-key)?-giveaway$/);
  const hubSlug = match ? SLUG_PLATFORM_TO_HUB[match[1]] : undefined;
  return hubSlug ? `/free/${hubSlug}` : '/';
}

export function getPlatformHub(slug: string): PlatformHub | undefined {
  return PLATFORM_HUBS.find((hub) => hub.slug === slug);
}

export function getClaimGuide(
  platformGroup: PlatformFilter,
  giveawayType: GiveawayTypeFilter
): ClaimGuide {
  const base = PLATFORM_GUIDES[platformGroup === 'all' ? 'indie' : platformGroup];
  const extraNote = TYPE_NOTES[giveawayType];
  return extraNote ? { ...base, tip: `${base.tip} ${extraNote}` } : base;
}
