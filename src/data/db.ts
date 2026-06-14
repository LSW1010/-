import { Post, Column, Category, SiteConfig, MenuItem } from '../types';
import { initialSiteConfig } from './siteConfig';
import { initialCategories } from './categories';
import { initialPosts } from './posts';
import { initialColumns } from './columns';

const KEYS = {
  SITE_CONFIG: 'sajugongbang_site_config',
  CATEGORIES: 'sajugongbang_categories',
  POSTS: 'sajugongbang_posts',
  COLUMNS: 'sajugongbang_columns',
  ADMIN_LOGGED_IN: 'sajugongbang_admin_logged_in',
  ADMIN_PASSWORD: 'sajugongbang_admin_password',
  MENU_ITEMS: 'sajugongbang_menu_items'
};

const initialMenuItems: MenuItem[] = [
  { id: '1', name: '홈', path: 'home' },
  { id: '2', name: '사주 칼럼', path: 'columns' },
  { id: '3', name: '카테고리 정보', path: 'categories' },
  { id: '4', name: '소개', path: 'about' },
  { id: '5', name: '상담사 소개', path: 'author' },
  { id: '6', name: '문의하기', path: 'contact' },
];

// Site Config Helpers
export function getSiteConfig(): SiteConfig {
  const cached = localStorage.getItem(KEYS.SITE_CONFIG);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error('Failed to parse cached site config', e);
    }
  }
  return initialSiteConfig;
}

export function saveSiteConfig(config: SiteConfig): void {
  localStorage.setItem(KEYS.SITE_CONFIG, JSON.stringify(config));
}

// Category Helpers
export function getCategories(): Category[] {
  const cached = localStorage.getItem(KEYS.CATEGORIES);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error('Failed to parse cached categories', e);
    }
  }
  return initialCategories;
}

export function saveCategories(categories: Category[]): void {
  localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
}

// Menu Items Helpers
export function getMenuItems(): MenuItem[] {
  const cached = localStorage.getItem(KEYS.MENU_ITEMS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error('Failed to parse cached menu items', e);
    }
  }
  return initialMenuItems;
}

export function saveMenuItems(items: MenuItem[]): void {
  localStorage.setItem(KEYS.MENU_ITEMS, JSON.stringify(items));
}

// Post Helpers
export function getPosts(): Post[] {
  const cached = localStorage.getItem(KEYS.POSTS);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.length < 80) {
        savePosts(initialPosts);
        return initialPosts;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse cached posts', e);
    }
  }
  savePosts(initialPosts);
  return initialPosts;
}

export function savePosts(posts: Post[]): void {
  localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
}

// Column Helpers
export function getColumns(): Column[] {
  const cached = localStorage.getItem(KEYS.COLUMNS);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.length < 15) {
        saveColumns(initialColumns);
        return initialColumns;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse cached columns', e);
    }
  }
  saveColumns(initialColumns);
  return initialColumns;
}

export function saveColumns(columns: Column[]): void {
  localStorage.setItem(KEYS.COLUMNS, JSON.stringify(columns));
}

// Auth State Helper
export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(KEYS.ADMIN_LOGGED_IN) === 'true';
}

export function setAdminLoggedIn(status: boolean): void {
  localStorage.setItem(KEYS.ADMIN_LOGGED_IN, status ? 'true' : 'false');
}

export function getAdminPassword(): string {
  const cached = localStorage.getItem(KEYS.ADMIN_PASSWORD);
  // Default is 'admin'. If the user resets, it will fall back to 'admin' or they can also use '1234' on fresh login unless changed.
  return cached || 'admin';
}

export function saveAdminPassword(password: string): void {
  localStorage.setItem(KEYS.ADMIN_PASSWORD, password);
}

// Database Reset/Reload Helpers
export function resetToDefault(): void {
  localStorage.removeItem(KEYS.SITE_CONFIG);
  localStorage.removeItem(KEYS.CATEGORIES);
  localStorage.removeItem(KEYS.POSTS);
  localStorage.removeItem(KEYS.COLUMNS);
  localStorage.removeItem(KEYS.ADMIN_LOGGED_IN);
  localStorage.removeItem(KEYS.ADMIN_PASSWORD);
  localStorage.removeItem(KEYS.MENU_ITEMS);
}

// Export All Database State as JSON object
export function exportAllData(): string {
  const data = {
    siteConfig: getSiteConfig(),
    categories: getCategories(),
    posts: getPosts(),
    columns: getColumns(),
    menuItems: getMenuItems()
  };
  return JSON.stringify(data, null, 2);
}

// Import Database State from JSON
export function importAllData(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.siteConfig) saveSiteConfig(parsed.siteConfig);
    if (parsed.categories) saveCategories(parsed.categories);
    if (parsed.posts) savePosts(parsed.posts);
    if (parsed.columns) saveColumns(parsed.columns);
    if (parsed.menuItems) saveMenuItems(parsed.menuItems);
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}
