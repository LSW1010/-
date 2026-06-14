import React from 'react';
import { getSiteConfig, getColumns, isAdminLoggedIn } from '../../data/db';
import { Shield, Sparkles, Feather, ArrowRight, UserCheck, Heart, Landmark } from 'lucide-react';
import { updateMetaTags } from '../../utils/seo';

interface AuthorViewProps {
  navigate: (path: string, param?: string) => void;
}

export default function AuthorView({ navigate }: AuthorViewProps) {
  const config = getSiteConfig();
  const columns = getColumns().filter(c => c.status === 'published');
  const loggedIn = isAdminLoggedIn();

  React.useEffect(() => {
    updateMetaTags(
      '운영자 및 상담사 소개',
      `${config.ownerName} 대표의 명리학 수집 배경과 상담 원칙, 그리고 분야별 전속 고문 상담사들을 소개합니다.`,
      `https://${config.siteUrl}/#/author`
    );
  }, [config]);

  const consultants = [
    {
      name: config.consultantLead,
      role: '사주공방 대표 상담사',
      desc: '정통 격국론 및 용신론 기반의 정밀 사주 분석을 통달하여, 내 인생 그릇의 쓰임새와 가장 극적인 대운 도약 타이밍을 날카롭게 도출해내는 인물학 분석 전문가입니다.',
      icon: <Landmark className="text-theme-accent" size={18} />
    },
    {
      name: config.consultantLove,
      role: '연애 & 궁합 전문 상담사',
      desc: '일간의 심리 기류와 배우자 궁 일지의 충, 합을 중심으로 연인과 부부 사이의 마찰을 매끄럽게 봉합하는 감성 상담가입니다. 대화 구조를 바꾸는 지성을 드립니다.',
      icon: <Heart className="text-theme-accent" size={18} />
    },
    {
      name: config.consultantBusiness,
      role: '사업 & 금전운 전문 상담사',
      desc: '식상생재 및 주체적 비겁 발달 사주의 자영업 포지셔닝에 특화된 상담사입니다. 자금 흐름의 가독성과 세무적 리스크 타이밍을 미리 수치적으로 조력합니다.',
      icon: <Sparkles className="text-theme-accent" size={18} />
    }
  ];

  return (
    <div className="bg-theme-bg min-h-screen py-10 font-sans text-theme-text select-none pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Author Landing Banner */}
        {config.authorShowHeaderBanner !== false && (
          <div className="bg-theme-bg rounded-sm border border-theme-border p-6 sm:p-10 mb-8 relative overflow-hidden">
            
            {/* Admin session indicator box */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-theme-border pb-6 mb-6">
              <div>
                <span className="text-[10px] text-theme-accent bg-theme-warm border border-theme-border px-2 py-0.5 rounded-sm uppercase tracking-wide font-bold block w-fit mb-1">
                  소개 허브 (Author & Columns)
                </span>
                <p className="text-xs text-theme-secondary font-semibold">
                  {loggedIn ? '관리자 상태: 글작성 바로가기가 활성화되어 있습니다.' : '운영자가 정리한 고귀한 학술 및 에세이를 보십시오.'}
                </p>
              </div>

              {loggedIn ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11px] text-theme-accent bg-theme-warm border border-theme-border px-2 py-1 rounded-sm font-bold">
                    <UserCheck size={12} />
                    관리자 계정 감지
                  </span>
                  <button
                    onClick={() => navigate('admin', 'new-column')}
                    className="px-3.5 py-1.5 bg-theme-accent hover:bg-theme-text text-white rounded-sm text-xs font-bold transition shadow-xs uppercase tracking-wider cursor-pointer"
                  >
                    새 칼럼 작성하기
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-theme-secondary font-semibold select-none">
                  일반 방문자 관람중
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="h-20 w-20 rounded-sm bg-theme-warm flex items-center justify-center font-serif text-3xl font-black text-theme-text shrink-0 border-2 border-theme-text shadow-[2.5px_2.5px_0px_0px_rgba(45,41,38,1)]">
                경선
              </div>
              <div>
                <h1 className="font-serif text-2xl font-black text-theme-text mb-2">
                  함경선 <span className="font-sans text-xs sm:text-sm font-bold text-theme-secondary">| 사주공방 창립대표</span>
                </h1>
                <p className="text-theme-secondary text-xs sm:text-sm leading-relaxed mb-4 font-semibold text-justify">
                  {config.ownerBio} 명리학은 수천 년 간 한반도와 한자 문화권을 관습해 온 깊고 유인한 일종의 인간 통계 분석학입니다. 단정하여 불안을 조성하고 굿판을 권유하는 구태의 미신 구습을 철폐하고, 이성적인 성격 교정과 인생 4계절 최적화를 조력하는 맑은 지면을 사수하겠습니다.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* 1. Core Editing & Service Principles (편집 원칙) */}
        {config.authorShowPrinciples !== false && (
          <div className="bg-[#FAF7F2] rounded-sm border border-theme-border p-6 sm:p-10 mb-8">
            <h2 className="font-serif text-lg sm:text-xl font-black text-[#1A1A1A] mb-6 flex items-center gap-2">
              <Shield size={18} className="text-theme-accent" />
              사주공방의 3대 집필 및 편집 원칙
            </h2>
            <div className="space-y-4">
              <div className="border-l-2 border-theme-accent pl-4 py-1">
                <h3 className="font-serif font-black text-theme-text text-sm mb-1">1. 불안 조장 마케팅의 영구 거부</h3>
                <p className="text-theme-secondary text-xs font-semibold leading-relaxed">
                  "올해 삼재라 다 망한다"거나 "살이 껴서 이혼한다"는 성급한 공포 단정 발언을 절대 엄금합니다. 부족한 기운은 태도 교정을 통해 바꿀 수 있음을 이론적으로 항상 병기합니다.
                </p>
              </div>
              <div className="border-l-2 border-theme-accent pl-4 py-1">
                <h3 className="font-serif font-black text-theme-text text-sm mb-1">2. 고전 문헌에 기반한 투명성</h3>
                <p className="text-theme-secondary text-xs font-semibold leading-relaxed">
                  삼명통회, 연해자평, 적천수 등 유서 깊은 한자 문헌 고전 원리에 어긋나는 미확인 신살이나 괴상한 야사 이론은 일절 배격하여 학술지로서의 완성도를 사수합니다.
                </p>
              </div>
              <div className="border-l-2 border-theme-accent pl-4 py-1">
                <h3 className="font-serif font-black text-theme-text text-sm mb-1">3. 상생 행동의 구체적 제시</h3>
                <p className="text-theme-secondary text-xs font-semibold leading-relaxed">
                  단순히 운명이 이렇다고 끝맺는 공허한 종결을 거절합니다. 일상에서 기체 온도를 조화시키고 건강을 회복할 수 있는 구체적인 가내 수납, 운동 계획, 식성 조화, 화술 제어 행동 규약을 담습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Introducing Professional Advisors (상담사 목록) */}
        {config.authorShowConsultants !== false && (
          <div className="bg-theme-bg rounded-sm border border-theme-border p-6 sm:p-10 mb-8">
            <h2 className="font-serif text-lg sm:text-xl font-black text-theme-text mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-theme-accent" />
              분야별 사주공방 서면 고문 상담사
            </h2>
            <div className="space-y-6">
              {consultants.map((con, index) => (
                <div key={index} className="flex gap-4 items-start border-b border-theme-border/60 pb-5 last:border-0 last:pb-0">
                  <div className="p-2.5 bg-[#FAF7F2] border border-theme-border rounded-sm shrink-0">
                    {con.icon}
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-theme-text text-sm mb-1">
                      {con.name} <span className="text-[10px] sm:text-xs text-theme-accent font-sans font-bold">─ {con.role}</span>
                    </h3>
                    <p className="text-theme-secondary text-xs font-semibold leading-relaxed text-justify">
                      {con.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Operator Columns Mini-hub (최신 칼럼) */}
        {config.authorShowRecentColumns !== false && (
          <div className="bg-theme-bg rounded-sm border border-theme-border p-6 sm:p-10">
            <div className="flex justify-between items-end border-b-2 border-theme-text pb-3 mb-6">
              <h2 className="font-serif text-lg sm:text-xl font-black text-theme-text flex items-center gap-2">
                <Feather size={18} className="text-theme-accent" />
                함경선 대표 집필 최근 수필집
              </h2>
              <button
                onClick={() => navigate('columns')}
                className="text-xs text-theme-accent hover:text-theme-text font-bold flex items-center gap-1 cursor-pointer"
              >
                전체 칼럼집 <ArrowRight size={12} />
              </button>
            </div>

            <div className="space-y-4">
              {columns.map((col) => (
                <div
                  key={col.id}
                  onClick={() => navigate('columns', col.slug)}
                  className="cursor-pointer group hover:bg-[#FAF7F2] p-4 rounded-sm transition border border-transparent hover:border-theme-border flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-serif font-black text-[#2D2926] text-xs sm:text-sm group-hover:text-theme-accent transition leading-snug">
                      {col.title}
                    </h3>
                    <p className="text-[10px] text-theme-secondary mt-1 flex items-center gap-2 font-mono font-bold">
                      <span>필자: {col.author}</span>
                      <span>•</span>
                      <span>업데이트: {col.updateDate}</span>
                    </p>
                  </div>
                  <span className="text-[11px] text-theme-accent font-bold inline-flex items-center gap-0.5 group-hover:translate-x-1 duration-150 transition">
                    읽기 <ArrowRight size={12} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
