import { CheapSharkDeal } from '@/types/game';

/**
 * "50.004500" 형태의 문자열을 정수 퍼센트로 변환
 */
export function parseSavings(savings: string): number {
  return Math.round(parseFloat(savings));
}

/**
 * 가격 문자열을 달러 표기로 포맷
 */
export function formatPrice(price: string): string {
  const num = parseFloat(price);
  return num === 0 ? '무료' : `$${num.toFixed(2)}`;
}

/**
 * 할인율 minSavings 이상 ~ 100% 미만(완전 무료는 메인 섹션과 중복되므로 제외)만 필터링,
 * 할인율 높은 순으로 정렬
 */
export function filterDiscountedGames(
  deals: CheapSharkDeal[],
  minSavings = 50
): CheapSharkDeal[] {
  return deals
    .filter((d) => {
      const savings = parseSavings(d.savings);
      return savings >= minSavings && savings < 100;
    })
    .sort((a, b) => parseSavings(b.savings) - parseSavings(a.savings));
}
