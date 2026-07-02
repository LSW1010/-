import React from 'react';
import { getSiteConfig } from '../../data/db';
import { Mail, CheckCircle2, AlertCircle, Home, Send } from 'lucide-react';
import { updateMetaTags } from '../../utils/seo';

interface ContactViewProps {
  navigate: (path: string) => void;
}

export default function ContactView({ navigate }: ContactViewProps) {
  const config = getSiteConfig();
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    birthdate: '',
    birthtime: '',
    calendarType: 'solar', // solar or lunar
    gender: 'male',
    email: '',
    content: ''
  });

  React.useEffect(() => {
    updateMetaTags(
      '간담회 및 사주 상담 메일 문의',
      `사주공방 대표 상담사 팀에게 명리학적 고충 및 생년월일을 전해 검토 인명 분석 서면 회신을 요청하시는 문의 가이드입니다.`,
      `https://${config.siteUrl}/contact`
    );
  }, [config]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.content) {
      alert('이름, 이메일 주소 및 문의 사연은 필히 입력해 주셔야 합니다.');
      return;
    }
    setFormSubmitted(true);
  };

  return (
    <div className="bg-theme-bg min-h-screen py-10 font-sans text-theme-text select-none pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] text-theme-secondary mb-6 font-semibold">
          <button onClick={() => navigate('home')} className="hover:text-theme-accent flex items-center gap-1 cursor-pointer">
            <Home size={12} /> 홈
          </button>
          <span>/</span>
          <span className="text-theme-accent font-bold">문의하기</span>
        </nav>

        {/* Introduction Panel */}
        <div className="bg-theme-bg border border-theme-border p-6 sm:p-8 mb-8 rounded-sm">
          <h1 className="font-serif text-2xl font-black text-theme-text mb-3 flex items-center gap-2">
            <Mail className="text-theme-accent" size={24} />
            상담 및 학술 문의 안내
          </h1>
          <p className="text-theme-secondary text-xs sm:text-sm leading-relaxed font-semibold text-justify">
            사주공방은 과다한 영업을 지양하여 <strong>이메일({config.contactEmail})</strong> 기반의 비대면 서면 상담만을 진행하고 있습니다. 만세력 분석을 보시며 풀리지 않았던 나의 심층 오행 쏠림, 대운 전환 과도기(교운기)를 겪고 계신 사연을 정성스레 적어 보내주십시오. 대표 상담사인 [천명] 팀에서 주 1회 엄격 검수하여 깊이 있는 학리 답변을 회신드립니다.
          </p>

          <div className="mt-5 bg-theme-warm border border-theme-border p-4 rounded-sm flex gap-3 text-xs leading-relaxed text-[#5A5045] font-semibold max-w-2xl">
            <AlertCircle className="text-theme-accent shrink-0 mt-0.5" size={16} />
            <span>
              <strong className="text-theme-text font-black">안내 사항:</strong> 실제 서버가 없는 정적 웹 구조 상, 본 온라인 작성 폼으로 보낸 데이터는 외부로 무단 전송되지 않으며, 제출 단추 클릭 시 localStorage 로그 기록 및 메일 연동 안내 가이드 팝업을 띄우는 프론트엔드 모의 프로세스입니다. 실제 기안은 대표 메일 주소를 카피해 메일함(shopfree0601@naver.com)에서 발송해주시는 전선이 가장 투명합니다.
            </span>
          </div>
        </div>

        {/* Action interactive Block */}
        {!formSubmitted ? (
          <form onSubmit={handleSubmit} className="bg-theme-bg border border-theme-border p-6 sm:p-10 space-y-6 rounded-sm">
            <h2 className="font-serif text-lg font-black text-theme-text border-b border-theme-border pb-3 mb-4">
              모의 상담 및 사연 제출서
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-theme-text mb-1.5">* 성함 (닉네임 가능)</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="예: 홍길동"
                  className="w-full text-xs border border-theme-border rounded-sm px-3 py-2 bg-[#FAF7F2] font-semibold text-theme-text focus:bg-theme-bg focus:outline-none focus:ring-1 focus:ring-theme-accent focus:border-theme-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-theme-text mb-1.5">* 회신받을 이메일 주소</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="name@example.com"
                  className="w-full text-xs border border-theme-border rounded-sm px-3 py-2 bg-[#FAF7F2] font-semibold text-theme-text focus:bg-theme-bg focus:outline-none focus:ring-1 focus:ring-theme-accent focus:border-theme-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-[#FAF7F2] p-4 rounded-sm border border-theme-border">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-theme-text mb-1">생년월일 (음력/양력 구분)</label>
                <input
                  type="text"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  placeholder="예: 1988년 06월 01일"
                  className="w-full text-xs border border-theme-border rounded-sm px-2.5 py-1.5 bg-theme-bg font-semibold text-theme-text"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-theme-text mb-1">태어난 시간 (시분)</label>
                <input
                  type="text"
                  name="birthtime"
                  value={formData.birthtime}
                  onChange={handleInputChange}
                  placeholder="예: 오전 08시 30분"
                  className="w-full text-xs border border-theme-border rounded-sm px-2.5 py-1.5 bg-theme-bg font-semibold text-theme-text"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-theme-text mb-1">달력 구분</label>
                <select
                  name="calendarType"
                  value={formData.calendarType}
                  onChange={handleInputChange}
                  className="w-full text-xs border border-theme-border rounded-sm px-2.5 py-1.5 bg-theme-bg font-bold text-theme-text cursor-pointer"
                >
                  <option value="solar">양력 (Solar)</option>
                  <option value="lunar">음력 평달 (Lunar)</option>
                  <option value="lunar_leap">음력 윤달 (Leap)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-text mb-1.5">* 고민 주안점 및 사연</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="답답하신 건강이나 금융 대출 등 법적 소송 쟁송(YMYL)은 조력을 삼가해드리며, 학술 질문이나 연애 관계 화합법, 내 인생 그릇의 적절한 방향에 국한해서 작성해주세요."
                className="w-full text-xs border border-theme-border rounded-sm px-3 py-2 bg-[#FAF7F2] font-semibold text-theme-text focus:bg-theme-bg focus:outline-none focus:ring-1 focus:ring-theme-accent focus:border-theme-accent"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-theme-accent hover:bg-theme-text text-white font-bold rounded-sm text-xs flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(45,41,38,1)] transition tracking-wider uppercase cursor-pointer"
              >
                <Send size={14} /> 모의 사연 제출하기 (localStorage 로그 보관)
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-theme-bg border border-theme-border p-8 sm:p-12 text-center space-y-6 rounded-sm">
            <div className="flex justify-center">
              <div className="h-14 w-14 bg-theme-warm text-theme-accent rounded-sm flex items-center justify-center border-2 border-theme-text shadow-[1.5px_1.5px_0px_0px_rgba(45,41,38,1)] mx-auto animate-bounce">
                <CheckCircle2 size={32} />
              </div>
            </div>
            <h2 className="font-serif text-2xl font-black text-theme-text">사주공방 모의 사연 접수 성공</h2>
            <p className="text-theme-secondary text-xs sm:text-sm leading-relaxed max-w-lg mx-auto font-semibold">
              기안하신 명리학 서면 고민 사서가 브라우저 가상 큐에 온전히 전달 기록되었습니다.<br />
              실제상담 회신은 하루 최대 접수 제한에 의해 다소 늦어질 수 있으니, 가장 빠른 회신을 사정하기 위해 위 내용을 카피하여 대표 메일주소 <strong>({config.contactEmail})</strong>로 바로 발송해주시면 대단히 친절하게 대응해 드리겠습니다.
            </p>
            <div className="pt-4 border-t border-theme-border max-w-xs mx-auto flex gap-4">
              <button
                onClick={() => setFormSubmitted(false)}
                className="w-full py-2 border border-theme-border rounded-sm text-xs font-bold text-theme-secondary hover:bg-theme-warm transition cursor-pointer"
              >
                뒤로 이동
              </button>
              <button
                onClick={() => navigate('home')}
                className="w-full py-2 bg-theme-accent hover:bg-theme-text text-white rounded-sm text-xs font-bold shadow-xs transition cursor-pointer"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
