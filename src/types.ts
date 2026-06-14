export interface FAQ {
  question: string;
  answer: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  category: string; // matches category ID
  author: string;
  publishDate: string;
  updateDate: string;
  content: string; // Markdown-like or clean HTML/paragraphs
  checklist: string[];
  mistakes: string[];
  faqs: FAQ[];
  relatedSlugs?: string[];
  isFeatured?: boolean; // 추천 글 여부
  status: 'published' | 'draft';
}

export interface Column {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  author: string;
  publishDate: string;
  updateDate: string;
  content: string; // Column essay body
  notes?: string; // Column-specific personal thoughts
  checklist?: string[];
  status: 'published' | 'draft';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export interface MenuItem {
  id: string;
  name: string;
  path: string;
}

export interface SiteConfig {
  siteName: string;
  tagline: string;
  topic: string;
  ownerName: string;
  ownerBio: string;
  contactEmail: string;
  siteUrl: string;
  mainColor: string;
  subColor: string;
  
  // Business info from user specifications
  ownerNameReal: string; // 함경선
  companyName: string;   // 샵프리
  businessNumber: string; // 217-07-67781
  mailOrderNumber: string; // 노원 제1234
  address: string; // 서울 노원구 한글비석로24바길 82
  phone: string; // 02-6083-0482
  fax: string; // 02-6083-0483
  privacyOfficer: string; // 이성우
  consultantLead: string; // 천명
  consultantLove: string; // 지애
  consultantBusiness: string; // 금명

  // Dynamic Theme Custom Design Colors (Safe CSS Variable injection)
  themeBg?: string;          // default: #FDFCF8
  themeText?: string;        // default: #2D2926
  themeAccent?: string;      // default: #7D5A50
  themeSecondary?: string;   // default: #8C8279
  themeBorder?: string;      // default: #E5E1D8
  themeWarm?: string;        // default: #F2EDE4
  themeWarmDeep?: string;    // default: #EAE5DB
  themeDark?: string;        // default: #2D2926

  // Home Page Modular Customizations & Section Toggles
  homeHeroTitle?: string;
  homeHeroSubtitle?: string;
  homeHeroButtonText?: string;
  homeShowHero?: boolean;
  homeHeroAlign?: 'left' | 'center';
  homeShowPillars?: boolean;
  homeShowCategories?: boolean;
  homeShowSpotlight?: boolean;
  homeShowBioCard?: boolean;
  homeShowRecentUpdates?: boolean;
  homeShowWarningBanner?: boolean;
  homeShowCTA?: boolean;

  // About Page Modular Customizations & Section Toggles
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutShowBreadcrumb?: boolean;
  aboutShowIdentityHeader?: boolean;
  aboutShowSection1?: boolean;
  aboutShowSection2?: boolean;
  aboutShowSection3?: boolean;

  // Author Page Modular Customizations & Section Toggles
  authorShowHeaderBanner?: boolean;
  authorShowPrinciples?: boolean;
  authorShowConsultants?: boolean;
  authorShowRecentColumns?: boolean;
}
