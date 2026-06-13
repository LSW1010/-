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
}
