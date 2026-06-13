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
import { setAdminLoggedIn } from './data/db';
import { ShieldAlert, Compass } from 'lucide-react';

export default function App() {
  const [routeHash, setRouteHash] = React.useState(window.location.hash);
  const [updateTrigger, setUpdateTrigger] = React.useState(0);

  // Synchronize routing state with brower hash
  React.useEffect(() => {
    const handleHashChange = () => {
      setRouteHash(window.location.hash);
      // Automatically scroll to top on routing changes
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check for hash redirects
    if (!window.location.hash) {
      window.location.hash = '#/';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
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
    if (viewName === 'home') {
      window.location.hash = '#/';
    } else if (param) {
      window.location.hash = `#/${viewName}/${param}`;
    } else {
      window.location.hash = `#/${viewName}`;
    }
  };

  // Parsing current path segments
  const parseRoute = () => {
    const rawHash = routeHash || '#/';
    const path = rawHash.replace('#/', '').split('?')[0];
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

  return (
    <div className="flex flex-col min-h-screen bg-theme-bg">
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
