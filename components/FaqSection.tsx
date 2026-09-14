'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: '배포 기간에 등록하면 평생 무료인가요?',
    answer:
      "네, 명시된 배포 기간 내에 각 스토어(스팀, 에픽게임즈 등)에서 '받기' 또는 '등록'을 완료하면 계정에 영구 귀속되어 언제든 무료로 다운로드하고 플레이할 수 있습니다.",
  },
  {
    question: '게임 배포 정보는 얼마나 자주 업데이트되나요?',
    answer:
      '글로벌 게임 플랫폼의 무료 배포 API를 통해 24시간 실시간으로 갱신되며, 에픽게임즈의 정기 배포(매주 목/금) 및 스팀/GOG의 게릴라 무료 배포를 즉시 반영합니다.',
  },
  {
    question: '겜줍(GameJub)에서 직접 게임을 다운로드받나요?',
    answer:
      '아닙니다. 겜줍은 공식 스토어의 합법적인 100% 할인 정보를 모아 연결해 주는 큐레이션 서비스이며, 모든 수령과 다운로드는 해당 공식 스토어에서 안전하게 진행됩니다.',
  },
];

export const FaqSection: React.FC = () => {
  // 기본적으로 첫 번째 항목은 열어두고, 나머지는 클릭 시 토글
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1, 2]);

  const toggleItem = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800">
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              자주 묻는 질문 (FAQ)
            </h2>
            <p className="text-xs text-gray-500">
              0원 게임 줍줍 전 꼭 알아두어야 할 핵심 안내
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndexes.includes(idx);
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100/80 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600 font-mono">Q.</span>
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 flex items-start gap-2">
                    <span className="text-xs font-bold text-gray-400 font-mono shrink-0 mt-0.5">A.</span>
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
