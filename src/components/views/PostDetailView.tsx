import React from 'react';
import { getPosts, getCategories, getSiteConfig } from '../../data/db';
import { Post } from '../../types';
import { Home, Calendar, BookOpen, AlertTriangle, ListChecks, ArrowLeft } from 'lucide-react';
import { updateMetaTags, generateArticleSchema, generateFAQSchema, generateBreadcrumbSchema } from '../../utils/seo';

interface PostDetailViewProps {
  slug: string;
  navigate: (path: string, param?: string) => void;
}

export default function PostDetailView({ slug, navigate }: PostDetailViewProps) {
  const posts = getPosts();
  const categories = getCategories();
  const config = getSiteConfig();

  const post = posts.find(p => p.slug === slug);

  React.useEffect(() => {
    if (post) {
      // SEO & Structured data (JSON-LD)
      const canonicalUrl = `https://${config.siteUrl}/#/posts/${post.slug}`;
      const articleSchema = generateArticleSchema(post, `https://${config.siteUrl}`);
      const faqSchema = post.faqs && post.faqs.length > 0 ? generateFAQSchema(post.faqs) : null;
      
      updateMetaTags(
        post.title,
        post.summary,
        canonicalUrl,
        'article',
        {
          '@context': 'https://schema.org',
          '@graph': [
            articleSchema,
            faqSchema,
            generateBreadcrumbSchema([
              { name: '홈', url: `https://${config.siteUrl}/` },
              { name: '카테고리', url: `https://${config.siteUrl}/#/categories` },
              { name: post.title, url: canonicalUrl }
            ])
          ].filter(Boolean)
        }
      );
    }
  }, [post, config]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-theme-text bg-theme-bg select-none">
        <h2 className="text-2xl font-serif font-black text-theme-text mb-4">해당 글을 찾을 수 없습니다.</h2>
        <button
          onClick={() => navigate('categories')}
          className="px-4 py-2 bg-theme-accent text-white rounded-sm text-xs font-bold hover:bg-theme-text transition cursor-pointer"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const catObj = categories.find(c => c.id === post.category);

  // Dynamic generate Table of Contents based on ### titles
  const headings = post.content
    .split('\n')
    .filter(line => line.startsWith('### '))
    .map(line => line.replace('### ', '').trim());

  // Related posts finder
  const relatedPosts = posts
    .filter(p => p.slug !== post.slug && (p.category === post.category || post.relatedSlugs?.includes(p.slug)))
    .slice(0, 3);

  // Basic renderer for simple markdown paragraph headers
  const renderContent = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return <div key={index} className="h-4"></div>;
      
      if (trimmed.startsWith('### ')) {
        const title = trimmed.replace('### ', '');
        return (
          <h3 key={index} id={title} className="font-serif text-[15px] sm:text-base font-black text-theme-text mt-8 mb-3 border-l-4 border-theme-accent pl-3">
            {title}
          </h3>
        );
      }
      
      if (trimmed.startsWith('- ')) {
        return (
          <li key={index} className="text-[#3A3530] text-xs sm:text-sm leading-relaxed mb-1.5 list-disc ml-5 font-medium">
            {trimmed.replace('- ', '')}
          </li>
        );
      }

      return (
        <p key={index} className="text-theme-text text-xs sm:text-sm leading-relaxed mb-4 font-medium antialiased">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <article className="bg-theme-bg min-h-screen py-8 text-theme-text select-none pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation line */}
        <nav className="flex items-center gap-1.5 text-[11px] text-theme-secondary mb-6 font-sans font-semibold">
          <button onClick={() => navigate('home')} className="hover:text-theme-accent flex items-center gap-1 cursor-pointer">
            <Home size={11} /> 홈
          </button>
          <span>/</span>
          {catObj && (
            <button onClick={() => navigate('categories', catObj.slug)} className="hover:text-theme-accent cursor-pointer">
              {catObj.name.split(' (')[0]}
            </button>
          )}
          <span>/</span>
          <span className="text-theme-accent font-bold truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Back button */}
        <button
          onClick={() => navigate('categories')}
          className="inline-flex items-center gap-1 text-[11px] text-theme-secondary hover:text-theme-text font-bold transition mb-6 cursor-pointer"
        >
          <ArrowLeft size={14} /> 목록으로 돌아가기
        </button>

        {/* Article Card Frame */}
        <div className="bg-theme-bg rounded-sm border border-theme-border p-6 sm:p-10 mb-8 overflow-hidden">
          
          {/* Category Stamp */}
          {catObj && (
            <span className="text-[10px] text-theme-accent font-serif font-black tracking-widest bg-theme-warm border border-theme-border px-3 py-1 rounded-sm">
              {catObj.name}
            </span>
          )}

          {/* Title and Subtitle */}
          <h1 className="font-serif text-2.5xl sm:text-3.5xl lg:text-4xl font-black leading-[1.2] text-theme-text mt-5 mb-4 antialiased">
            {post.title}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-theme-secondary font-semibold leading-relaxed mb-6 border-b border-theme-border pb-6">
            {post.subtitle}
          </p>

          {/* Author info strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] text-theme-secondary pb-8 border-b border-dashed border-theme-border">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-sm border border-theme-text bg-theme-warm flex items-center justify-center font-serif text-[11px] font-black text-theme-text shadow-sm">
                {post.author[0]}
              </div>
              <div>
                <span className="text-theme-secondary/80 font-medium">글쓴이:</span>{' '}
                <button
                  onClick={() => navigate('author')}
                  className="font-bold text-theme-text hover:text-theme-accent transition cursor-pointer"
                >
                  {post.author === '함경선' ? config.ownerName : `${post.author} (사주공방 전문상담사)`}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] text-theme-secondary font-semibold">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {post.publishDate} 발행
              </span>
              <span>•</span>
              <span>{post.updateDate} 업데이트됨</span>
            </div>
          </div>

          {/* Dynamic Table of Contents (목차) */}
          {headings.length > 0 && (
            <div className="my-8 bg-[#FAF7F2] border border-theme-border p-5 rounded-sm">
              <h4 className="font-serif text-xs font-black text-theme-text mb-3 flex items-center gap-1.5">
                <BookOpen size={14} className="text-theme-accent" />
                이 글의 주요 목차
              </h4>
              <ul className="space-y-1.5">
                {headings.map((heading, i) => (
                  <li key={i} className="text-[11px] sm:text-xs">
                    <a
                      href={`#${heading}`}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(heading);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-theme-secondary hover:text-theme-accent transition hover:underline font-bold"
                    >
                      {i + 1}. {heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Core Content Body */}
          <div className="markdown-body my-8 leading-relaxed font-sans">
            {renderContent(post.content)}
          </div>

          {/* Highlight Key Summary Box (핵심 요약 박스) */}
          <div className="my-10 bg-theme-warm border border-theme-border p-6 rounded-sm">
            <h4 className="text-theme-accent font-serif text-xs sm:text-sm font-black mb-2 flex items-center gap-1.5">
              💡 꼭 기억할 사주공방 핵심 포인트
            </h4>
            <p className="text-theme-secondary text-xs leading-relaxed font-semibold">
              본 글에서 설명하는 원리는 사적인 환경, 만세력 배치에 따라 달라집니다. 가장 핵심은 부정적 요소를 만났을 때 회피하는 것이 아니라, 부족함을 나의 오행 습성에서 파악하고 적극적으로 힐링 행동을 실천하는 것입니다.
            </p>
          </div>

          {/* Common Mistakes (초보자가 자주 실수하는 포인트) */}
          {post.mistakes && post.mistakes.length > 0 && (
            <div className="my-10 bg-theme-warm border-l-4 border-l-theme-accent border border-theme-border p-6 rounded-sm">
              <h4 className="text-theme-text font-serif text-xs sm:text-sm font-black mb-3 flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-theme-accent" />
                초보자가 자칫 오해하거나 실수하는 부분
              </h4>
              <ul className="space-y-2">
                {post.mistakes.map((mis, i) => (
                  <li key={i} className="text-[#5A5045] text-xs flex items-start gap-2 leading-relaxed font-semibold">
                    <span className="text-theme-accent font-bold">✕</span>
                    {mis}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Checklist / Recap element */}
          {post.checklist && post.checklist.length > 0 && (
            <div className="my-10 bg-theme-warm border border-theme-border p-6 rounded-sm">
              <h4 className="text-theme-accent font-serif text-xs sm:text-sm font-black mb-3 flex items-center gap-1.5">
                <ListChecks size={15} className="text-theme-accent" />
                이것만큼은 챙기세요! 체크리스트
              </h4>
              <ul className="space-y-2">
                {post.checklist.map((item, i) => (
                  <li key={i} className="text-[#3A3530] text-xs flex items-start gap-2 leading-relaxed font-semibold">
                    <span className="text-theme-accent font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQ Sections */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="my-12 border-t border-theme-border pt-8">
              <h4 className="font-serif text-base font-black text-theme-text mb-5">자주 묻는 질문 (FAQ)</h4>
              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <div key={i} className="bg-[#FAF7F2] border border-theme-border rounded-sm p-5 shadow-xs">
                    <h5 className="font-serif text-xs sm:text-[13px] font-black text-theme-text mb-2 flex gap-1.5">
                      <span className="text-theme-accent">Q.</span> {faq.question}
                    </h5>
                    <p className="text-theme-secondary text-[11px] sm:text-xs leading-relaxed font-medium pl-4 border-l border-theme-accent/40">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post bottom editor credentials box */}
          <div className="mt-12 pt-8 border-t border-theme-border flex flex-col sm:flex-row gap-5 items-center">
            <div className="h-10 w-10 border border-theme-text rounded-sm bg-theme-warm font-serif flex items-center justify-center font-black text-theme-text text-xs shadow-[1.5px_1.5px_0px_0px_rgba(45,41,38,1)]">
              공방
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[11px] text-theme-secondary font-medium">
                본 정보는 고전 정통 명리학 해설 지침서입니다. 사주공방의 모든 자료는 임상 경험과 원문 분석에 기초하여{' '}
                <button
                  onClick={() => navigate('author')}
                  className="font-bold text-theme-accent hover:underline cursor-pointer"
                >
                  함경선
                </button>
                {' '}대표자 책임 하에 주기적으로 검토 및 보완 업데이트됩니다.
              </p>
            </div>
          </div>

        </div>

        {/* Natural Interconnected Links (관련글 리스트) */}
        {relatedPosts.length > 0 && (
          <div className="bg-[#FAF7F2] rounded-sm border border-theme-border p-6 sm:p-8 mt-6">
            <h4 className="font-serif text-sm font-black text-theme-text mb-4 pb-2 border-b border-theme-border">
              이어서 읽어볼 만한 관련 글
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rp) => (
                <div
                  key={rp.id}
                  onClick={() => {
                    navigate('posts', rp.slug);
                    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
                  }}
                  className="p-4 bg-theme-bg hover:bg-theme-warm/45 hover:border-theme-accent rounded-sm border border-theme-border cursor-pointer transition flex flex-col justify-between shadow-xs"
                >
                  <h5 className="font-serif font-black text-theme-text text-[11px] sm:text-xs line-clamp-2 leading-snug mb-1">
                    {rp.title}
                  </h5>
                  <p className="text-[10px] text-theme-secondary font-semibold truncate mt-2">
                    업데이트: {rp.updateDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}
