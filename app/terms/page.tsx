import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: '이용약관 - 겜줍 (GameJub)',
  description: '겜줍(GameJub) 서비스 이용약관 및 서비스 제공 조건 안내입니다.',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>메인으로 돌아가기</span>
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-800">
              <FileText className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                이용약관 (Terms of Service)
              </h1>
              <p className="text-xs text-gray-400 mt-1">시행일자: 2026년 9월 1일</p>
            </div>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2">제1조 (목적)</h2>
              <p>
                본 약관은 겜줍(이하 &apos;서비스&apos;)이 제공하는 글로벌 PC 게임 무료 배포 및 할인 정보 큐레이션 서비스의 이용조건 및 절차, 이용자와 서비스 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2">제2조 (서비스의 내용 및 성격)</h2>
              <p>
                1. 겜줍은 스팀(Steam), 에픽게임즈(Epic Games), GOG, 인디 스토어 등 공식 게임 유통 플랫폼에서 합법적으로 제공되는 무료 배포 및 할인 프로모션 정보를 실시간으로 수집하여 이용자에게 무료로 연결해 주는 정보 제공 서비스입니다.
              </p>
              <p className="mt-2">
                2. 겜줍은 직접 게임 설치 파일을 호스팅하거나 판매하지 않으며, 모든 다운로드와 결제(0원 결제 포함)는 각 게임 유통 플랫폼의 공식 웹사이트에서 직접 이루어집니다.
              </p>
            </section>

            <section>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2">제3조 (면책 조항)</h2>
              <p>
                1. 무료 배포 프로모션의 수량, 기간, 제공 조건 등은 각 게임 개발사 및 유통 플랫폼의 고유 권한이며, 사전 예고 없이 변경되거나 조기 마감될 수 있습니다. 겜줍은 정보 제공의 신속성을 위해 최선을 다하나, 외부 플랫폼의 급작스러운 정책 변경이나 지연으로 인한 손해에 대해 법적 책임을 지지 않습니다.
              </p>
              <p className="mt-2">
                2. 각 플랫폼의 계정 정책, 지역 제한(Country Restriction), 시스템 사양 미달 등으로 인해 발생한 게임 수령 및 실행 불가 문제에 대해 서비스는 책임을 지지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2">제4조 (지식재산권 및 상표권)</h2>
              <p>
                서비스에 게재된 게임의 명칭, 로고, 이미지, 스크린샷 등 모든 지식재산권은 해당 게임 개발사, 퍼블리셔 및 유통 플랫폼사에 귀속됩니다. 겜줍은 정보 전달을 목적으로 한 공정 이용(Fair Use) 원칙을 준수합니다.
              </p>
            </section>

            <section>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2">제5조 (문의 및 피드백)</h2>
              <p>
                서비스 이용에 관한 문의나 오류 제보는 아래 공식 이메일로 접수해 주시기 바랍니다.
              </p>
              <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                <p className="font-semibold text-gray-800">겜줍 (GameJub) 고객지원</p>
                <p className="text-gray-600 mt-0.5">이메일: <a href="mailto:contact@gamejub.com" className="text-blue-600 underline">contact@gamejub.com</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
