import React from 'react';
import { getColumns, getSiteConfig, isAdminLoggedIn } from '../../data/db';
import { Home, Calendar, Notebook, Feather, UserCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { updateMetaTags } from '../../utils/seo';

interface ColumnViewProps {
  slug?: string;
  navigate: (path: string, param?: string) => void;
}

export default function ColumnView({ slug, navigate }: ColumnViewProps) {
  const columns = getColumns().filter(c => c.status === 'published');
  const config = getSiteConfig();
  const loggedIn = isAdminLoggedIn();

  const column = slug ? columns.find(c => c.slug === slug) : null;

  React.useEffect(() => {
    if (column) {
      updateMetaTags(
        column.title,
        column.summary,
        `https://${config.siteUrl}/#/columns/${column.slug}`,
        'article'
      );
    } else {
      updateMetaTags(
        '사주공방 대표 칼럼 에세이',
        `${config.ownerName} 대표가 전하는 명리학 및 인생 성찰 에세이 전집입니다. 미신을 넘어 현대적인 해석의 깊이를 만나보세요.`,
        `https://${config.siteUrl}/#/columns`
      );
    }
  }, [column, config]);

  // Main list renderer
  if (!column) {
    return (
      <div className="bg-theme-bg min-h-screen py-10 font-sans text-theme-text select-none pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header section with Korean paper-like texture card */}
          <div className="bg-[#FAF7F2] text-theme-text rounded-sm p-8 mb-10 border border-theme-border relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#8C8279_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-10"></div>
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex gap-1.5 justify-center items-center px-2.5 py-1 text-[10px] uppercase font-bold text-theme-accent bg-theme-warm border border-theme-border rounded-sm mb-4">
                <Feather size={12} />
                함경선의 명리 수필 (命理 隨筆)
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-black mb-3 tracking-wide text-theme-text">운명은 정적인 감옥이 아닙니다</h1>
              <p className="text-theme-secondary text-xs sm:text-sm leading-relaxed font-semibold">
                사주공방의 대표자이자 연구가인 <strong>함경선</strong>이 명리학 상담 현장에서 직접 관측하고 성찰한 내용들을 수록한 특별 칼럼집입니다. 기계적인 풀이 너머로, 성격을 고정하고 바꿀 주체적 마인드 리폼을 이야기합니다.
              </p>
              
              {/* Dynamic Action Trigger path */}
              {loggedIn && (
                <div className="mt-6 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-[10px] text-theme-accent bg-theme-warm border border-theme-border px-3 py-1 rounded-sm font-bold">
                    <UserCheck size={12} />
                    관리자 세션 활성화
                  </span>
                  <button
                    onClick={() => navigate('admin', 'new-column')}
                    className="px-4 py-1.5 bg-theme-accent hover:bg-theme-text text-white text-xs font-bold rounded-sm shadow-xs transition tracking-wider uppercase cursor-pointer"
                  >
                    + 새 칼럼 에세이 쓰기
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {columns.map((col, index) => (
              <div
                key={col.id}
                onClick={() => navigate('columns', col.slug)}
                className="group cursor-pointer bg-theme-bg p-6 sm:p-8 rounded-sm border border-theme-border hover:border-theme-accent shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(125,90,80,0.8)] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {col.thumbnail && (
                    <div className="w-full h-44 sm:h-56 overflow-hidden rounded-xs border border-theme-border/60 mb-5">
                      <img 
                        src={col.thumbnail} 
                        alt={col.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-theme-secondary mb-3 font-mono font-semibold">
                    <span className="text-theme-accent font-black tracking-widest font-serif">제 {columns.length - index} 첩</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {col.updateDate} 업데이트
                    </span>
                  </div>
                  
                  <h2 className="font-serif font-black text-theme-text text-lg sm:text-xl leading-snug group-hover:text-theme-accent mb-3 transition">
                    {col.title}
                  </h2>
                  <p className="text-theme-secondary text-xs sm:text-sm font-medium leading-relaxed mb-4 line-clamp-3">
                    {col.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-theme-border/60 flex items-center justify-between text-[11px] text-theme-secondary font-semibold">
                  <span className="flex items-center gap-1 text-[#3A3530]">
                    <Feather size={12} className="text-theme-accent" /> 필자: {col.author} (사주공방 대표)
                  </span>
                  <span className="text-theme-accent font-bold inline-flex items-center gap-1 group-hover:translate-x-1 duration-200 transition">
                    에세이 전문 읽기 <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // Column Detail renderer (Strictly styled, mystical, and philosophical)
  return (
    <article className="bg-[#FAF7F2] min-h-screen py-12 font-sans text-theme-text select-none pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Navigation line */}
        <nav className="flex items-center gap-1.5 text-[11px] text-theme-secondary mb-8 font-semibold">
          <button onClick={() => navigate('home')} className="hover:text-theme-accent flex items-center gap-1 cursor-pointer">
            <Home size={11} /> 홈
          </button>
          <span>/</span>
          <button onClick={() => navigate('columns')} className="hover:text-theme-accent cursor-pointer">대표 칼럼</button>
          <span>/</span>
          <span className="text-theme-accent font-bold truncate max-w-xs">{column.title}</span>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate('columns')}
          className="inline-flex items-center gap-1 text-[11px] text-theme-secondary hover:text-theme-text font-bold transition mb-8 cursor-pointer"
        >
          <ArrowLeft size={14} /> 칼럼 목록으로
        </button>

        {/* Literary Essay Styled block */}
        <div className="bg-theme-bg border border-theme-border rounded-sm p-6 sm:p-12">
          
          {/* Header block */}
          <div className="text-center pb-8 border-b-2 border-theme-border">
            <span className="inline-flex items-center gap-1 text-[10px] font-serif font-bold text-theme-accent bg-theme-warm px-3 py-1 rounded-sm border border-theme-border uppercase tracking-widest mb-4">
              <Feather size={12} /> 함경선의 마음 기후 에세이
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-theme-text leading-snug mt-2 mb-3">
              {column.title}
            </h1>
            <p className="text-xs text-theme-secondary leading-relaxed font-semibold italic max-w-2xl mx-auto">
              "{column.subtitle}"
            </p>

            <div className="mt-6 flex items-center justify-center gap-3 text-theme-secondary text-[10px] font-mono font-semibold">
              <span>필자: {column.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {column.updateDate} 업데이트
              </span>
            </div>
          </div>

          {/* Column Cover Image if attached */}
          {column.thumbnail && (
            <div className="my-8 rounded-sm overflow-hidden border border-theme-border shadow-xs max-h-[420px] w-full flex justify-center bg-theme-warm/20">
              <img 
                src={column.thumbnail} 
                alt={column.title} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Special Column Editorial Notes */}
          {column.notes && (
            <div className="my-8 bg-[#FAF7F2] border border-theme-border p-5 rounded-sm text-xs leading-relaxed text-[#5A5045] font-semibold italic">
              <span className="font-black flex items-center gap-1 mb-1 font-serif text-xs not-italic text-theme-text uppercase tracking-wider">
                <Notebook size={14} /> 필자의 집필 메모:
              </span>
              "{column.notes}"
            </div>
          )}

          {/* Column Contents Body */}
          <div className="markdown-body my-8 leading-relaxed font-serif text-theme-text">
            {column.content.split('\n').map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return <div key={index} className="h-4"></div>;

              if (trimmed.startsWith('### ')) {
                const title = trimmed.replace('### ', '');
                return (
                  <h3 key={index} className="font-serif text-[14px] sm:text-base font-black text-theme-text mt-10 mb-4 text-center">
                    ─ {title} ─
                  </h3>
                );
              }

              return (
                <p key={index} className="text-[#2D2926] text-xs sm:text-sm leading-relaxed mb-4 font-medium text-justify antialiased">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Checklist Recap if exists */}
          {column.checklist && column.checklist.length > 0 && (
            <div className="mt-10 pt-8 border-t border-dashed border-theme-border">
              <h4 className="font-serif text-xs sm:text-sm font-black text-theme-text mb-3">대표와 함께 새기는 다짐 체크리스트:</h4>
              <ul className="space-y-2">
                {column.checklist.map((item, i) => (
                  <li key={i} className="text-[#3A3530] text-xs flex items-start gap-1.5 font-semibold">
                    <span className="text-theme-accent font-bold">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dynamic redirection path back to creator profile */}
          <div className="mt-12 pt-8 border-t border-theme-border flex flex-col sm:flex-row gap-5 items-center bg-[#FAF7F2] p-5 rounded-sm">
            <div className="h-10 w-10 border border-theme-text rounded-sm bg-theme-warm font-serif flex items-center justify-center font-black text-theme-text text-sm shadow-[1.5px_1.5px_0px_0px_rgba(45,41,38,1)]">
              경선
            </div>
            <div>
              <p className="text-[11px] text-theme-secondary font-semibold leading-normal">
                글쓴이 <strong className="text-theme-text">함경선</strong>은 사주공방의 창립 대표이자 명리학 전문 연구 기안자입니다. 지성적인 방식으로 미신 속에서 삶의 지도를 기획하는 조력을 나누고 있습니다.{' '}
                <button
                  onClick={() => navigate('author')}
                  className="font-bold text-theme-accent hover:underline cursor-pointer"
                >
                  프로필 및 자문 원칙 더 읽기
                </button>
              </p>
            </div>
          </div>

        </div>

      </div>
    </article>
  );
}
