'use client';

import React from 'react';
import { Gamepad2, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white text-gray-500 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-gray-900">
                겜줍 <span className="text-xs font-normal text-gray-500">GameJub</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              놓치면 사라지는 이번 주 0원 게임 줍줍 트래커. 스팀, 에픽게임즈, GOG, 인디 스토어의 100% 무료 배포 게임을 실시간으로 안내합니다.
            </p>
          </div>

          {/* Service Notice */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              배포 안내 및 주의사항
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              무료 배포 행사는 개발사 및 플랫폼의 사정에 따라 예고 없이 조기 종료되거나 변경될 수 있습니다. 유효 기간 내 스토어 상세 페이지에서 0원 결제 완료 후 라이브러리 등록을 꼭 확인하세요.
            </p>
          </div>

          {/* Trademark & Disclaimer */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Disclaimer
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              겜줍(GameJub)은 독립 정보 제공 서비스이며, Valve Corporation(Steam), Epic Games, CD PROJEKT(GOG), Itch.io 등 각 플랫폼사와 공식 제휴 관계가 없습니다. 모든 상표 및 게임 저작권은 해당 권리자에게 있습니다.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} 겜줍 (GameJub). All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Gamers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
