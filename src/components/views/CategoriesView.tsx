import React from 'react';
import { getCategories, getPosts } from '../../data/db';
import { Filter, Calendar, CornerDownRight, Home } from 'lucide-react';

interface CategoriesViewProps {
  initialCategoryId?: string;
  navigate: (path: string, param?: string) => void;
}

export default function CategoriesView({ initialCategoryId, navigate }: CategoriesViewProps) {
  const [selectedCatId, setSelectedCatId] = React.useState<string>(initialCategoryId || 'all');
  const categories = getCategories();
  const posts = getPosts().filter(p => p.status === 'published');

  React.useEffect(() => {
    if (initialCategoryId) {
      setSelectedCatId(initialCategoryId);
    }
  }, [initialCategoryId]);

  const handleCatSelect = (id: string) => {
    setSelectedCatId(id);
  };

  const filteredPosts = selectedCatId === 'all'
    ? posts
    : posts.filter(p => p.category === selectedCatId);

  const activeCategory = categories.find(c => c.id === selectedCatId);

  // Sorting: newest post at start
  const sortedPosts = [...filteredPosts].sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime());

  return (
    <div className="bg-theme-bg min-h-screen py-10 text-theme-text select-none pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-[11px] text-theme-secondary mb-6 font-sans font-semibold">
          <button onClick={() => navigate('home')} className="hover:text-theme-accent flex items-center gap-1 cursor-pointer">
            <Home size={11} /> 홈
          </button>
          <span>/</span>
          <button onClick={() => handleCatSelect('all')} className="hover:text-theme-accent cursor-pointer">명리학 카테고리</button>
          {activeCategory && (
            <>
              <span>/</span>
              <span className="text-theme-accent font-bold">{activeCategory.name}</span>
            </>
          )}
        </nav>

        {/* Page title and purpose header */}
        <div className="bg-[#FAF7F2] p-8 border border-theme-border border-l-4 border-l-theme-accent mb-8 rounded-sm">
          <h1 className="font-serif text-2xl sm:text-4xl font-black text-theme-text mb-3">사주공방 정통 명리학 해설서</h1>
          <p className="text-theme-secondary text-xs sm:text-sm font-medium leading-relaxed max-w-3xl">
            미신 없는 이성 학술 가이드. 사주 만세력 기법의 근간이 되는 원리학부터 사회적인 십성 관계, 인생 대운 타이밍, 그리고 상대방과의 원활한 조화(궁합)까지 원하는 카테고리를 눌러 전문 자료를 확인해 보십시오.
          </p>
        </div>

        {/* Category Filters Grid/Bar */}
        <div className="flex flex-wrap gap-2 mb-8 bg-theme-warm/40 p-2.5 rounded-sm border border-theme-border">
          <button
            onClick={() => handleCatSelect('all')}
            className={`px-4 py-2 text-xs font-sans font-bold rounded-sm border transition cursor-pointer ${
              selectedCatId === 'all'
                ? 'bg-theme-accent border-theme-accent text-white'
                : 'bg-theme-bg border-theme-border text-theme-secondary hover:text-theme-text hover:bg-theme-warm'
            }`}
          >
            전체 글 보기 ({posts.length})
          </button>

          {categories.map((cat) => {
            const count = posts.filter(p => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleCatSelect(cat.id)}
                className={`px-4 py-2 text-xs font-sans font-bold rounded-sm border transition cursor-pointer ${
                  selectedCatId === cat.id
                    ? 'bg-theme-accent border-theme-accent text-white'
                    : 'bg-theme-bg border-theme-border text-theme-secondary hover:text-theme-text hover:bg-theme-warm'
                }`}
              >
                {cat.name.split(' (')[0]} ({count})
              </button>
            );
          })}
        </div>

        {/* Selected Category Header (Context for Search Engines) */}
        {activeCategory ? (
          <div className="bg-theme-warm border border-theme-border p-6 rounded-sm mb-8">
            <h2 className="font-serif text-lg font-black text-theme-text mb-2 flex items-center gap-1.5">
              <CornerDownRight size={14} className="text-theme-accent" />
              {activeCategory.name}
            </h2>
            <p className="text-xs text-theme-secondary leading-relaxed font-semibold">{activeCategory.description}</p>
          </div>
        ) : (
          <div className="bg-theme-warm border border-theme-border p-6 rounded-sm mb-8">
            <h2 className="font-serif text-lg font-black text-theme-text mb-2 flex items-center gap-1.5">
              <Filter size={14} className="text-theme-accent" />
              전체 학술 정보 글
            </h2>
            <p className="text-xs text-theme-secondary leading-relaxed font-semibold">
              사주공방에서 제공하는 모든 정밀 명칭 해설 및 현대적 사주학 입문 논고 리스트입니다.
            </p>
          </div>
        )}

        {/* Posts Grid List */}
        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post) => {
              const catInfo = categories.find(c => c.id === post.category);
              return (
                <div
                  key={post.id}
                  onClick={() => navigate(`posts`, post.slug)}
                  className="bg-theme-bg p-6 rounded-sm border border-theme-border hover:border-theme-accent shadow-[2px_2px_0px_0px_rgba(229,225,216,1)] hover:shadow-[4px_4px_0px_0px_rgba(125,90,80,0.8)] transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Category Label */}
                    <div className="flex items-center justify-between gap-2.5">
                      {catInfo && (
                        <span className="text-[10px] bg-theme-warm text-theme-accent border border-theme-border px-2 py-0.5 rounded-sm font-bold">
                          {catInfo.name.split(' (')[0]}
                        </span>
                      )}
                      {post.isFeatured && (
                        <span className="text-[10px] text-white bg-theme-accent px-2 py-0.5 rounded-sm font-bold">
                          ★ 추천글
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-black text-theme-text text-sm sm:text-[15px] mt-4 mb-2 leading-snug hover:text-theme-accent transition">
                      {post.title}
                    </h3>
                    
                    <p className="text-theme-secondary text-xs leading-relaxed mb-4 line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-theme-border/60 flex items-center justify-between text-[10px] text-theme-secondary font-semibold">
                    <span>
                      필자: {post.author}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar size={12} /> {post.updateDate} 개정
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#FAF7F2] border border-theme-border rounded-sm p-12 text-center text-theme-secondary font-medium">
            등록된 발행 콘텐츠가 없습니다. 관리자 모드에서 새로운 글을 게시해보세요.
          </div>
        )}

      </div>
    </div>
  );
}
