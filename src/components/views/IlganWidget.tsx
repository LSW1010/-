import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, HelpCircle, Sparkles, RefreshCw, Layers, Compass, Zap, BookOpen, AlertCircle } from 'lucide-react';
// @ts-ignore
import solarLunar from 'solarlunar';

interface IlganData {
  hanja: string;
  name: string;
  element: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  elementKorean: string;
  natureSymbol: string;
  oneLine: string;
  subtitle: string;
  keywords: string[];
  personality: string;
  strengths: string;
  remedy: string;
  clicheWarning: string;
}

const ILGAN_LIST: IlganData[] = [
  {
    hanja: '甲',
    name: '갑목(甲木)',
    element: 'wood',
    elementKorean: '목(木) - 양(陽)',
    natureSymbol: '하늘로 뻗은 낙락장송(큰 나무)',
    oneLine: '굽히지 않는 기개와 척박한 땅을 뚫고 솟아오르는 불굴의 시작력',
    subtitle: '당당한 품위와 끈기를 지닌 타고난 개척자',
    keywords: ['자립(Self-reliance)', '명예(Honor)', '진취성(Initiative)', '리더십'],
    personality: '갑목(甲木)의 성정은 겨우내 쌓인 단단한 동토(凍土)를 뚫고 오르는 새봄의 힘찬 기상입니다. 매사 첫 출발을 책임지려는 우두머리 기질이 있으며, 남에게 의탁하거나 구차하게 숙이는 것을 대단히 싫어하고 자존심이 철저합니다. 곧고 강인합니다.',
    strengths: '타의 추종을 불허하는 기획력과 결단력을 통해 아무도 가보지 않은 척박한 분야에서 든든한 나무처럼 자리를 잡는 능력이 훌륭합니다. 약자를 품으려는 다정한 정의감 또한 풍부합니다.',
    remedy: '강한 오기(傲氣)와 굽힐 줄 모르는 고집 때문에 한 번 꺾이면 다시 돌이킬 수 없을 만큼의 심적 동요를 겪기 쉽습니다. 물(水)의 온화한 유연함을 본받아 비판을 경청하고 침묵 속에서 학문을 수용하는 훈련이 필요합니다.',
    clicheWarning: '단순히 "부러지기 쉬우니 기죽어 살라"는 억지 부적 요법에 속지 마세요. 강인한 뿌리를 유지한 채, 잔가지의 유연성만 지혜롭게 가꾸면 가문을 살릴 대목(大木)이 됩니다.'
  },
  {
    hanja: '乙',
    name: '을목(乙木)',
    element: 'wood',
    elementKorean: '목(木) - 음(陰)',
    natureSymbol: '계절을 유연하게 수놓는 들꽃과 넝쿨식물',
    oneLine: '가장 모진 바람 속에서도 끝내 밟히지 않는 끈질긴 생명력의 소유자',
    subtitle: '환경에 스며들어 아름답게 꽃을 피우는 소통의 귀재',
    keywords: ['적응(Adaptation)', '화합(Harmony)', '끈기(Resilience)', '실속'],
    personality: '을목(乙木)은 거대한 넝쿨처럼 장애물을 만나면 정면 대결 대신 유연하게 휘감아 안는 총명한 타협력을 상징합니다. 겉보기에는 부드럽고 수동적으로 보이나, 내면은 어떤 잡초나 넝쿨보다 끈질긴 억척스러움을 숨기고 있는 외유내강형입니다.',
    strengths: '기후나 인간관계의 변화를 빠르게 알아채고 기지를 발휘하는 현실 감각과 탁월한 네트워크 형성력이 뛰어납니다. 실속을 잘 챙기며 주변 사람들과의 조화와 중재에 발군입니다.',
    remedy: '때때로 본인의 줏대가 부족해 타인의 말에 이리저리 휩쓸리거나 의존성의 늪에 빠져 질투심을 키우기 쉽습니다. 매듭을 맺고 끊는 금(金)의 결단력을 모방하여 관계의 명확한 독립 경계선을 선언할 줄 알아야 안식을 찾습니다.',
    clicheWarning: '을목을 아기 나약한 화초로 과소평가하는 숙명설은 잊으십시오. 대풍진(폭풍우) 속에서 아름답게 누워 태풍이 지난 후 가장 먼저 곧추서는 위대한 생장력입니다.'
  },
  {
    hanja: '丙',
    name: '병화(丙火)',
    element: 'fire',
    elementKorean: '화(火) - 양(陽)',
    natureSymbol: '온 세상을 밝고 골고루 비추는 한낮의 태양',
    oneLine: '일말의 편견 없이 세상을 정열적으로 데우는 무한한 정열의 빛',
    subtitle: '거짓 없이 투명하게 자아를 발산하는 시대의 주역',
    keywords: ['명랑(Radiance)', '공평(Justice)', '표현(Expression)', '솔직함'],
    personality: '병화(丙火)는 온천하에 한눈에 노출된 빛으로 숨김이 없이 명랑하고, 숨기려 해도 끝내 비밀을 간직하지 못하는 솔직담백함을 의미합니다. 약자나 강자나 똑같이 비추어 주는 밝은 기상이 마음을 사로잡으며 화끈한 활력으로 가득합니다.',
    strengths: '타인에게 뜨거운 열정과 카리스마 영감을 퍼트리는 표현력이 발군이며, 공평무사하게 대의를 쫓다 보니 기품 있는 교육, 기획 분야 등에서 주변인들의 전폭적 신뢰를 빠르게 사수합니다.',
    remedy: '성미가 너무 급해 생각보다 말이 먼저 나감으로써 사소한 구설이나 감정적 화풀이로 오해를 자초하기도 합니다. 밤의 고요를 머금은 물(水)의 차분한 저수지 기류를 마음에 주입하여, 야간에 스크린을 끄고 차담을 나누는 안정이 최고 개운책입니다.',
    clicheWarning: '운이 나쁘면 "불이 너무 뜨거워 가문이 망한다"는 거짓 협박에 가슴 졸이지 마세요. 깊이 있는 독서(인성)로 내면의 사색 온도만 차분히 튜닝하면 온 세상의 지휘자가 됩니다.'
  },
  {
    hanja: '丁',
    name: '정화(丁火)',
    element: 'fire',
    elementKorean: '화(火) - 음(陰)',
    natureSymbol: '어두운 등댓불, 어둠을 녹이는 화로와 품격 있는 촛불',
    oneLine: '묵묵히 스스로를 태워 세상의 소외된 구석을 따뜻하게 인도하는 온정',
    subtitle: '깊은 지성과 세심한 헌신을 숨겨놓은 수호자',
    keywords: ['헌신(Dedication)', '섬세(Sensitivity)', '지성(Intellect)', '예술성'],
    personality: '정화(丁火)는 겉으로는 차분하고 규격에 엄격한 고요를 연출하는 것 같으나, 내면은 누구보다 뜨거운 탐구심과 창의 수식을 지니고 있습니다. 세상을 밝히려 보이지 않는 정성을 쏟아붓는 만큼 정서적 섬세함이 아름답게 서려 있습니다.',
    strengths: '매사 정밀하게 파고 들어가는 수리적, 기예적 분석과 집중력이 강하고 타인의 고뇌를 가슴 깊이 공감합니다. 한번 집중하면 고도의 퀄리티 완성작을 도출하는 끈질긴 지성이 무기입니다.',
    remedy: '겉으로 감정을 발산하지 못하고 속으로 번민 시비를 간직해 혼자 상처를 곱씹다 보니 만성 심인성 피로에 들기 쉽습니다. 나 스스로를 갉아먹는 완벽 증후군을 비우고, 침실 가습과 미온수 반신욕을 통해 신체를 환기해주는 다정한 위로가 필요합니다.',
    clicheWarning: '정화가 나약해 쉬이 꺼진다는 단순 해석은 무지에서 비롯된 것입니다. 별빛이나 밤하늘 등대처럼, 가장 캄캄하고 척박한 무대에 올라섰을 때 유일하게 승리하는 강력한 수식입니다.'
  },
  {
    hanja: '戊',
    name: '무토(戊土)',
    element: 'earth',
    elementKorean: '토(土) - 양(陽)',
    natureSymbol: '만물을 품어 안는 드넓은 소명적 대산(산맥)',
    oneLine: '어떤 격변과 풍파가 불어도 흔들림 없이 한 자리를 버티는 거대한 신용',
    subtitle: '말을 삼키고 천하를 포용하는 묵묵한 중용의 정수',
    keywords: ['중용(Moderation)', '포용(Tolerance)', '부동(Stability)', '듬직함'],
    personality: '무토(戊土)는 듬직하고 과묵하여 남이 어떠한 하소연을 해도 모조리 품어 삼키는 비밀의 댐과도 같습니다. 중용의 미학을 가장 명징하게 고집하며, 경박한 행동을 단연 배격하며 무게감을 가집니다. 신의가 철저하고 남에게 이기적 예각을 세우지 않습니다.',
    strengths: '타협이 불가능해 보였던 거대 조직 갈등을 묵직한 설득을 통해 하나로 결합하는 중재력이 아주 튼실합니다. 한 번 둥지를 튼 곳에서는 십 년을 성실히 이겨내 부와 명예의 성을 늠름해 세웁니다.',
    remedy: '고집이 한 번 아집(我執)으로 결착되면 외부의 어떤 보정 충고나 환경 개정 노력도 완강히 무시한 채 생각이 주저앉게 됩니다. 나무(木)의 역동적 전진 기상인 "매주 낯선 산책로 걷기"와 "일상 규수 수필 일기"를 통해 생각을 주기적으로 자극해야 합니다.',
    clicheWarning: '무토가 메마른 흙이라 아무것도 피우지 못해 평생 고달프다는 점쟁이 겁박에는 비소로 화답하십시오. 대지 밑에 금과 바다를 묻어둔 웅장한 화수분으로, 준비가 끝나는 날 천하를 쥡니다.'
  },
  {
    hanja: '己',
    name: '기토(己土)',
    element: 'earth',
    elementKorean: '토(土) - 음(陰)',
    natureSymbol: '곡식을 가꾸어 키워내는 영양 가득한 수분 흙(텃밭)',
    oneLine: '생명 가치를 가장 정교히 배양하는 세상에서 가장 다정한 정원사',
    subtitle: '사소한 부분 하나까지 가꾸고 양육하는 세심한 실속파',
    keywords: ['배양(Nurture)', '섬세(Detail)', '포근(Warmth)', '현실감'],
    personality: '기토(己土)는 수분을 머금어 부드럽고, 씨앗을 품어 즉각 뿌리를 기르게 돕는 정원과 전원(田園)을 뜻합니다. 수동적이고 참을성 있는 성향 속에 누구보다 세심히 본인의 독립 영토를 계산해 가꾸는 영리함을 지니고 있습니다. 따사롭고 인덕이 고입니다.',
    strengths: '타인의 강점과 기량을 이성적으로 판별해 완벽한 후임 승율 및 인물 양성을 자율적으로 이끕니다. 주방 살림이나 기업 세무의 꼼꼼함 등 복잡한 행정 문서를 정리해 누수를 저지하는 힘이 독보적입니다.',
    remedy: '과거의 지나간 무례나 배신감을 쉽게 청소하지 못하고 의심의 칼날을 세우거나 냉소주의 고치에 홀로 갇히기 십상입니다. 거절 불능의 늪을 단단히 자르기 위해 매 분기 스마트폰 정산 청소와 서면 단절 규율을 실천해 방어해야 합니다.',
    clicheWarning: '진흙이라 줏대가 없다는 숙명 폄하는 완전히 틀렸습니다. 기토는 사막 한가운데서 유일하게 기적의 오아시스를 품어 과일을 거두어낼 정밀 과학 기단을 보장하는 저력입니다.'
  },
  {
    hanja: '庚',
    name: '경금(庚金)',
    element: 'metal',
    elementKorean: '금(金) - 양(陽)',
    natureSymbol: '차가운 기백을 품은 단단한 원석과 혁명의 검',
    oneLine: '사사로운 타협이란 없으며, 상생의 단호한 매듭으로 가치 전선을 지키는 의리',
    subtitle: '불의를 무찌르는 위엄 찬 혁명 기상의 리더',
    keywords: ['의리(Loyalty)', '결단(Decision)', '단호(Rigid)', '기백'],
    personality: '경금(庚金)의 기운은 가을의 문턱에서 낡은 이파리와 군더더기를 가차 없이 도려내는 서릿발 같은 숙살(肅殺)의 백색 무쇠입니다. 맺고 끊음이 은하철도처럼 굳세어, 소중한 동반 동맹에 배신을 가하는 자를 누구보다 단호히 공적 응징하는 의리파입니다.',
    strengths: '질질 흐르는 감상주의 덫에 거침없이 메스를 내리쳐 단시간 내에 혁신과 원가 절감을 시도하며, 압도적 부하 통솔력과 추진력으로 위기 수령 사업체를 대도약시킵니다.',
    remedy: '지나치게 명쾌한 시비를 가리다 정작 사랑하는 가족이나 동료에게 피할 길 없는 날카로운 독설 상처를 내고 결국 철저한 고독에 직면하기 쉽습니다. 불(火)의 지혜로운 절제 규율과 물(水)의 흘려보내는 온정을 가꾸어 다정함을 주입해야 합니다.',
    clicheWarning: '무서운 칼날이라 부부 이별수가 뻗쳤다는 옛날식 신살 겁박은 무시하세요. 기백이 당당한 칼끝인 만큼, 타인을 지키는 방어 방패로 삼고 언행을 순화하면 어디서나 존경받는 사령관입니다.'
  },
  {
    hanja: '辛',
    name: '신금(辛金)',
    element: 'metal',
    elementKorean: '금(金) - 음(陰)',
    natureSymbol: '빛나고 명징하게 닦인 연마된 다이아몬드, 날카로운 매스',
    oneLine: '티끌 하나의 불순물도 용납하지 않는 최고급 명품 자아의 품위와 완벽주의',
    subtitle: '가장 명결한 해법을 자로 잰 듯 도출하는 다정한 설계자',
    keywords: ['명징(Clarity)', '세련(Sophistication)', '예리(Acuteness)', '자부심'],
    personality: '신금(辛金)은 날카롭게 단련된 작은 칼이자, 흙 속에서 완벽히 수세(씻김)되어 독보적인 미려함을 자랑하는 맑은 에센셜 주얼리입니다. 자신의 단정 깔끔한 완벽 자존감이 생명이며, 다른 이에게 치부 비치는 것을 지독히 경계하고 자기 조율이 철저합니다.',
    strengths: '타자가 발견 못한 0.1%의 설계 오차나 회계 이탈을 예각 감각으로 포착하여 완수합니다. 지극히 트렌디하고 세련된 아이디어를 다듬어 가치 제안을 완성하는 천상 프리미엄 기획 적성입니다.',
    remedy: '남들이 무심히 지킨 사소한 실수에도 극정 가위를 꺼내 단숨에 서운 자학 시비를 쌓다 가정이 침체되기 일쑤입니다. 내 자아를 맑게 씻어줄 도량인 깨끗한 하천수(壬水)의 물소리 명상과 "이성적인 타인 양당 양해의 미학"을 매일 연습해주어 마음의 윤활유를 쳐야 합니다.',
    clicheWarning: '신금이 예민해 다루기 벅차다는 부정 일각은 기각하십시오. 가장 단단하며 가장 맑게 영롱히 존재하므로, 그 누구보다 타인에게 신세를 지지 않고 독립적 안락을 수립할 자수성가의 영광왕입니다.'
  },
  {
    hanja: '壬',
    name: '임수(壬水)',
    element: 'water',
    elementKorean: '수(Water) - 양(陽)',
    natureSymbol: '내면에 무한한 생명 비밀을 장전한 밤의 도도한 바다(큰 강)',
    oneLine: '모든 갈등 시비를 품고 종내 심연 가람의 거대 지혜로 승화하는 포용',
    subtitle: '통찰력과 지혜의 강물을 흘리며 세상을 적시는 대현(大賢)',
    keywords: ['통찰(Insight)', '자유(Freedom)', '유연(Adaptability)', '기획력'],
    personality: '임수(壬S)는 모든 지류를 받아들여 거대한 해수를 채우고, 아래로 묵묵히 침잠하여 평화로운 가치 영성을 숙달해 나가는 차디찬 지혜입니다. 상황 변화에 임기응변하며, 그 어떤 오행의 장벽도 부드럽게 돌아나갈 사색을 가졌습니다.',
    strengths: '어디로든 유연히 갈라져 안착하는 비즈니스 임기응변이 완벽하고 천리길을 멀리 내다보는 정밀 직군 설계에 압도적인 통찰이 서려 있습니다. 깊고 장엄한 아이디어 저수지를 장전해 둡니다.',
    remedy: '도도하고 찬물 기운이 과속하여 생각이 지나치게 무리에 덮여 무기력, 미룸, 우울의 늪에 홀로 가두는 게으른 쇠사슬 고집이 기승하기 쉽습니다. 이를 막아줄 든든한 흙(土)의 제어를 받아 현실 행정 계약서와 매일 아침의 땀 배출 러닝을 실천해 접지해야 번창합니다.',
    clicheWarning: '속을 모르니 음흉하다는 고전의 악마화 비판에 신경 쓰지 마세요. 음흉함이 아니라 천하를 포용하고자 만물을 고치느라 차분히 침묵을 훈련하는 자비 가득한 바다일 뿐입니다.'
  },
  {
    hanja: '癸',
    name: '계수(癸水)',
    element: 'water',
    elementKorean: '수(Water) - 음(陰)',
    natureSymbol: '만물을 촉촉하고 보드랍게 점진 적셔 살려내는 봄비(샘물)',
    oneLine: '지극히 투명한 영성의 샘물로 세상을 가벼이 윤택 이끌어내는 치율',
    subtitle: '정서적 공감대와 예민한 지성을 지닌 천혜의 수호천사',
    keywords: ['공감(Empathy)', '유연(Agility)', '지성(Wisdom)', '생동감'],
    personality: '계수(癸水)는 대지 위를 흐르는 맑은 시냇물이자 온 세상 새싹들의 갈증을 자비로이 해 갈해줄 따뜻한 시우(時雨)입니다. 타인의 사소한 표정이나 정서 주파수를 한눈에 감각하여 맞춰낼 만큼 지극히 사려 깊고 다재다능한 지혜가 서려 있습니다.',
    strengths: '감정이 고독한 사람들의 상처를 녹여 봉합하는 기적 같은 심리 수호력을 가지고 있으며, 예술적 감수성과 지적 연계 능력이 아주 세속 영리합니다. 다정한 대인 유대감이 일품입니다.',
    remedy: '주변 조그만 자극이나 악성 비평 여론에도 심장이 크게 두근거리며, 지나치게 불평 노이로제를 머금고 밤을 지우는 불면 고질이 서리기 쉽습니다. 나 중심의 굳센 뿌리 비겁인 기풍을 기르기 위해 소음 미디어를 사흘간 멀리하는 정인 쉼표 정각이 최고입니다.',
    clicheWarning: '계수가 흘러 흩어져 힘이 없다 속단하는 말을 배격하십시오. 바위를 뚫어 천 킬로미터를 흐르는 물샘 기운을 품었으니, 평정 지표만 수렴 준수하면 가장 찬란히 문가(文家)를 세울 천생 교육 창작가입니다.'
  }
];

interface IlganWidgetProps {
  navigate: (path: string, param?: string) => void;
}

export default function IlganWidget({ navigate }: IlganWidgetProps) {
  const [activeTab, setActiveTab] = useState<'birth' | 'direct'>('birth');

  // Birth fields
  const [birthYear, setBirthYear] = useState<string>('1995');
  const [birthMonth, setBirthMonth] = useState<string>('5');
  const [birthDay, setBirthDay] = useState<string>('15');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [isLeapMonth, setIsLeapMonth] = useState<boolean>(false);
  
  const [calculatedIndex, setCalculatedIndex] = useState<number | null>(null);
  const [calculatedDateStr, setCalculatedDateStr] = useState<string>('');

  // Select logic
  const [selectedIlganIndex, setSelectedIlganIndex] = useState<number | null>(null);

  // Quick years generator (1940 to 2030)
  const years = Array.from({ length: 91 }, (_, i) => String(1940 + i));
  const months = Array.from({ length: 12 }, (_, i) => String(1 + i));
  const days = Array.from({ length: 31 }, (_, i) => String(1 + i));

  // Date.UTC Julian-style exact calculation formula (Standard Daymaster Calculation)
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const y = parseInt(birthYear);
    const m = parseInt(birthMonth);
    const d = parseInt(birthDay);

    if (isNaN(y) || isNaN(m) || isNaN(d)) return;

    let targetSolarYear = y;
    let targetSolarMonth = m;
    let targetSolarDay = d;
    let dateStr = '';

    if (calendarType === 'lunar') {
      try {
        // @ts-ignore
        const res = solarLunar.lunar2solar(y, m, d, isLeapMonth);
        if (res && res.cYear && res.cYear !== -1) {
          targetSolarYear = res.cYear;
          targetSolarMonth = res.cMonth;
          targetSolarDay = res.cDay;
          dateStr = `음력 ${y}년 ${m}월 ${d}일${isLeapMonth ? '(윤달)' : ''} 생 → 양력 ${targetSolarYear}년 ${targetSolarMonth}월 ${targetSolarDay}일 변환`;
        } else {
          alert('존재하지 않는 음력 날짜입니다. 생년월일을 다시 확인해주세요.');
          return;
        }
      } catch (err) {
        alert('존재하지 않는 음력 날짜입니다. 생년월일을 다시 확인해주세요.');
        return;
      }
    } else {
      // Validate if the solar date is legitimate
      const tempDate = new Date(y, m - 1, d);
      if (tempDate.getFullYear() !== y || tempDate.getMonth() !== m - 1 || tempDate.getDate() !== d) {
        alert('입력하신 날짜가 유효하지 않습니다. 올바른 양력 생년월일을 선택해주세요.');
        return;
      }
      dateStr = `양력 ${y}년 ${m}월 ${d}일 생`;
    }

    // Julian cycle day difference from epoch (1900-01-01 is Gang-Sul Day, Ilgan '甲' = Index 0)
    const baseDate = Date.UTC(1900, 0, 1);
    const targetDate = Date.UTC(targetSolarYear, targetSolarMonth - 1, targetSolarDay);

    const diffMs = targetDate - baseDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let index = diffDays % 10;
    if (index < 0) {
      index += 10;
    }

    setCalculatedIndex(index);
    setSelectedIlganIndex(index);
    setCalculatedDateStr(dateStr);
  };

  const handleDirectSelect = (idx: number) => {
    setSelectedIlganIndex(idx);
    setCalculatedIndex(null); // Clear manual calculation display status or unify
    setCalculatedDateStr('');
  };

  const currentData = selectedIlganIndex !== null ? ILGAN_LIST[selectedIlganIndex] : null;

  // Elemental custom accent styles
  const getElementStyle = (elem: string) => {
    switch (elem) {
      case 'wood':
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          badgeBg: 'bg-emerald-600',
          text: 'text-emerald-800',
          iconColor: 'bg-emerald-500',
          glow: 'shadow-emerald-100/50'
        };
      case 'fire':
        return {
          bg: 'bg-rose-50 border-rose-200',
          badgeBg: 'bg-rose-600',
          text: 'text-rose-800',
          iconColor: 'bg-rose-500',
          glow: 'shadow-rose-100/50'
        };
      case 'earth':
        return {
          bg: 'bg-amber-50 border-yellow-200',
          badgeBg: 'bg-amber-600',
          text: 'text-amber-800',
          iconColor: 'bg-amber-500',
          glow: 'shadow-yellow-105/50'
        };
      case 'metal':
        return {
          bg: 'bg-zinc-50 border-zinc-200',
          badgeBg: 'bg-zinc-600',
          text: 'text-zinc-800',
          iconColor: 'bg-zinc-500',
          glow: 'shadow-zinc-100/50'
        };
      case 'water':
        return {
          bg: 'bg-sky-50 border-sky-200',
          badgeBg: 'bg-sky-600',
          text: 'text-sky-800',
          iconColor: 'bg-sky-500',
          glow: 'shadow-sky-100/50'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          badgeBg: 'bg-gray-600',
          text: 'text-gray-800',
          iconColor: 'bg-gray-500',
          glow: 'shadow-gray-100/50'
        };
    }
  };

  const activeElemStyle = currentData ? getElementStyle(currentData.element) : null;

  return (
    <section id="ilgan-widget" className="py-16 bg-[#FAF7F2] border-b border-theme-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-theme-warm border border-theme-border text-theme-accent text-[11px] font-bold tracking-wider uppercase mb-3.5 rounded-sm">
            <Compass size={12} className="animate-spin-slow text-theme-accent" />
            천체 사이클과 나의 생년월일시 해독
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-theme-text mb-3">
            나의 수신(修身) 코드: 일간(日干) 해독기
          </h2>
          <p className="text-xs sm:text-sm text-theme-secondary max-w-xl mx-auto font-medium leading-relaxed">
            명리학에서 일간(태어난 날의 천간)은 평생 나를 지배하는 핵심 정신 기질이자 우주적인 설계 코드입니다. 생일로 찾거나 본인의 일간을 직접 골라 지성적인 해설을 확인해보세요.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex border-b-2 border-theme-text mb-8">
          <button
            onClick={() => setActiveTab('birth')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold tracking-wider uppercase text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'birth'
                ? 'bg-theme-text text-[#FAF7F2] font-black border-t-2 border-x-2 border-theme-text'
                : 'bg-transparent text-theme-secondary hover:text-theme-text hover:bg-theme-warm/40'
            }`}
          >
            <Calendar size={14} />
            생년월일로 일간 구하기
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold tracking-wider uppercase text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'direct'
                ? 'bg-theme-text text-[#FAF7F2] font-black border-t-2 border-x-2 border-theme-text'
                : 'bg-transparent text-theme-secondary hover:text-theme-text hover:bg-theme-warm/40'
            }`}
          >
            <Layers size={14} />
            10천간 직접 선택하기
          </button>
        </div>

        {/* Tab Contents */}
        <div className="bg-theme-bg p-6 sm:p-8 border border-theme-border rounded-sm shadow-[4px_4px_0px_0px_rgba(45,41,38,0.15)] mb-10 transition-all duration-300">
          
          {/* TAB 1: Birth Solar Index Calculation */}
          {activeTab === 'birth' && (
            <div className="space-y-6">
              <form onSubmit={handleCalculate} className="space-y-5">
                <div className="bg-[#FAF7F2] p-4 border border-theme-border/60 rounded-sm mb-4">
                  <p className="text-[11px] text-theme-secondary font-semibold leading-relaxed flex items-center gap-2">
                    <Sparkles size={11} className="text-theme-accent shrink-0" />
                    <strong>100% 정밀 연월일 경과수식 산정 방식:</strong> 만세력 데이터를 바탕으로 음양력 및 윤달을 정밀 파악하고 생일에 해당하는 천간을 매칭하는 수리 알고리즘을 지원합니다.
                  </p>
                </div>

                {/* Solar / Lunar Calendar Type Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2] p-3.5 border border-theme-border/60 rounded-sm mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-theme-text font-serif">달력 기준 선택:</span>
                    <div className="inline-flex rounded-sm bg-theme-bg p-0.5 border border-theme-border">
                      <button
                        type="button"
                        onClick={() => setCalendarType('solar')}
                        className={`px-3 py-1 text-[11px] font-bold rounded-sm transition-all cursor-pointer ${
                          calendarType === 'solar'
                            ? 'bg-theme-text text-[#FAF7F2]'
                            : 'text-theme-secondary hover:text-theme-text'
                        }`}
                      >
                        양력 (Solar)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalendarType('lunar')}
                        className={`px-3 py-1 text-[11px] font-bold rounded-sm transition-all cursor-pointer ${
                          calendarType === 'lunar'
                            ? 'bg-theme-text text-[#FAF7F2]'
                            : 'text-theme-secondary hover:text-theme-text'
                        }`}
                      >
                        음력 (Lunar)
                      </button>
                    </div>
                  </div>

                  {calendarType === 'lunar' && (
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isLeapMonth}
                        onChange={(e) => setIsLeapMonth(e.target.checked)}
                        className="w-3.5 h-3.5 accent-theme-accent cursor-pointer rounded-sm"
                      />
                      <span className="text-[11px] font-bold text-theme-text font-serif">
                        윤달(임시 윤달) 선택
                      </span>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-theme-secondary font-bold tracking-wider uppercase">태어난 년도 {calendarType === 'solar' ? '(양력)' : '(음력)'}</label>
                    <select
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="px-3 py-2.5 bg-theme-bg border border-theme-border text-theme-text font-serif font-black text-sm rounded-sm focus:border-theme-accent focus:outline-none transition cursor-pointer"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}년</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-theme-secondary font-bold tracking-wider uppercase">태어난 월</label>
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      className="px-3 py-2.5 bg-theme-bg border border-theme-border text-theme-text font-serif font-black text-sm rounded-sm focus:border-theme-accent focus:outline-none transition cursor-pointer"
                    >
                      {months.map((m) => (
                        <option key={m} value={m}>{m}월</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-theme-secondary font-bold tracking-wider uppercase">태어난 일</label>
                    <select
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      className="px-3 py-2.5 bg-theme-bg border border-theme-border text-theme-text font-serif font-black text-sm rounded-sm focus:border-theme-accent focus:outline-none transition cursor-pointer"
                    >
                      {days.map((d) => (
                        <option key={d} value={d}>{d}일</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-theme-accent hover:bg-theme-text text-white font-sans text-xs font-bold tracking-widest uppercase rounded-sm cursor-pointer shadow-[3px_3px_0px_0px_rgba(45,41,38,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={14} className="animate-pulse" />
                    나의 우주 코드 해독하기
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Direct select stem buttons */}
          {activeTab === 'direct' && (
            <div>
              <p className="text-[11px] text-theme-secondary font-semibold mb-5 bg-[#FAF7F2] p-4 border border-theme-border/60 rounded-sm">
                본인의 일간(또는 궁금한 천간)을 직접 터치하여 지성인 분석 카드를 실시간으로 열어보실 수 있습니다.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                {ILGAN_LIST.map((ilg, idx) => (
                  <button
                    key={ilg.hanja}
                    type="button"
                    onClick={() => handleDirectSelect(idx)}
                    className={`p-4 rounded-sm border-2 text-center transition-all cursor-pointer flex flex-col justify-center items-center gap-1 ${
                      selectedIlganIndex === idx
                        ? 'border-theme-accent bg-theme-accent/5 shadow-[2px_2px_0px_0px_rgba(125,90,80,1)]'
                        : 'border-theme-border hover:border-theme-accent/50 bg-theme-warm/20 hover:bg-theme-warm/50'
                    }`}
                  >
                    <span className="font-serif font-black text-2xl text-theme-text leading-none">{ilg.hanja}</span>
                    <span className="text-[11px] font-bold text-theme-secondary">{ilg.name.split('(')[1].replace(')', '')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Dynamic Display card with animations */}
        <AnimatePresence mode="wait">
          {currentData && activeElemStyle && (
            <motion.div
              key={currentData.hanja}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`p-6 sm:p-10 border-2 border-theme-text rounded-sm ${activeElemStyle.bg} shadow-[6px_6px_0px_0px_rgba(45,41,38,1)] ${activeElemStyle.glow} transition-colors duration-300 relative overflow-hidden`}
            >
              {/* Elemental watermark accent */}
              <div className="absolute right-0 bottom-0 text-[180px] font-serif font-black text-theme-text/5 leading-none translate-x-[30px] translate-y-[60px] pointer-events-none select-none">
                {currentData.hanja}
              </div>

              {/* Tag header */}
              <div className="flex flex-wrap justify-between items-center gap-4 border-b border-theme-text/20 pb-4 mb-6 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center justify-center text-[22px] font-serif font-black text-white h-10 w-10 rounded-sm shadow-[2px_2px_0px_0px_rgba(45,41,38,1)] ${activeElemStyle.badgeBg}`}>
                    {currentData.hanja}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-black text-theme-text leading-tight flex items-center gap-1.5">
                      {currentData.name} 기질 코드
                    </h3>
                    {calculatedDateStr && (
                      <p className="text-[10px] text-theme-accent font-bold tracking-widest uppercase">
                        {calculatedDateStr} 추출 완료
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-theme-text/10 bg-theme-bg ${activeElemStyle.text}`}>
                    오행: {currentData.elementKorean}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-theme-text/10 bg-theme-bg text-theme-secondary">
                    상징: {currentData.natureSymbol.split('(')[0]}
                  </span>
                </div>
              </div>

              <div className="space-y-5 relative z-10">
                {/* One line summary statement */}
                <div>
                  <span className="text-[9px] text-theme-accent font-mono font-bold block mb-1">■ 우주적인 핵심 주파수</span>
                  <p className="font-serif text-base sm:text-lg font-black text-theme-text leading-snug">
                    "{currentData.oneLine}"
                  </p>
                  <p className="text-xs text-theme-secondary font-semibold mt-1">
                    {currentData.subtitle}
                  </p>
                </div>

                {/* Micro keyword pills */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {currentData.keywords.map((kw) => (
                    <span key={kw} className="text-[10px] font-bold bg-theme-bg/80 border border-theme-border px-2.5 py-1 rounded-sm text-theme-text flex items-center gap-1">
                      <Zap size={9} className="text-theme-accent" />
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Main Personality explanation split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-4">
                    <div className="bg-theme-bg/80 p-4 border border-theme-border/40 rounded-sm">
                      <h4 className="font-serif text-[13px] font-black text-theme-text mb-1.5 flex items-center gap-1.5">
                        <BookOpen size={13} className="text-theme-accent" />
                        기본 성정 해독
                      </h4>
                      <p className="text-[11px] text-theme-secondary font-medium leading-relaxed text-justify">
                        {currentData.personality}
                      </p>
                    </div>

                    <div className="bg-theme-bg/80 p-4 border border-theme-border/40 rounded-sm">
                      <h4 className="font-serif text-[13px] font-black text-theme-text mb-1.5 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-theme-accent" />
                        주요 강점 및 전선 가치
                      </h4>
                      <p className="text-[11px] text-theme-secondary font-medium leading-relaxed text-justify">
                        {currentData.strengths}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-theme-bg shadow-sm p-4 border-2 border-dashed border-theme-accent/30 rounded-sm">
                      <h4 className="font-serif text-[13px] font-black text-theme-accent mb-1.5 flex items-center gap-1.5">
                        <Compass size={13} className="text-theme-accent" />
                        정통 수신(修身) 개운 처방
                      </h4>
                      <p className="text-[11px] text-theme-secondary font-semibold leading-relaxed text-justify">
                        {currentData.remedy}
                      </p>
                    </div>

                    <div className="bg-theme-bg/80 p-4 border border-theme-border/40 rounded-sm">
                      <h4 className="font-serif text-[12px] font-black text-theme-text/70 mb-1 flex items-center gap-1.5">
                        <AlertCircle size={12} className="text-theme-accent/80" />
                        진짜 명리학을 향한 미학적 비판
                      </h4>
                      <p className="text-[10px] text-theme-secondary/80 font-medium leading-relaxed text-justify">
                        {currentData.clicheWarning}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interactive Action flow bottom */}
                <div className="pt-4 border-t border-theme-text/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-[10px] text-theme-secondary font-semibold">
                    이 기질에 정합된 자세한 개방 지침서는 <strong className="text-theme-accent">'{currentData.elementKorean.split(' ')[0]}'</strong> 카테고리 기안에서 무제한 구독 가능합니다.
                  </div>
                  <button
                    onClick={() => navigate('categories', currentData.element === 'wood' || currentData.element === 'fire' || currentData.element === 'earth' || currentData.element === 'metal' || currentData.element === 'water' ? 'yin-yang-five-elements' : 'categories')}
                    className="px-4 py-2 bg-theme-text hover:bg-theme-accent text-white text-[11px] font-bold rounded-sm tracking-wider uppercase transition cursor-pointer self-stretch sm:self-auto text-center"
                  >
                    연동 오행 에세이 탐색하기 &rarr;
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
