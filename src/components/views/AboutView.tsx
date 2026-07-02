import React from 'react';
import { getSiteConfig } from '../../data/db';
import { Home, Landmark, Shield, User, Compass } from 'lucide-react';
import { updateMetaTags } from '../../utils/seo';

interface AboutProps {
  navigate: (path: string) => void;
}

export default function AboutView({ navigate }: AboutProps) {
  const config = getSiteConfig();

  React.useEffect(() => {
    updateMetaTags(
      '사주공방 소개 및 집필 신조',
      `정통 사주 정보 채널 사주공방의 운영 철학과 학술 자문단, 그리고 미신 없는 명리 분석론에 대한 장평의 소개 글입니다.`,
      `https://${config.siteUrl}/about`
    );
  }, [config]);

  return (
    <div className="bg-theme-bg min-h-screen py-10 font-sans text-theme-text select-none pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        {config.aboutShowBreadcrumb !== false && (
          <nav className="flex items-center gap-1.5 text-[11px] text-theme-secondary mb-6 font-semibold">
            <button onClick={() => navigate('home')} className="hover:text-theme-accent flex items-center gap-1 cursor-pointer">
              <Home size={12} /> 홈
            </button>
            <span>/</span>
            <span className="text-theme-accent font-bold">사주공방 브랜드 소개</span>
          </nav>
        )}
 
        {/* Content Box */}
        <div className="bg-theme-bg border border-theme-border p-6 sm:p-10 space-y-8 rounded-sm">
          
          {config.aboutShowIdentityHeader !== false && (
            <div className="text-center pb-6 border-b border-theme-border">
              <span className="inline-flex gap-1 items-center px-2.5 py-0.5 rounded-sm bg-theme-warm text-theme-accent border border-theme-border text-[10px] font-bold uppercase tracking-wider mb-3">
                <Compass size={12} /> Brand Identity
              </span>
              <h1 className="font-serif text-3xl font-black text-theme-text mb-2">
                {config.aboutTitle || '명리를 빌린 현대인의 수신서'}
              </h1>
              <p className="text-xs text-theme-secondary font-semibold italic">
                {config.aboutSubtitle || '"사주는 미래의 낙인이 아닌, 나만의 인생 날씨 지도입니다."'}
              </p>
            </div>
          )}
 
          {config.aboutShowSection1 !== false && (
            <section className="space-y-3">
              <h2 className="font-serif text-base sm:text-lg font-black text-theme-text flex items-center gap-2">
                <Landmark size={18} className="text-theme-accent mb-0.5" /> 1. 브랜드의 탄생 및 운영 이치
              </h2>
              <p className="text-theme-secondary text-xs sm:text-sm leading-relaxed font-semibold text-justify">
                사주공방은 <strong>{config.ownerName} 대표</strong>의 명리학 수집 연구의 깊은 열망에서 탄생하였습니다. 현대 한국 사회는 끝없는 속도 경쟁, 번아웃, 관계의 불화 속에서 지친 이들이 만세력 예측 사이트나 사교 어플에 기계식 질문을 던지게 만듭니다. 하지만 불행히도 오프라인 시장마저도 상업적인 무당의 액운 살풀이, 고액의 부적 매매, 혹은 공포를 과시하는 가십형 해석으로 얼룩져 있습니다.<br />
                저희는 이러한 독단적인 폐해를 타파하고, <strong>\'순수한 오행의 이치와 태도 개선을 통한 개운\'</strong>을 기치 삼아 미디어형 정적 정보 사이트를 공고히 수립하였습니다.
              </p>
            </section>
          )}
 
          {config.aboutShowSection2 !== false && (
            <section className="space-y-3">
              <h2 className="font-serif text-base sm:text-lg font-black text-theme-text flex items-center gap-2">
                <Shield size={18} className="text-theme-accent mb-0.5" /> 2. 비결과 미신을 나누는 칼날 기준
              </h2>
              <p className="text-theme-secondary text-xs sm:text-sm leading-relaxed font-semibold text-justify">
                "귀하에게 귀사살이 포진했으니 무조건 올해 집안 기둥이 뿌리째 뽑힌다"와 같은 미신식 저주를 혐오합니다. 정통 명리학은 천체와 지구간의 각도, 오행의 중화율을 해독하는 연산 수치에 가깝습니다. 사주공방의 모든 콘텐츠는 원전 문리 해석을 준수하며 가공 감수 과정을 거칩니다.
              </p>
              <div className="bg-[#FAF7F2] p-5 rounded-sm border border-theme-border text-theme-secondary font-semibold leading-relaxed text-[11px] sm:text-xs">
                <strong className="block text-[#2D2926] font-black mb-1">✓ 사주공방의 엄격 서술 규칙:</strong>
                - 독자가 스스로 생각을 끄집어낼 목차(TOC) 구성 필수<br />
                - 잘못 기표되기 쉬운 \'초보자 실수 포인트\'의 선제적 분절<br />
                - 한자를 모르는 아주 입문자도 부드러운 순환 일상 팁으로 수긍하게 할 인간적인 개운론
              </div>
            </section>
          )}
 
          {config.aboutShowSection3 !== false && (
            <section className="space-y-3">
              <h2 className="font-serif text-base sm:text-lg font-black text-theme-text flex items-center gap-2">
                <User size={18} className="text-theme-accent mb-0.5" /> 3. 함께하는 고문 자문단과의 만남
              </h2>
              <p className="text-theme-secondary text-xs sm:text-sm leading-relaxed font-semibold text-justify">
                저희 공방은 대표 한 명의 지혜가 아닌, 심도 있는 임상 노하우를 갖춘 공인 자문단과 공동 정주하고 있습니다. <strong>천명 대표 상담사</strong>의 날카로운 원국 정체 분석, <strong>지애 상담사</strong>의 따사로운 애정 일주 교제 지침, <strong>금명 상담사</strong>의 억척스러운 사업 자본 십성 포지셔닝 설계가 가미되어, 명확히 검증된 정론만을 매주 칼럼과 데이터로 업데이트합니다.
              </p>
            </section>
          )}

          <div className="pt-6 border-t border-theme-border flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
            <span className="text-theme-secondary font-semibold">"삶이 겨울이라면, 따스한 전구를 켜고 사색을 마스터하십시오." ─ 사주공방</span>
            <button
              onClick={() => navigate('author')}
              className="px-4 py-2 bg-theme-accent hover:bg-theme-text text-white rounded-sm text-xs font-bold shadow-xs transition tracking-wider uppercase cursor-pointer"
            >
              운영진 프로필 자세히 보기
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
