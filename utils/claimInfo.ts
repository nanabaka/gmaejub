import type { GiveawayGame, GiveawayTypeFilter, PlatformFilter } from '@/types/game';
import { getClaimGuide, type ClaimGuide } from '@/utils/platformGuides';

export type DeviceKind = 'pc' | 'mobile' | 'vr';

export const DEVICE_LABEL: Record<Exclude<DeviceKind, 'pc'>, string> = {
  mobile: '모바일 전용',
  vr: 'VR 전용',
};

export function getDeviceKind(platforms: string): DeviceKind {
  const tokens = (platforms || '').toLowerCase().split(',').map((t) => t.trim());
  if (tokens.includes('pc')) return 'pc';
  if (tokens.some((t) => t.includes('vr'))) return 'vr';
  if (tokens.some((t) => t === 'android' || t === 'ios')) return 'mobile';
  return 'pc';
}

export interface AccessNotice {
  short: string | null;
  note: string;
  keyRedeem: boolean;
}

export function getAccessNotice(
  game: Pick<GiveawayGame, 'title' | 'instructions'>
): AccessNotice | null {
  const instructions = game.instructions || '';
  const haystack = `${game.title} ${instructions}`;

  if (/alienware/i.test(haystack)) {
    const arp = instructions.match(/(\d+)\s*ARP/i)?.[1];
    return {
      short: 'Alienware Arena 계정 필요',
      note: `Alienware Arena 무료 계정으로 로그인해야 키를 받을 수 있어요.${
        arp ? ` 이 배포는 ${arp} ARP 포인트가 필요합니다.` : ''
      }`,
      keyRedeem: true,
    };
  }
  if (/indiegala/i.test(haystack)) {
    return {
      short: 'IndieGala 계정 필요',
      note: 'IndieGala 무료 계정으로 로그인해야 받을 수 있어요.',
      keyRedeem: false,
    };
  }
  if (/stove/i.test(game.title)) {
    return {
      short: 'Stove 계정 필요',
      note: 'Stove(스토브) 계정으로 로그인해야 받을 수 있어요.',
      keyRedeem: false,
    };
  }
  if (/itch\.?io/i.test(haystack)) {
    return {
      short: null,
      note: 'Itch.io 계정으로 로그인하면 라이브러리에 추가할 수 있어요.',
      keyRedeem: false,
    };
  }
  return null;
}

const MOBILE_GUIDE: ClaimGuide = {
  title: '모바일 앱 무료 배포 받는 법',
  steps: [
    '스마트폰에서 아래 버튼의 링크를 열거나, Google Play / App Store에서 게임 이름을 검색합니다.',
    "가격이 0원(무료)으로 표시되는지 확인한 뒤 '설치' 또는 '받기'를 누릅니다.",
    '로그인한 계정의 구매 목록에 추가되면 이후에도 계속 보유할 수 있습니다.',
  ],
  tip: 'PC에서는 받을 수 없는 모바일 전용 배포입니다. 배포 기간이 끝나면 다시 유료로 전환될 수 있어요.',
};

const VR_GUIDE: ClaimGuide = {
  title: 'VR 게임 무료 배포 받는 법',
  steps: [
    '해당 VR 스토어(Meta Quest, Steam VR 등) 계정으로 로그인합니다.',
    '아래 버튼으로 이동해 스토어 페이지에서 0원인지 확인하고 받기를 누릅니다.',
    'VR 기기의 라이브러리에 추가됐는지 확인합니다.',
  ],
  tip: 'VR 기기가 있어야 플레이할 수 있습니다. 배포 기간 안에 라이브러리에 추가해 두세요.',
};

const KEY_REDEEM_GUIDE: ClaimGuide = {
  title: 'Alienware Arena에서 키 받는 법',
  steps: [
    '아래 버튼을 눌러 Alienware Arena 배포 페이지로 이동합니다.',
    "Alienware Arena 무료 계정으로 로그인한 뒤 '키 받기(Unlock)' 버튼을 클릭합니다.",
    "받은 키를 해당 플랫폼(예: Steam)의 '게임 → 제품 활성화'에서 등록하면 라이브러리에 추가됩니다.",
  ],
  tip: '키는 선착순으로 소진될 수 있고, 일부 배포는 ARP 포인트가 필요합니다. 키를 받은 뒤에는 바로 등록해 두세요.',
};

export function getGuideForGame(
  game: Pick<GiveawayGame, 'platforms' | 'title' | 'instructions'>,
  platformGroup: PlatformFilter,
  giveawayType: GiveawayTypeFilter
): ClaimGuide {
  const device = getDeviceKind(game.platforms);
  if (device === 'mobile') return MOBILE_GUIDE;
  if (device === 'vr') return VR_GUIDE;
  if (getAccessNotice(game)?.keyRedeem) return KEY_REDEEM_GUIDE;
  return getClaimGuide(platformGroup, giveawayType);
}
