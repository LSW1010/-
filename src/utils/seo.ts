import { Post, Column, Category, SiteConfig } from '../types';

export function updateMetaTags(
  title: string,
  description: string,
  url: string,
  schemaType?: 'article' | 'faq' | 'breadcrumb' | 'webpage',
  schemaData?: any
) {
  // 1. Update document title
  document.title = `${title} | 사주공방`;

  // 2. Head Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // 3. OpenGraph tags
  const ogTags = {
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:type': schemaType === 'article' ? 'article' : 'website',
    'og:site_name': '사주공방'
  };

  Object.entries(ogTags).forEach(([property, content]) => {
    let ogMeta = document.querySelector(`meta[property="${property}"]`);
    if (!ogMeta) {
      ogMeta = document.createElement('meta');
      ogMeta.setAttribute('property', property);
      document.head.appendChild(ogMeta);
    }
    ogMeta.setAttribute('content', content);
  });

  // 4. Clean up and inject JSON-LD schema
  const oldSchema = document.getElementById('jsonld-markup');
  if (oldSchema) {
    oldSchema.remove();
  }

  if (schemaType && schemaData) {
    const script = document.createElement('script');
    script.id = 'jsonld-markup';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
  }
}

// Generate Article Structured Data
export function generateArticleSchema(post: Post, siteUrl: string): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': post.title,
    'description': post.summary,
    'datePublished': post.publishDate,
    'dateModified': post.updateDate,
    'author': {
      '@type': 'Person',
      'name': post.author,
      'url': `${siteUrl}/author`
    },
    'publisher': {
      '@type': 'Organization',
      'name': '사주공방',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/logo.png`
      }
    }
  };
}

// Generate FAQ Structured Data
export function generateFAQSchema(faqs: { question: string; answer: string }[]): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(f => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer
      }
    }))
  };
}

// Generate Breadcrumb Structured Data
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };
}
