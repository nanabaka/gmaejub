import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: '개인정보처리방침 - 겜줍 (GameJub)',
  description: '겜줍(GameJub) 서비스의 개인정보처리방침 및 쿠키 이용 안내입니다.',
};

export default function PrivacyPage() {
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
              <Shield className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                개인정보처리방침 (Privacy Policy)
              </h1>
              <p className="text-xs text-gray-400 mt-1">시행일자: 2026년 9월 1일</p>
            </div>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2">1. 총칙</h2>
              <p>
                겜줍(이하 &apos;서비스&apos;)은 이용자의 개인정보를 소중히 여기며, 개인정보 보호법 및 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령을 준수합니다. 본 방침은 서비스 이용 시 수집되는 정보와 그 활용 목적, 그리고 구글 애드센스 등 제3자 광고 서비스 이용에 따른 안내를 담고 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2">2. 수집하는 개인정보 항목 및 방법</h2>
              <p>
                서비스는 회원가입 없이 누구나 자유롭게 이용할 수 있는 공개 큐레이션 서비스로서, 별도의 주민등록번호나 계좌번호 등 민감한 개인식별정보를 직접 수집하거나 보관하지 않습니다.
              </p>
              <p className="mt-2">
                다만, 서비스 이용 과정에서 아래와 같은 접속 로그 정보가 자동으로 생성되어 수집될 수 있습니다:
              </p>
              <ul className="list-disc list-inside ml-2 mt-1 space-y-1 text-gray-500">
                <li>접속 IP 주소, 방문 일시, 브라우저 종류 및 OS 환경, 서비스 이용 기록</li>
              </ul>
            </section>

            <section>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2">3. 구글 애드센스(Google AdSense) 및 쿠키(Cookie) 안내</h2>
              <p>
                본 사이트는 서비스 운영 및 서버 유지비 충당을 위해 제3자 광고 사업자인 Google(구글)의 광고 서비스(Google AdSense)를 이용하고 있습니다.
              </p>
              <ul className="list-disc list-inside ml-2 mt-2 space-y-1.5 text-gray-600">
                <li>
                  Google을 포함한 제3자 공급업체는 사용자의 이전 웹사이트 방문 기록을 바탕으로 관련성 높은 광고를 게재하기 위해 쿠키(Cookie)를 사용합니다.
                </li>
                <li>
                  사용자는 Google 광고 설정(
                  <a
                    href="https://adssettings.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    https://adssettings.google.com
                  </a>
                  )에서 맞춤형 광고 게재를 거부(Opt-out)할 수 있습니다.
                </li>
                <li>
                  또한 웹 브라우저 설정을 통해 쿠키 허용 여부를 선택하거나 기존 쿠키를 삭제할 수 있습니다. (브라우저 도구 &gt; 인터넷 옵션 &gt; 개인정보 설정)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2">4. 개인정보의 보유 및 파기</h2>
              <p>
                서비스는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 법령에 따라 보존하여야 하는 경우 해당 법령이 정한 기간 동안 안전하게 보관 후 파기합니다.
              </p>
            </section>

            <section>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2">5. 외부 링크 정책</h2>
              <p>
                본 사이트에는 스팀, 에픽게임즈, GOG 등 외부 공식 게임 플랫폼으로 연결되는 링크가 포함되어 있습니다. 외부 사이트로 이동하신 후에는 해당 사이트의 개인정보처리방침이 적용되므로, 이동하신 사이트의 정책을 확인하시기 바랍니다.
              </p>
            </section>

            <section>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-2">6. 개인정보 보호책임자 및 문의처</h2>
              <p>
                서비스 이용 중 발생하는 모든 개인정보 관련 문의 및 의견은 아래의 공식 문의처로 접수해 주시면 신속하게 답변해 드리겠습니다.
              </p>
              <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
                <p className="font-semibold text-gray-800">겜줍 (GameJub) 운영팀</p>
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
