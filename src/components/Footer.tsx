import React from 'react';
import { getSiteConfig, isAdminLoggedIn } from '../data/db';
import SajuLogo from './SajuLogo';

interface FooterProps {
  navigate: (path: string) => void;
}

export default function Footer({ navigate }: FooterProps) {
  const config = getSiteConfig();
  const loggedIn = isAdminLoggedIn();

  return (
    <footer className="w-full bg-[#FAF7F2] text-theme-secondary font-sans border-t border-theme-border pb-12 pt-10 text-[11px] sm:text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Foot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-theme-border pb-8">
          
          {/* Col 1: Brand introduction */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
            <SajuLogo size={32} className="text-[#0B2240] hover:scale-110 transition-transform duration-300" />
              <span className="font-serif text-sm font-extrabold text-theme-text tracking-widest">
                {config.siteName}
              </span>
            </div>
            <p className="text-theme-secondary font-medium text-[11px] sm:text-xs leading-relaxed max-w-sm">
              정통 명리학 학설을 기반으로 한 사주, 운세 해설 미디어 채널입니다. 미신과 단정을 배격하고, 삶의 균형과 지혜로운 선택을 돕는 인간 중심 데이터를 지향합니다.
            </p>
          </div>

          {/* Col 2: Major Navigation links */}
          <div>
            <p className="text-theme-text text-xs font-bold mb-3 tracking-widest uppercase font-serif border-b border-theme-border/60 pb-1 inline-block">콘텐츠 목록</p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('columns')} className="hover:text-theme-accent hover:underline transition font-medium text-left">
                  사주공방 칼럼
                </button>
              </li>
              <li>
                <button onClick={() => navigate('categories')} className="hover:text-theme-accent hover:underline transition font-medium text-left">
                  카테고리 학술정보
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-theme-accent hover:underline transition font-medium text-left">
                  사주공방 소개
                </button>
              </li>
              <li>
                <button onClick={() => navigate('sitemap')} className="hover:text-[#2d2926] hover:underline transition font-medium text-left">
                  사이트맵 (HTML)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Privacy policies */}
          <div>
            <p className="text-theme-text text-xs font-bold mb-3 tracking-widest uppercase font-serif border-b border-theme-border/60 pb-1 inline-block">정책 및 신뢰</p>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('privacy')} className="hover:text-theme-accent hover:underline transition font-medium text-left">
                  개인정보처리방침
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-theme-accent hover:underline transition font-medium text-left">
                  이용약관
                </button>
              </li>
              <li>
                <button onClick={() => navigate('disclaimer')} className="hover:text-theme-accent hover:underline transition font-medium text-left">
                  책임 및 면책고지
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-theme-accent hover:underline transition font-bold text-theme-accent/95 text-left">
                  메일 문의하기
                </button>
              </li>
              <li>
                {loggedIn ? (
                  <button onClick={() => navigate('admin')} className="hover:text-theme-accent hover:underline transition font-bold text-theme-accent/95 text-left">
                    관리자 제어판
                  </button>
                ) : (
                  <button onClick={() => navigate('admin')} className="hover:text-theme-accent hover:underline transition font-light text-left">
                    관리자 로그인
                  </button>
                )}
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Foot: Regulatory disclosures */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-theme-secondary/90 leading-relaxed font-light">
            <div>
              <p>
                <span className="font-semibold text-theme-text/80">상호명:</span> {config.companyName} &nbsp;|&nbsp;&nbsp;
                <span className="font-semibold text-theme-text/80">대표자명:</span>{' '}
                <button
                  onClick={() => navigate('author')}
                  className="font-bold text-theme-accent hover:underline cursor-pointer"
                >
                  {config.ownerName}
                </button> &nbsp;|&nbsp;&nbsp;
                <span className="font-semibold text-theme-text/80">사업자등록번호:</span> {config.businessNumber}
              </p>
              <p>
                <span className="font-semibold text-theme-text/80">통신판매업신고번호:</span> {config.mailOrderNumber} &nbsp;|&nbsp;&nbsp;
                <span className="font-semibold text-theme-text/80">개인정보보호책임자:</span> {config.privacyOfficer}
              </p>
              <p>
                <span className="font-semibold text-theme-text/80">주소:</span> {config.address}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold text-theme-text/80">전화번호:</span> {config.phone} &nbsp;|&nbsp;&nbsp;
                <span className="font-semibold text-theme-text/80">팩스번호:</span> {config.fax}
              </p>
              <p>
                <span className="font-semibold text-theme-text/80">공식 이메일:</span> {config.contactEmail} (이메일 기반 문의 처리)
              </p>
              <p>
                <span className="font-semibold text-theme-text/80">소속 상담사:</span> {' '}
                <span className="text-theme-text/80 font-medium">천명 (대표) | 지애 (연애전문) | 금명 (사업·금전)</span>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-theme-border/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-theme-secondary/70 gap-2">
            <p>
              © {new Date().getFullYear()} {config.siteName}. All Rights Reserved. 본 사이트의 콘텐츠는 무단 복제 및 전재를 철저히 금지합니다.
            </p>
            <p className="font-mono text-[10px] tracking-wider text-theme-secondary/50">
              CRAFTED IN BOLD TYPOGRAPHY STYLE
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
