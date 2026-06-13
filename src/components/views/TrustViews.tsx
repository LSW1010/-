import React from 'react';
import { getSiteConfig, getPosts, getCategories, getColumns } from '../../data/db';
import { ShieldAlert, FileText, Home, Scale, Compass, LayoutGrid } from 'lucide-react';
import { updateMetaTags } from '../../utils/seo';

interface TrustProps {
  viewType: 'privacy' | 'terms' | 'disclaimer' | 'sitemap';
  navigate: (path: string, param?: string) => void;
}

export default function TrustViews({ viewType, navigate }: TrustProps) {
  const config = getSiteConfig();
  const posts = getPosts().filter(p => p.status === 'published');
  const categories = getCategories();
  const columns = getColumns().filter(p => p.status === 'published');

  React.useEffect(() => {
    const titles = {
      privacy: '개인정보처리방침',
      terms: '서비스 이용약관',
      disclaimer: '책임한계 및 면책고지',
      sitemap: '사이트맵 통합 인덱스'
    };
    updateMetaTags(
      titles[viewType],
      `사주공방의 ${titles[viewType]} 페이지입니다. 신뢰를 최우선으로 투명하고 정직하게 사이트를 운영합니다.`,
      `https://${config.siteUrl}/#/${viewType}`
    );
  }, [viewType, config]);

  const wrapContent = (title: string, icon: React.ReactNode, body: React.ReactNode) => (
    <div className="bg-theme-bg min-h-screen py-10 font-sans text-theme-text select-none pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] text-theme-secondary mb-6 font-semibold">
          <button onClick={() => navigate('home')} className="hover:text-theme-accent flex items-center gap-1 cursor-pointer">
            <Home size={12} /> 홈
          </button>
          <span>/</span>
          <span className="text-theme-accent font-bold">{title}</span>
        </nav>

        {/* Legal Paper Core Container */}
        <div className="bg-theme-bg border border-theme-border p-6 sm:p-10 rounded-sm">
          <div className="flex items-center gap-2.5 pb-5 border-b border-theme-border mb-8">
            <div className="p-2 bg-theme-warm border border-theme-border rounded-sm text-theme-text">
              {icon}
            </div>
            <h1 className="font-serif text-2.5xl font-black text-theme-text">{title}</h1>
          </div>

          <div className="leading-relaxed text-xs sm:text-xs text-theme-text font-semibold space-y-6 antialiased">
            {body}
          </div>
        </div>

      </div>
    </div>
  );

  if (viewType === 'privacy') {
    return wrapContent(
      '개인정보처리방침',
      <FileText size={20} className="text-theme-accent" />,
      <>
        <p className="text-theme-secondary font-semibold leading-relaxed">
          <strong>{config.companyName}</strong>(이하 '회사'라 함)는 이용자의 개인정보를 소중히 다루며, '개인정보 보호법' 등 관련 법령에 의거하여 아래와 같은 세심한 방침(이하 '방침')을 수립하여 운용합니다.
        </p>

        <section className="space-y-2">
          <h3 className="font-serif font-black text-theme-text text-sm">제 1조. 수집하는 개인정보 항목 및 이용 목적</h3>
          <p className="text-theme-secondary font-semibold">
            회사는 회원가입이 필요 없는 정적 정보 열람 사이트로서 일반 브라우징 단계에서 어떠한 사적인 개인 정보도 강제 보관하지 않습니다. 다만, 독자가 자발적으로 이메일 상담 폼(Contact 폼)을 통해 사연을 전달하는 경우에 한해서만 아래 값을 보관합니다.
          </p>
          <ul className="list-disc pl-5 mt-1 space-y-1 text-theme-secondary font-semibold">
            <li><strong>필수 항목:</strong> 이름(닉네임), 이메일 주소, 사연 본문</li>
            <li><strong>선택 항목:</strong> 생년월일, 태어난 시간, 음력/양력 세부 구분</li>
            <li><strong>이용 목적:</strong> 명리학 서면 고충 분석 및 메일 회신 안내</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-black text-theme-text text-sm">제 2조. 개인정보 소멸 및 보유 기간</h3>
          <p className="text-theme-secondary font-semibold">
            회사는 개인정보 수집 및 상담 답변이 온전히 수행 완료된 시점 이후 3개월간 기록에 대한 분쟁 예방 목적으로 임시 보관한 후, 복구 불가능한 디지털 파쇄 방식으로 즉각 소멸합니다. 별도 동의가 있는 사서가 아니면 상업 마케팅에 무단으로 믹싱하지 않습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-black text-theme-text text-sm">제 3조. 이용자의 권리 및 거부권</h3>
          <p className="text-theme-secondary font-semibold">
            이용자는 언제나 본인이 기안 발송한 사설 서신에 대해 기록 소청 열람 및 영구 무효 삭제 요청을 메일을 통해 촉구할 권리를 지닙니다. 회사는 사소한 불만이라도 수렴해 성실히 이행합니다.
          </p>
        </section>

        <section className="space-y-1 border-t border-theme-border pt-5 text-theme-secondary text-[11px] leading-relaxed font-semibold">
          <p>개인정보 보호 책임자: {config.privacyOfficer} (이메일: {config.contactEmail})</p>
          <p>공표 및 시행일자: 2026년 06월 05일</p>
        </section>
      </>
    );
  }

  if (viewType === 'terms') {
    return wrapContent(
      '서비스 이용약관',
      <Scale size={20} className="text-theme-accent" />,
      <>
        <p className="text-theme-secondary font-semibold">
          사주공방 서비스에 오신 것을 환영합니다. 본 약관은 샵프리가 제공하는 사주공방 학술 정보 플랫폼의 전반적인 이용 구조와 이용자의 약조 권한을 엄격 규율합니다. 단정하여 미신 굿을 계약하는 조항은 없습니다.
        </p>

        <section className="space-y-2">
          <h3 className="font-serif font-black text-theme-text text-sm">제 1조. 공통 해석의 원칙</h3>
          <p className="text-theme-secondary font-semibold">
            본 플랫폼의 유인 정보는 정통 동양 철학 명리학의 해석 이론을 바탕으로 편집 감수한 '소비 및 학문 참고 데이터'입니다. 독자의 자유로운 인생 판단을 돕기 위해 보편적인 인생 가이드 지표만을 개화 수치하므로, 어떠한 법적 분쟁이나 투자 리스크의 종국 서면 증거로 사용될 수 없습니다.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-black text-theme-text text-sm">제 2조. 게시 데이터의 지식재산권</h3>
          <p className="text-theme-secondary font-semibold">
            사주공방에 영구 게재된 글, 3편 이상의 수필 에세이, 15편 이상의 명리학 설명문은 대표 <strong>함경선</strong> 및 창작 임직원들의 지식 권익이 서려 있는 소중한 고유 독점 저작 자산입니다. 회사의 사전 승인 서류 없는 무단 전재, 크롤러를 이용한 대규모 DB 긁어가기, 광고 부착형 블로그로의 불법 카피 게시는 법적으로 제재당할 수 있음을 상기시킵니다.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-black text-theme-text text-sm">제 3조. 이용 제한의 요지</h3>
          <p className="text-theme-secondary font-semibold">
            타인의 생년월일이나 메일 주소를 사칭 도용하여 불법한 팝업 모의 실험을 유발하거나, 상담 폼에 차마 어색한 매크로 폭언 스팸을 적어 제출하는 경우 관리자는 영구 수신 거부 처분을 단행할 자격을 확보합니다.
          </p>
        </section>

        <p className="border-t border-theme-border pt-4 text-theme-secondary text-[11px] font-semibold">개정 고정 및 시행일: 2026년 06월 05일</p>
      </>
    );
  }

  if (viewType === 'disclaimer') {
    return wrapContent(
      '책임한계 및 면책고지',
      <ShieldAlert size={20} className="text-theme-accent" />,
      <>
        <p className="text-theme-secondary leading-relaxed italic font-semibold">
          "명리학 사주는 통계이자 성찰의 나침반이지, 인생 모든 실패의 핑계가 될 소송서 증서가 아닙니다."
        </p>

        <section className="space-y-2">
          <h3 className="font-serif font-black text-theme-text text-sm">1. 학문적 지표 및 예측 한계</h3>
          <p className="text-theme-secondary font-semibold">
            사주공방의 모든 콘텐츠는 우주의 계절 자연 주기론을 인간 삶의 행동 유형에 빗대어 설명하는 고도의 학술적 연구 산물입니다. 회사는 본 지면을 통해 다가올 혼인, 금전 도약, 질병의 시점을 귀기 있게 백퍼센트 예언 결정론으로 속칭 처방하지 않습니다. 일체의 데이터 and 분석 기안은 주관적 해석이 쏠려 있으므로 투자의 판단 기준으로 무리하게 삼아선 안 됩니다.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-black text-theme-text text-sm">2. YMYL 영역 조력 거부 고지</h3>
          <p className="text-theme-secondary font-semibold">
            의학 치료 방침(건강 상태 진단), 법률 소송 합의(재판 승소 여부), 주식 금융 대출 기표(금융 신용 등급), 전문 투자 배분과 같은 영혼이 갈리는 <strong>YMYL(Your Money or Your Life)</strong> 성격 고충에 대해서는 본 사이트의 상담사 팀은 어떠한 직접 결정 답변도 처방할 능력이 없으며 실제 사주로 풀어내는 장소도 불합합니다. 이러한 중대 사안은 반드시 공인 면허를 획득한 전문의, 변호사, 신용 전문가들과 면밀한 지식 진료 상담을 우선 성사하십시오.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-serif font-black text-theme-text text-sm">3. 외부 링크 연동 불화 면책</h3>
          <p className="text-theme-secondary font-semibold">
            본 플랫폼에 독자의 필요에 이해 가벼이 수놓은 외부 추천 사이트의 가치 판단, 해당 정보의 최신성에 관하여서는 사주공방은 어떠한 대리 책임 관계도 영위하지 않고 독립 면책됩니다.
          </p>
        </section>

        <p className="border-t border-theme-border pt-4 text-theme-secondary text-[11px] font-semibold">작성 최종 점검: 2026년 06월 05일 함경선 대리 공고</p>
      </>
    );
  }

  // HTML Sitemap (Search Engine Friendly, Beautifully Classified)
  const columnsData = getColumns();
  const postsData = getPosts();
  return wrapContent(
    '사이트맵 통합 인덱스',
    <LayoutGrid size={20} className="text-theme-accent" />,
    <>
      <p className="text-theme-secondary mb-6 font-semibold">
        사주공방 내에 존재하는 모든 정적 자료, 에세이 및 신뢰 페이지의 계통적 목록입니다. 모든 문서는 로봇이 올바로 색인할 수 있어 SEO 가치가 풍부합니다.
      </p>

      <div className="space-y-8">
        {/* Unit 1: Base Institutional Pages */}
        <section className="bg-[#FAF7F2] p-5 rounded-sm border border-theme-border">
          <h3 className="font-serif font-black text-theme-text text-xs sm:text-sm mb-3 flex items-center gap-1.5 border-b border-theme-border pb-2">
            <Compass size={14} className="text-theme-accent" /> 기본 신뢰 페이지 목록
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <button onClick={() => navigate('home')} className="text-left text-theme-accent hover:underline cursor-pointer">✓ 홈 화면 바로가기</button>
            <button onClick={() => navigate('about')} className="text-left text-theme-accent hover:underline cursor-pointer">✓ 사주공방 브랜드 소개</button>
            <button onClick={() => navigate('author')} className="text-left text-theme-accent hover:underline cursor-pointer">✓ 운영자 함경선 및 고문 소개</button>
            <button onClick={() => navigate('contact')} className="text-left text-theme-accent hover:underline cursor-pointer">✓ 상담 및 메일 문의 신청</button>
            <button onClick={() => navigate('privacy')} className="text-left text-theme-secondary hover:underline cursor-pointer">✓ 개인정보처리방침</button>
            <button onClick={() => navigate('terms')} className="text-left text-theme-secondary hover:underline cursor-pointer">✓ 서비스 이용약관</button>
            <button onClick={() => navigate('disclaimer')} className="text-left text-theme-secondary hover:underline cursor-pointer">✓ 책임 면책고지</button>
            <button onClick={() => navigate('admin')} className="text-left text-theme-accent font-black hover:underline cursor-pointer">✓ 워드프레스 CMS-lite 대시보드</button>
          </div>
        </section>

        {/* Unit 2: Editorial Columns essays */}
        <section className="bg-[#FAF7F2] p-5 rounded-sm border border-theme-border">
          <h3 className="font-serif font-black text-theme-text text-xs sm:text-sm mb-3 flex items-center gap-1.5 border-b border-theme-border pb-2">
            ✍ 함경선 대표 명리 수필 일독
          </h3>
          <div className="space-y-2">
            {columnsData.map(c => (
              <div key={c.id} className="flex justify-between items-center text-xs font-semibold">
                <button
                  onClick={() => navigate('columns', c.slug)}
                  className="text-left text-[#3A3530] hover:underline font-bold hover:text-theme-accent cursor-pointer"
                >
                  └ {c.title}
                </button>
                <span className="text-[10px] text-theme-secondary font-mono shrink-0 font-bold">{c.updateDate}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Unit 4: Academic Posts parsed by Category */}
        <section className="bg-[#FAF7F2] p-5 rounded-sm border border-theme-border">
          <h3 className="font-serif font-black text-theme-text text-xs sm:text-sm mb-3 flex items-center gap-1.5 border-b border-theme-border pb-2">
            📂 카테고리별 정밀 학술 자료 ({postsData.length}편)
          </h3>
          <div className="space-y-6">
            {categories.map(cat => {
              const catPosts = postsData.filter(p => p.category === cat.id);
              return (
                <div key={cat.id} className="space-y-2">
                  <button
                    onClick={() => navigate('categories', cat.slug)}
                    className="font-serif font-black text-theme-text text-xs hover:underline hover:text-theme-accent block cursor-pointer"
                  >
                    ◀ {cat.name} ({catPosts.length}편)
                  </button>
                  <ul className="space-y-1.5 pl-4 border-l border-theme-border">
                    {catPosts.map(p => (
                      <li key={p.id} className="flex justify-between items-center text-xs text-theme-secondary font-semibold leading-relaxed">
                        <button
                          onClick={() => navigate('posts', p.slug)}
                          className="hover:underline text-left hover:text-theme-text truncate max-w-sm sm:max-w-md cursor-pointer font-bold"
                        >
                          - {p.title}
                        </button>
                        <span className="text-[10px] text-theme-secondary font-mono shrink-0 font-bold">{p.updateDate}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
