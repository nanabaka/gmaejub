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

export function getClaimGuide(
  platformGroup: PlatformFilter,
  giveawayType: GiveawayTypeFilter
): ClaimGuide {
  const base = PLATFORM_GUIDES[platformGroup === 'all' ? 'indie' : platformGroup];
  const extraNote = TYPE_NOTES[giveawayType];
  return extraNote ? { ...base, tip: `${base.tip} ${extraNote}` } : base;
}
