import React from 'react';
import { Menu, X, UserCheck, ShieldAlert } from 'lucide-react';
import { getSiteConfig, isAdminLoggedIn, setAdminLoggedIn } from '../data/db';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  onLogout: () => void;
  // Trigger update on state change
  updateTrigger?: number;
}

export default function Header({ currentPath, navigate, onLogout, updateTrigger }: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const config = getSiteConfig();
  const loggedIn = isAdminLoggedIn();

  const navItems = [
    { name: '홈', path: 'home' },
    { name: '사주 칼럼', path: 'columns' },
    { name: '카테고리 정보', path: 'categories' },
    { name: '소개', path: 'about' },
    { name: '상담사 소개', path: 'author' },
    { name: '문의하기', path: 'contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    if (path === 'home') {
      return currentPath === '' || currentPath === 'home';
    }
    return currentPath.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-theme-bg/95 text-theme-text backdrop-blur-md border-b border-theme-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-theme-text font-serif text-sm font-black text-theme-text bg-theme-warm shadow-[2px_2px_0px_0px_rgba(45,41,38,1)]">
              공방
            </div>
            <div>
              <span className="font-serif text-lg font-extrabold tracking-tight text-theme-text block leading-none">
                {config.siteName}
              </span>
              <span className="text-[10px] tracking-wider text-theme-secondary font-sans block mt-1 font-medium select-none">
                명리학 정통 가이드
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2 h-16 items-end pb-0">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`px-3 py-2 text-xs font-sans font-semibold rounded-t-md border-t-2 border-x transition-all duration-150 ${
                  isActive(item.path)
                    ? 'text-theme-accent bg-theme-warm border-theme-accent font-bold pb-2.5 -mb-[1px]'
                    : 'text-theme-secondary hover:text-theme-text hover:bg-theme-warm/50 border-transparent pb-2'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Admin Indicator / Extra controls */}
          <div className="hidden md:flex items-center gap-3">
            {loggedIn ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] text-theme-accent bg-theme-warm border border-theme-border px-2 py-1 rounded-sm">
                  <UserCheck size={11} />
                  관리자 작동중
                </span>
                <button
                  onClick={() => handleNavClick('admin')}
                  className="px-2.5 py-1 text-xs bg-theme-accent hover:bg-theme-accent/90 text-white rounded-sm border border-theme-accent transition font-medium"
                >
                  제어판
                </button>
                <button
                  onClick={onLogout}
                  className="px-2 py-1 text-xs text-theme-secondary hover:text-rose-600 transition"
                >
                  로그아웃
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {loggedIn && (
              <span className="text-theme-accent bg-theme-warm border border-theme-border p-1.5 rounded-sm" title="관리자 모드">
                <UserCheck size={14} />
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-sm text-theme-secondary hover:text-theme-text hover:bg-theme-warm outline-none border border-transparent hover:border-theme-border"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-theme-bg border-t border-theme-border px-4 pt-2 pb-4 space-y-1 shadow-sm">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`block w-full text-left px-3 py-2.5 text-sm font-sans font-semibold rounded-sm ${
                isActive(item.path)
                  ? 'text-theme-accent bg-theme-warm border-l-2 border-theme-accent font-bold'
                  : 'text-theme-secondary hover:text-theme-text hover:bg-theme-warm/50'
              }`}
            >
              {item.name}
            </button>
          ))}
          <div className="pt-3 border-t border-theme-border flex items-center justify-between">
            {loggedIn ? (
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between text-xs text-theme-accent">
                  <span className="flex items-center gap-1 font-semibold">
                    <UserCheck size={14} /> 관리자 상태 로그인
                  </span>
                  <button onClick={onLogout} className="text-rose-600 hover:underline">
                    로그아웃
                  </button>
                </div>
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full text-center py-2 bg-theme-accent text-white rounded-sm text-xs font-semibold"
                >
                  관리자 대시보드 열기
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
