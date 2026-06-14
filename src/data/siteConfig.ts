import { SiteConfig } from '../types';

export const initialSiteConfig: SiteConfig = {
  siteName: '사주공방',
  tagline: '명리학으로 삶의 길을 비추다, 정통 사주 상담 및 분석 전문 정보',
  topic: '명리학 기반 사주 상담 및 정통 학술 정보 제공',
  ownerName: '함경선',
  ownerBio: '명리학 연구가이자 사주공방의 대표자로서, 미신을 넘어 미학적이고 학술적인 현대 사주 해석을 통해 개개인의 삶이 지닌 고유한 흐름과 균형을 찾도록 돕고 있습니다.',
  contactEmail: 'shopfree0601@naver.com',
  siteUrl: 'sajugongbang.com',
  mainColor: '#4C1D95', // Deep purple
  subColor: '#D97706',  // Amber
  
  // Real Business details from prompt
  ownerNameReal: '함경선',
  companyName: '샵프리',
  businessNumber: '217-07-67781',
  mailOrderNumber: '노원 제1234',
  address: '서울 노원구 한글비석로24바길 82',
  phone: '02-6083-0482',
  fax: '02-6083-0483',
  privacyOfficer: '이성우',
  consultantLead: '천명',
  consultantLove: '지애',
  consultantBusiness: '금명',

  // Default design colors (from pure styled original index.css)
  themeBg: '#FDFCF8',
  themeText: '#2D2926',
  themeAccent: '#7D5A50',
  themeSecondary: '#8C8279',
  themeBorder: '#E5E1D8',
  themeWarm: '#F2EDE4',
  themeWarmDeep: '#EAE5DB',
  themeDark: '#2D2926',

  // Home Page Defaults
  homeHeroTitle: '당신의 생년월일시,',
  homeHeroSubtitle: '우주가 프로그래밍한 코드를 해독합니다',
  homeHeroButtonText: '사주 정보 탐색하기',
  homeShowHero: true,
  homeHeroAlign: 'left',
  homeShowPillars: true,
  homeShowCategories: true,
  homeShowSpotlight: true,
  homeShowBioCard: true,
  homeShowRecentUpdates: true,
  homeShowWarningBanner: true,
  homeShowCTA: true,

  // About Page Defaults
  aboutTitle: '명리를 빌린 현대인의 수신서',
  aboutSubtitle: '"사주는 미래의 낙인이 아닌, 나만의 인생 날씨 지도입니다."',
  aboutShowBreadcrumb: true,
  aboutShowIdentityHeader: true,
  aboutShowSection1: true,
  aboutShowSection2: true,
  aboutShowSection3: true,

  // Author Page Defaults
  authorShowHeaderBanner: true,
  authorShowPrinciples: true,
  authorShowConsultants: true,
  authorShowRecentColumns: true,
};
