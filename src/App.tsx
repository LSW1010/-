import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/views/HomeView';
import CategoriesView from './components/views/CategoriesView';
import PostDetailView from './components/views/PostDetailView';
import ColumnView from './components/views/ColumnView';
import AuthorView from './components/views/AuthorView';
import AboutView from './components/views/AboutView';
import ContactView from './components/views/ContactView';
import TrustViews from './components/views/TrustViews';
import AdminView from './components/views/AdminView';
import { setAdminLoggedIn, getSiteConfig, incrementVisit, incrementCategoryClick } from './data/db';
import { ShieldAlert, Compass } from 'lucide-react';

export default function App() {
  const [routePath, setRoutePath] = React.useState(window.location.pathname);
  const [updateTrigger, setUpdateTrigger] = React.useState(0);

  // Synchronize routing state with browser location/history
  React.useEffect(() => {
    // Initial visit count increment
    incrementVisit();

    // Support backwards compatibility for hash-based links (e.g. /#/about -> /about)
    if (window.location.hash && window.location.hash.startsWith('#/')) {
      const cleanPath = window.location.hash.substring(2); // remove '#/'
      window.history.replaceState(null, '', '/' + cleanPath);
      setRoutePath('/' + cleanPath);
    }

    const handleLocationChange = () => {
      setRoutePath(window.location.pathname);
      incrementVisit();

      // Automatically increment category stats if navigating to a category
      const path = window.location.pathname.replace(/^\//, '').split('?')[0];
      const segments = path.split('/');
      if (segments[0] === 'categories' && segments[1]) {
        incrementCategoryClick(segments[1]);
      }

      // Automatically scroll to top on routing changes
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate-navigate', handleLocationChange);

    // Initial check if deep link contains a category click
    const path = window.location.pathname.replace(/^\//, '').split('?')[0];
    const segments = path.split('/');
    if (segments[0] === 'categories' && segments[1]) {
      incrementCategoryClick(segments[1]);
    }

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate-navigate', handleLocationChange);
    };
  }, []);

  // Root state re-fetch signaling
  const handleStateChange = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    handleStateChange();
    navigate('home');
  };

  // Nav routing triggering helper
  const navigate = (viewName: string, param?: string) => {
    let newPath = '/';
    if (viewName === 'home') {
      newPath = '/';
    } else if (param) {
      newPath = `/${viewName}/${param}`;
    } else {
      newPath = `/${viewName}`;
    }

    window.history.pushState(null, '', newPath);
    window.dispatchEvent(new Event('pushstate-navigate'));
  };

  // Parsing current path segments
  const parseRoute = () => {
    const path = routePath.replace(/^\//, '').split('?')[0];
    const segments = path.split('/');

    return {
      main: segments[0] || 'home',
      param: segments[1] || null
    };
  };

  const route = parseRoute();

  // Rendering Routing Views mapping
  const renderMainView = () => {
    switch (route.main) {
      case 'home':
        return <HomeView navigate={navigate} />;
      case 'categories':
        return <CategoriesView initialCategoryId={route.param || undefined} navigate={navigate} />;
      case 'posts':
        return <PostDetailView slug={route.param || ''} navigate={navigate} />;
      case 'columns':
        return <ColumnView slug={route.param || undefined} navigate={navigate} />;
      case 'author':
        return <AuthorView navigate={navigate} />;
      case 'about':
        return <AboutView navigate={navigate} />;
      case 'contact':
        return <ContactView navigate={navigate} />;
      case 'privacy':
        return <TrustViews viewType="privacy" navigate={navigate} />;
      case 'terms':
        return <TrustViews viewType="terms" navigate={navigate} />;
      case 'disclaimer':
        return <TrustViews viewType="disclaimer" navigate={navigate} />;
      case 'sitemap':
        return <TrustViews viewType="sitemap" navigate={navigate} />;
      case 'admin':
        return (
          <AdminView
            onStateChange={handleStateChange}
            navigate={navigate}
            initialAction={route.param}
          />
        );
      default:
        // Comprehensive 404 Fallback page
        return (
          <div className="bg-theme-bg min-h-screen flex items-center justify-center px-4 font-sans py-16 text-theme-text select-none">
            <div className="max-w-md w-full bg-[#FAF7F2] p-8 border border-theme-border text-center space-y-5 rounded-sm">
              <div className="flex justify-center text-theme-accent">
                <ShieldAlert size={48} />
              </div>
              <h1 className="font-serif text-2xl font-black text-theme-text">404 - 길을 잃으셨습니다</h1>
              <p className="text-theme-secondary text-xs sm:text-sm leading-relaxed font-semibold">
                찾으시려던 인생 지표 또는 학리 문서가 명부(데이터셋)에 저장되지 않았거나, 손실된 경로 분기명입니다. 걱정하지 마시고 아래 조력 버튼을 통해 사주공방의 안전 지대로 돌아오십시오.
              </p>
              <button
                onClick={() => navigate('home')}
                className="w-full py-2.5 bg-theme-accent hover:bg-theme-text text-white rounded-sm text-xs font-bold transition tracking-wider uppercase cursor-pointer"
              >
                사주공방 홈으로 대피하기
              </button>
            </div>
          </div>
        );
    }
  };

  // Frame structure layouts
  // The Admin page looks cleanest without a duplicate header/footer, so we hide them when rendering '/admin'
  const isCmsLayout = route.main === 'admin';

  const config = getSiteConfig();
  const themeBg = config.themeBg || '#FDFCF8';
  const themeText = config.themeText || '#2D2926';
  const themeAccent = config.themeAccent || '#7D5A50';
  const themeSecondary = config.themeSecondary || '#8C8279';
  const themeBorder = config.themeBorder || '#E5E1D8';
  const themeWarm = config.themeWarm || '#F2EDE4';
  const themeWarmDeep = config.themeWarmDeep || '#EAE5DB';
  const themeDark = config.themeDark || '#2D2926';

  const dynamicStyles = `
    :root {
      --color-theme-bg: ${themeBg} !important;
      --color-theme-text: ${themeText} !important;
      --color-theme-accent: ${themeAccent} !important;
      --color-theme-secondary: ${themeSecondary} !important;
      --color-theme-border: ${themeBorder} !important;
      --color-theme-warm: ${themeWarm} !important;
      --color-theme-warm-deep: ${themeWarmDeep} !important;
      --color-theme-dark: ${themeDark} !important;
    }
    html, body {
      background-color: ${themeBg} !important;
      color: ${themeText} !important;
    }
    .markdown-body h3 {
      border-left-color: ${themeAccent} !important;
    }
  `;

  return (
    <div className="flex flex-col min-h-screen bg-theme-bg">
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      {!isCmsLayout && (
        <Header
          currentPath={route.main}
          navigate={navigate}
          onLogout={handleLogout}
          updateTrigger={updateTrigger}
        />
      )}
      
      <main className="flex-grow">
        {renderMainView()}
      </main>

      {!isCmsLayout && (
        <Footer navigate={navigate} />
      )}
    </div>
  );
}
