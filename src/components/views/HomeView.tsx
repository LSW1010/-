import React from 'react';
import { BookOpen, Award, ArrowRight, CheckCircle2, Flame, Sparkles, AlertTriangle } from 'lucide-react';
import { getSiteConfig, getPosts, getCategories, getColumns } from '../../data/db';

interface HomeViewProps {
  navigate: (path: string, param?: string) => void;
}

export default function HomeView({ navigate }: HomeViewProps) {
  const config = getSiteConfig();
  const posts = getPosts().filter(p => p.status === 'published');
  const categories = getCategories();
  const columns = getColumns().filter(c => c.status === 'published');

  // Recommendation posts (Featured tags)
  const featuredPosts = posts.filter(p => p.isFeatured).slice(0, 3);
  // Recent posts
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime())
    .slice(0, 4);

  const alignCenter = config.homeHeroAlign === 'center';

  return (
    <div className="bg-theme-bg font-sans min-h-screen text-theme-text select-none pb-12">
      
      {/* 1. Hero Section (5-second Immediate Intent Grasp) */}
      {config.homeShowHero !== false && (
        <section className={`relative overflow-hidden bg-theme-bg border-b border-theme-border py-16 sm:py-20 text-theme-text ${alignCenter ? 'text-center' : 'text-left'}`}>
          {/* Subtle geometric dot accent to evoke an ancient cosmic lattice map */}
          <div className="absolute inset-0 bg-[radial-gradient(#8C8279_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-[0.06]"></div>
          
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col ${alignCenter ? 'items-center' : 'items-start'}`}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-theme-warm border border-theme-border text-theme-accent text-[11px] font-bold tracking-wider uppercase mb-6 rounded-sm">
              <Sparkles size={12} className="animate-pulse" />
              미신을 넘어 인문학적 가치를 추구하는 명리학
            </div>
            
            <h1 className="font-serif text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] max-w-4xl mb-6 text-theme-text">
              {config.homeHeroTitle || '당신의 생년월일시,'}<br />
              {config.homeHeroSubtitle ? (
                <span className="text-theme-accent font-serif font-black underline decoration-[4px] decoration-theme-border underline-offset-4">{config.homeHeroSubtitle}</span>
              ) : (
                <span className="text-theme-accent font-serif font-black underline decoration-[4px] decoration-theme-border underline-offset-4">우주가 프로그래밍한 코드</span>
              )}{!config.homeHeroSubtitle && '를 해독합니다'}
            </h1>
            
            <p className={`font-sans text-theme-secondary text-sm sm:text-base max-w-2xl mb-8 leading-relaxed font-semibold ${alignCenter ? 'text-center' : 'text-justify'}`}>
              {config.tagline}. 사주공방은 단정형 공포 마케팅을 일절 배격하며, 오직 정통 고전 이론을 기반으로 당신 삶의 계절적 타이밍과 심리 장벽 극복안을 제시합니다.
            </p>

            <div className={`flex flex-wrap gap-3 ${alignCenter ? 'justify-center' : ''}`}>
              <button
                onClick={() => navigate('categories')}
                className="px-6 py-3.5 bg-theme-accent hover:bg-theme-text text-white font-sans text-xs font-bold tracking-wider uppercase rounded-sm cursor-pointer shadow-[3px_3px_0px_0px_rgba(45,41,38,1)] transition-all inline-flex items-center gap-2"
              >
                {config.homeHeroButtonText || '사주 정보 탐색하기'} <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('author')}
                className="px-6 py-3.5 bg-transparent hover:bg-theme-warm text-theme-text border-2 border-theme-text font-sans text-xs font-bold tracking-wider uppercase rounded-sm cursor-pointer transition-all"
              >
                상담사 & 운영 철학
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. Core Operational Pillars (Purpose of Site) */}
      {config.homeShowPillars !== false && (
        <section className="py-12 bg-theme-bg border-b border-theme-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x md:divide-theme-border">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-theme-warm border border-theme-border text-theme-accent rounded-sm shrink-0">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-[15px] font-black text-theme-text mb-1">정통 명리학 이성 분석</h3>
                  <p className="text-theme-secondary text-[11px] font-medium leading-relaxed">
                    음양오행의 생극제화(生剋제化)라는 명확하고 균형 잡힌 원리로 삶의 수치를 해독하여 지적 만족을 드립니다.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 md:pl-6">
                <div className="p-2.5 bg-theme-warm border border-theme-border text-theme-accent rounded-sm shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-[15px] font-black text-theme-text mb-1">인간 중심·행동 개운</h3>
                  <p className="text-theme-secondary text-[11px] font-medium leading-relaxed">
                    결정론적인 불안 조장을 지양하고, 성격 개선과 일상 습관 리팩토링을 통해 운을 긍정적으로 틔울 행동 팁을 전합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 md:pl-6">
                <div className="p-2.5 bg-theme-warm border border-theme-border text-theme-accent rounded-sm shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-[15px] font-black text-theme-text mb-1">지속 확인되는 명부 정보</h3>
                  <p className="text-theme-secondary text-[11px] font-medium leading-relaxed">
                    현대적 직무 구직자, 연애 입문자들이 현실적으로 마주하는 고민 흐름에 맞춰 사례를 끊임없이 검토하고 보정합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Representative Categories */}
      {config.homeShowCategories !== false && (
        <section className="py-16 bg-[#FAF7F2] border-b border-theme-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left md:flex justify-between items-end mb-12">
              <div className="max-w-2xl">
                <h2 className="font-serif text-3xl font-black text-theme-text mb-2">대표 카테고리 정보</h2>
                <p className="text-theme-secondary text-xs sm:text-sm font-semibold">사주학의 복잡한 한자와 구성을 5가지 실용적인 구도로 구분하여 초보자 맞춤형 해설서로 정리해 두었습니다.</p>
              </div>
              <div className="h-[2px] flex-grow mx-8 bg-theme-border hidden lg:block mb-3"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => navigate('categories', cat.slug)}
                  className="group cursor-pointer bg-theme-bg p-6 rounded-sm border border-theme-border hover:border-theme-accent shadow-[3px_3px_0px_0px_rgba(229,225,216,1)] hover:shadow-[5px_5px_0px_0px_rgba(125,90,80,0.8)] transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-8 h-[3px] bg-theme-accent mb-4 group-hover:w-16 transition-all duration-300"></div>
                    <h3 className="font-serif font-black text-theme-text text-sm sm:text-[15px] group-hover:text-theme-accent mb-2.5 transition">
                      {cat.name}
                    </h3>
                    <p className="text-theme-secondary text-[11px] leading-relaxed font-medium line-clamp-4">
                      {cat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Layout 2-cols: [Left: Operator Column Spotlight] [Right: Featured Guides] */}
      {config.homeShowSpotlight !== false && (
        <section className="py-16 bg-theme-bg border-b border-theme-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left Box: Operator Columns Preview (2 columns wide on desktop) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-end border-b-2 border-theme-text pb-3">
                  <h2 className="font-serif text-xl sm:text-2xl font-black text-theme-text flex items-center gap-2">
                    <Flame size={20} className="text-theme-accent" />
                    대표자 함경선 사주 에세이
                  </h2>
                  <button
                    onClick={() => navigate('columns')}
                    className="text-xs text-theme-accent hover:text-theme-text font-bold flex items-center gap-1 cursor-pointer"
                  >
                    전체 칼럼 보기 <ArrowRight size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {columns.slice(0, 2).map((col) => (
                    <div
                      key={col.id}
                      onClick={() => navigate(`columns`, col.slug)}
                      className="cursor-pointer bg-[#FAF7F2] p-6 rounded-sm border border-theme-border hover:border-theme-accent transition-all flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] text-theme-accent border border-theme-border bg-theme-warm rounded-sm px-2 py-0.5 font-bold">
                          운영자 칼럼 에세이
                        </span>
                        <h3 className="font-serif font-black text-theme-text text-sm sm:text-md mt-4 mb-2 leading-snug line-clamp-2 hover:text-theme-accent transition">
                          {col.title}
                        </h3>
                        <p className="text-theme-secondary text-[11px] font-medium leading-relaxed line-clamp-3">
                          {col.summary}
                        </p>
                      </div>
                      <div className="mt-6 pt-3 border-t border-theme-border/60 flex items-center justify-between text-[10px] text-theme-secondary font-semibold">
                        <span>필자: {col.author}</span>
                        <span>{col.updateDate} 업데이트</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Operator Bio Mini Card */}
                {config.homeShowBioCard !== false && (
                  <div className="bg-[#FAF7F2] border-2 border-theme-text p-6 rounded-sm flex flex-col sm:flex-row gap-5 items-center">
                    <div className="h-14 w-14 rounded-sm border-2 border-theme-text bg-theme-accent flex items-center justify-center font-serif text-lg font-black text-white shrink-0 shadow-[2px_2px_0px_0px_rgba(45,41,38,1)]">
                      경선
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                        <span className="font-serif font-black text-theme-text text-sm">함경선 (사주공방 대표)</span>
                        <button
                          onClick={() => navigate('author')}
                          className="text-[10px] text-theme-accent bg-theme-warm border border-theme-border px-2 py-0.5 rounded-sm hover:bg-theme-accent hover:text-white transition-all font-bold cursor-pointer"
                        >
                          대표 프로필 및 학술원칙 보기
                        </button>
                      </div>
                      <p className="text-theme-secondary text-[11px] font-medium leading-relaxed">
                        "{config.ownerBio}"
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Box: App's Recommendation Guides */}
              <div className="space-y-6">
                <div className="border-b-2 border-theme-text pb-3">
                  <h2 className="font-serif text-xl sm:text-2xl font-black text-theme-text flex items-center gap-2">
                    <Sparkles size={20} className="text-theme-accent" />
                    사주공방 추천 글
                  </h2>
                </div>

                <div className="space-y-4">
                  {featuredPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => navigate(`posts`, post.slug)}
                      className="group cursor-pointer bg-[#FAF7F2] p-5 rounded-sm border border-theme-border hover:border-theme-accent transition"
                    >
                      <span className="text-[10px] text-theme-accent font-bold tracking-wider font-mono uppercase">
                        ★ 추천 가이드
                      </span>
                      <h3 className="font-serif font-black text-theme-text text-[13px] sm:text-sm mt-1.5 mb-1.5 group-hover:text-theme-accent transition leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-theme-secondary text-[11px] leading-normal line-clamp-2">
                        {post.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 5. Recent Content Database (Freshness emphasis) */}
      {config.homeShowRecentUpdates !== false && (
        <section className="py-16 bg-[#FAF7F2] border-b border-theme-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-theme-border pb-4 gap-4">
              <div>
                <h2 className="font-serif text-3xl font-black text-theme-text mb-1">최신 업데이트 정보</h2>
                <p className="text-theme-secondary text-xs font-semibold">최근 동향 및 독자 피드백을 수용하여 명확히 교정된 정밀 학술 자료들입니다.</p>
              </div>
              <button
                onClick={() => navigate('categories')}
                className="px-4 py-2 bg-theme-text hover:bg-theme-accent text-white text-xs font-bold rounded-sm tracking-wider uppercase transition cursor-pointer"
              >
                전체 정보 인덱스 보기
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentPosts.map((post) => {
                const catObj = categories.find(c => c.id === post.category);
                return (
                  <div
                    key={post.id}
                    onClick={() => navigate(`posts`, post.slug)}
                    className="cursor-pointer group flex flex-col justify-between bg-theme-bg hover:bg-theme-warm/20 p-5 rounded-sm border border-theme-border hover:border-theme-accent transition-all duration-200"
                  >
                    <div>
                      {catObj && (
                        <span className="text-[9px] text-theme-accent bg-theme-warm rounded-sm px-2 py-0.5 tracking-wide font-bold mb-3 block w-fit border border-theme-border">
                          {catObj.name.split(' ')[0]}
                        </span>
                      )}
                      <h3 className="font-serif font-black text-theme-text text-sm leading-snug group-hover:text-theme-accent transition mb-2">
                        {post.title}
                      </h3>
                      <p className="text-theme-secondary text-[11px] leading-normal line-clamp-3">
                        {post.summary}
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-theme-border/60 flex justify-between items-center text-[10px] text-theme-secondary font-semibold">
                      <span>작성: {post.author}</span>
                      <span>{post.updateDate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. Honest Content Standard & Guidelines Banner */}
      {config.homeShowWarningBanner !== false && (
        <section className="py-12 bg-[#FAF7F2]/80 border-b border-theme-border text-theme-text">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="flex justify-center mb-3">
              <AlertTriangle className="text-theme-accent" size={24} />
            </div>
            <h3 className="font-serif text-[17px] font-black text-theme-text mb-2">사주공방의 안전 및 학술 면책 철학</h3>
            <p className="text-xs text-theme-secondary leading-relaxed max-w-2xl mx-auto font-medium">
              명리학은 미래를 미리 알아서 부를 독차지하는 사기 수책이 아닙니다. 개인의 치우친 성격을 수리적으로 점검하여 과욕으로 인한 실패를 비켜가게 할 수신(修身) 학설입니다. 사주공방은 어떠한 부적, 고액 세척 굿, 무당의 신점 협박을 지양하며 오로지 독자 중심의 지적 정수를 고집합니다.
            </p>
          </div>
        </section>
      )}

      {/* 7. CTA: Consultation / Feedback Inquiry */}
      {config.homeShowCTA !== false && (
        <section className="bg-theme-text text-theme-warm py-16 text-center">
          <div className="max-w-xl mx-auto px-4">
            <h2 className="font-serif text-2xl font-black mb-3 text-white">설명되지 못한 나의 사주 흐름이 궁금하시다면?</h2>
            <p className="text-xs text-theme-warm-deep/80 leading-relaxed mb-8 max-w-md mx-auto">
              만세력을 바탕으로 글을 분석하였으나 여전히 막막한 기류를 겪고 계신다면, 사주공방 전속 전문 상담사(천명, 지애, 금명) 팀에 메일로 사연과 태어날 날짜를 전해주세요. 엄격한 이메일 회신 검토 가하지 않는 철저한 보안 원칙을 약속드립니다.
            </p>
            <button
              onClick={() => navigate('contact')}
              className="px-6 py-3.5 bg-theme-accent hover:bg-theme-accent/90 text-white text-xs font-bold tracking-wider uppercase rounded-sm transition cursor-pointer shadow-[3px_3px_0px_0px_rgba(242,237,228,0.2)]"
            >
              상담 메일 발송 안내 보기
            </button>
          </div>
        </section>
      )}

    </div>
  );
}
