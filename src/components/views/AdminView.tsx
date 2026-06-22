import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Feather,
  FolderOpen,
  Settings,
  Database,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  Sparkles,
  Link2,
  Palette,
  Eye,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  getSiteConfig,
  saveSiteConfig,
  getCategories,
  saveCategories,
  getPosts,
  savePosts,
  getColumns,
  saveColumns,
  isAdminLoggedIn,
  setAdminLoggedIn,
  getAdminPassword,
  saveAdminPassword,
  resetToDefault,
  exportAllData,
  importAllData,
  getMenuItems,
  saveMenuItems,
  getAnalyticsData
} from '../../data/db';
import { Post, Column, Category, SiteConfig, FAQ, MenuItem, AnalyticsData } from '../../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface AdminViewProps {
  onStateChange: () => void;
  navigate: (path: string, param?: string) => void;
  initialAction?: string | null;
}

export default function AdminView({ onStateChange, navigate, initialAction }: AdminViewProps) {
  // Authentication states
  const [isLogged, setIsLogged] = React.useState(isAdminLoggedIn());
  const [password, setPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');

  // Active tab states
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'posts' | 'columns' | 'categories' | 'settings' | 'backup'>('dashboard');

  // Database lists
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [columns, setColumns] = React.useState<Column[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [siteConfig, setSiteConfig] = React.useState<SiteConfig | null>(null);
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData | null>(null);

  // Editing state trackers
  const [editingPost, setEditingPost] = React.useState<Partial<Post> | null>(null);
  const [editingColumn, setEditingColumn] = React.useState<Partial<Column> | null>(null);
  const [isCreatingNew, setIsCreatingNew] = React.useState(false);

  // Category editing state
  const [editingCatId, setEditingCatId] = React.useState<string | null>(null);
  const [catForm, setCatForm] = React.useState({ id: '', name: '', description: '', slug: '' });
  const [newCatOpen, setNewCatOpen] = React.useState(false);

  // Menu editing state
  const [editingMenuId, setEditingMenuId] = React.useState<string | null>(null);
  const [menuForm, setMenuForm] = React.useState({ id: '', name: '', path: '' });
  const [newMenuOpen, setNewMenuOpen] = React.useState(false);

  // Form lists values (checklist, mistakes, faqs)
  const [currentFaqQ, setCurrentFaqQ] = React.useState('');
  const [currentFaqA, setCurrentFaqA] = React.useState('');
  const [currentMistake, setCurrentMistake] = React.useState('');
  const [currentChecklist, setCurrentChecklist] = React.useState('');

  // Toast / Status banner
  const [statusMsg, setStatusMsg] = React.useState({ type: 'success', text: '' });

  // Password change states
  const [currentPw, setCurrentPw] = React.useState('');
  const [newPw, setNewPw] = React.useState('');
  const [confirmNewPw, setConfirmNewPw] = React.useState('');
  const [pwError, setPwError] = React.useState('');
  const [pwSuccess, setPwSuccess] = React.useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    const savedPw = getAdminPassword();
    
    // Validate current password (if saved password is admin, they can verify with 'admin' or '1234')
    const verifyOk = savedPw === 'admin'
      ? (currentPw === 'admin' || currentPw === '1234')
      : (currentPw === savedPw);

    if (!verifyOk) {
      setPwError('현재 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!newPw || newPw.trim().length < 4) {
      setPwError('새 비밀번호는 최소 4자 이상이어야 합니다.');
      return;
    }

    if (newPw !== confirmNewPw) {
      setPwError('새 비밀번호와 확인 입력이 일치하지 않습니다.');
      return;
    }

    saveAdminPassword(newPw.trim());
    setCurrentPw('');
    setNewPw('');
    setConfirmNewPw('');
    setPwSuccess('관리자 비밀번호가 성공적으로 변경되었습니다. 다음 로그인부터 적용됩니다.');
    triggerStatus('관리자 비밀번호가 성공적으로 변경되었습니다.');
  };

  const handleResetPassword = () => {
    if (confirm('관리자 비밀번호를 기본 초기 상태("admin")로 즉시 초기화하시겠습니까?')) {
      saveAdminPassword('admin');
      setCurrentPw('');
      setNewPw('');
      setConfirmNewPw('');
      setPwError('');
      setPwSuccess('비밀번호가 기본 초기값("admin")으로 리셋되었습니다.');
      triggerStatus('관리자 비밀번호가 초기화되었습니다.');
    }
  };

  // Load Database state
  const loadDatabase = () => {
    setPosts(getPosts());
    setColumns(getColumns());
    setCategories(getCategories());
    setMenuItems(getMenuItems());
    setSiteConfig(getSiteConfig());
    setAnalyticsData(getAnalyticsData());
  };

  React.useEffect(() => {
    if (isLogged) {
      loadDatabase();
      if (initialAction === 'new-column') {
        setActiveTab('columns');
        handleCreateNewColumn();
      }
    }
  }, [isLogged, initialAction]);

  // Toast trigger helper
  const triggerStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg({ type: 'success', text: '' });
    }, 4000);
  };

  // Demo Admin Authenticator
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentSavedPassword = getAdminPassword();
    const isCorrect = currentSavedPassword === 'admin'
      ? (password === 'admin' || password === '1234')
      : (password === currentSavedPassword);

    if (isCorrect) {
      setAdminLoggedIn(true);
      setIsLogged(true);
      setAuthError('');
      triggerStatus('관리자 모드로 안전 로그인하였습니다.');
      onStateChange(); // Notify root
    } else {
      setAuthError(
        currentSavedPassword === 'admin'
          ? '비밀번호가 잘못되었습니다. 관리자 기본 비밀번호는 "admin" 또는 "1234" 입니다.'
          : '변경된 관리자 비밀번호가 일치하지 않습니다.'
      );
    }
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    setIsLogged(false);
    onStateChange(); // Notify root
  };

  // Create & Edit form handlers for GENERAL POSTS
  const handleEditPost = (post: Post) => {
    setEditingPost({ ...post });
    setEditingColumn(null);
    setIsCreatingNew(false);
  };

  const handleCreateNewPost = () => {
    const newPost: Partial<Post> = {
      id: `post-${Date.now()}`,
      slug: `new-guide-${Math.floor(Math.random() * 1000)}`,
      title: '새로운 명리학 가이드',
      subtitle: '초보자를 위한 가벼운 서브타이틀',
      summary: '이 글의 핵심 내용을 한 단락으로 기표하십시오.',
      category: categories[0]?.id || 'yin-yang-five-elements',
      author: '천명',
      publishDate: new Date().toISOString().split('T')[0],
      updateDate: new Date().toISOString().split('T')[0],
      content: '### 1단계: 주제에 관한 화두\n여기에 본문 설명을 paragraphs로 세심히 이끌어 가야 합니다.',
      checklist: ['사주 체크리스트 일람'],
      mistakes: ['흔한 이설 주의 사항'],
      faqs: [{ question: '이 원리는 양력 기준인가요?', answer: '네, 정통 사주는 절입일(양력)을 기준 삼아 연산합니다.' }],
      isFeatured: false,
      status: 'draft'
    };
    setEditingPost(newPost);
    setEditingColumn(null);
    setIsCreatingNew(true);
  };

  const handleSavePost = () => {
    if (!editingPost || !editingPost.slug || !editingPost.title) {
      triggerStatus('슬러그와 제목은 필수 입력 사항입니다.', 'error');
      return;
    }

    const updatedPosts = [...posts];
    const index = updatedPosts.findIndex(p => p.id === editingPost.id);

    if (index >= 0) {
      updatedPosts[index] = { ...updatedPosts[index], ...editingPost } as Post;
    } else {
      updatedPosts.unshift(editingPost as Post);
    }

    savePosts(updatedPosts);
    setPosts(updatedPosts);
    setEditingPost(null);
    setIsCreatingNew(false);
    triggerStatus('글 변경사항이 브라우저 로컬 저장소에 완벽 기표되었습니다.');
    onStateChange();
  };

  // Create & Edit form handlers for OPERATOR COLUMNS
  const handleEditColumn = (col: Column) => {
    setEditingColumn({ ...col });
    setEditingPost(null);
    setIsCreatingNew(false);
  };

  const handleCreateNewColumn = () => {
    const newColumn: Partial<Column> = {
      id: `column-${Date.now()}`,
      slug: `new-column-essay-${Math.floor(Math.random() * 1000)}`,
      title: '새로이 쓰는 명리 수필 에세이',
      subtitle: '운명과 자연 주기에 대한 함경선 칼럼',
      summary: '이 칼럼의 지적 가치를 요점 서술해주세요.',
      author: siteConfig?.ownerName || '함경선',
      publishDate: new Date().toISOString().split('T')[0],
      updateDate: new Date().toISOString().split('T')[0],
      content: '### ─ 생각의 무덤 ─\n여기에 깊은 수필 내용을 정성껏 채워 에세이를 개정해보십시오.',
      notes: '이번 무명의 고찰 이유를 간단 기표',
      checklist: ['다짐 한 닢'],
      status: 'draft'
    };
    setEditingColumn(newColumn);
    setEditingPost(null);
    setIsCreatingNew(true);
  };

  const handleSaveColumn = () => {
    if (!editingColumn || !editingColumn.slug || !editingColumn.title) {
      triggerStatus('슬러그와 제목은 필수 입력 사항입니다.', 'error');
      return;
    }

    const updatedColumns = [...columns];
    const index = updatedColumns.findIndex(c => c.id === editingColumn.id);

    if (index >= 0) {
      updatedColumns[index] = { ...updatedColumns[index], ...editingColumn } as Column;
    } else {
      updatedColumns.unshift(editingColumn as Column);
    }

    saveColumns(updatedColumns);
    setColumns(updatedColumns);
    setEditingColumn(null);
    setIsCreatingNew(false);
    triggerStatus('함경선 칼럼 수필이 로컬 DB에 완벽 보존 처리되었습니다.');
    onStateChange();
  };

  // Delete Actions with warning cues
  const handleDeletePost = (id: string) => {
    if (confirm('이 글을 영구 삭제 처리하시겠습니까? 데이터는 로컬 저장소에서 제거됩니다.')) {
      const updated = posts.filter(p => p.id !== id);
      savePosts(updated);
      setPosts(updated);
      triggerStatus('명리 정보가 삭제 되었습니다.');
      onStateChange();
    }
  };

  const handleDeleteColumn = (id: string) => {
    if (confirm('이 대표 에세이 칼럼을 영구 삭제하시겠습니까?')) {
      const updated = columns.filter(c => c.id !== id);
      saveColumns(updated);
      setColumns(updated);
      triggerStatus('에세이 수필이 삭제 완료되었습니다.');
      onStateChange();
    }
  };

  // Site general settings saver
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (siteConfig) {
      saveSiteConfig(siteConfig);
      triggerStatus('사주공방의 대표자 정보, 칼럼 칼라, 주소 등의 메타가 전폭 업데이트되었습니다.');
      onStateChange();
    }
  };

  // Category Actions
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name || !catForm.slug) {
      triggerStatus('이름과 슬러그는 필수 입력입니다.', 'error');
      return;
    }

    let updated: Category[];
    if (editingCatId) {
      // Editing
      updated = categories.map(c => c.id === editingCatId ? { ...c, ...catForm } : c);
      triggerStatus('카테고리 정보가 수정되었습니다.');
    } else {
      // Adding new
      const newId = catForm.id || `category-${Date.now()}`;
      if (categories.some(c => c.id === newId || c.slug === catForm.slug)) {
        triggerStatus('이미 존재하는 카테고리 ID 혹은 슬러그입니다.', 'error');
        return;
      }
      const newCat: Category = {
        id: newId,
        name: catForm.name,
        description: catForm.description,
        slug: catForm.slug
      };
      updated = [...categories, newCat];
      triggerStatus('새로운 카테고리가 등록되었습니다.');
    }

    setCategories(updated);
    saveCategories(updated);
    setEditingCatId(null);
    setNewCatOpen(false);
    setCatForm({ id: '', name: '', description: '', slug: '' });
    onStateChange();
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('이 카테고리를 정말 삭제하시겠습니까? 연결된 게시글이 있는 경우 카테고리 매칭이 해제될 수 있습니다.')) {
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      saveCategories(updated);
      triggerStatus('카테고리가 삭제되었습니다.');
      onStateChange();
    }
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...categories];
    const border = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = border;

    setCategories(updated);
    saveCategories(updated);
    triggerStatus('카테고리 순서가 조정되었습니다.');
    onStateChange();
  };

  // Menu Items Actions
  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuForm.name || !menuForm.path) {
      triggerStatus('메뉴 이름과 이동 경로는 필수 항목입니다.', 'error');
      return;
    }

    let updated: MenuItem[];
    if (editingMenuId) {
      // Editing
      updated = menuItems.map(m => m.id === editingMenuId ? { ...m, ...menuForm } : m);
      triggerStatus('메뉴 정보가 수정되었습니다.');
    } else {
      // Adding new
      const newMenu: MenuItem = {
        id: `menu-${Date.now()}`,
        name: menuForm.name,
        path: menuForm.path
      };
      updated = [...menuItems, newMenu];
      triggerStatus('새로운 메뉴가 등록되었습니다.');
    }

    setMenuItems(updated);
    saveMenuItems(updated);
    setEditingMenuId(null);
    setNewMenuOpen(false);
    setMenuForm({ id: '', name: '', path: '' });
    onStateChange();
  };

  const handleDeleteMenuItem = (id: string) => {
    if (window.confirm('이 메뉴 항목을 정말 삭제하시겠습니까?')) {
      const updated = menuItems.filter(m => m.id !== id);
      setMenuItems(updated);
      saveMenuItems(updated);
      triggerStatus('메뉴 항목이 삭제되었습니다.');
      onStateChange();
    }
  };

  const handleMoveMenuItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === menuItems.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...menuItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setMenuItems(updated);
    saveMenuItems(updated);
    triggerStatus('메뉴 순서가 조정되었습니다.');
    onStateChange();
  };

  // Backup and Restore Actions (JSON format)
  const handleJsonExport = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportAllData());
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `sajugongbang_cms_backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerStatus('전체 로컬 DB 데이터셋 백업용 JSON 파일이 성공적으로 내려받아졌습니다.');
    } catch (e) {
      triggerStatus('내보내기 중 문제가 발생했습니다.', 'error');
    }
  };

  const handleJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (files && files.length > 0) {
      fileReader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const success = importAllData(result);
          if (success) {
            loadDatabase();
            triggerStatus('외부 데이터 덤프를 성공적으로 가져와 덮어씌웠습니다.');
            onStateChange();
          } else {
            triggerStatus('올바르지 않은 JSON 형식이거나 내부 필드 매칭이 매끄럽지 못합니다.', 'error');
          }
        }
      };
      fileReader.readAsText(files[0]);
    }
  };

  const handleFactoryReset = () => {
    if (confirm('정말로 로컬 모든 정보와 대지 설정을 청소하고 초기 15편의 고품질 사주 지도로 리셋하시겠습니까?')) {
      resetToDefault();
      loadDatabase();
      triggerStatus('로컬 브라우저가 공장 출하 시점 초기 원형 데이터로 완벽 리포맷팅되었습니다.');
      onStateChange();
    }
  };

  // Login view
  if (!isLogged) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center px-4 font-sans relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-5"></div>
        
        <div className="max-w-md w-full bg-slate-950 rounded-2xl border border-slate-800 p-8 relative z-10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 font-serif text-2xl font-bold text-white shadow shadow-amber-950/40 mb-2">
              공방
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-100 tracking-tight">
              사주공방 CMS-lite 관리자 로그인
            </h1>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto font-light leading-relaxed">
              본 구역은 워드프레스 레이아웃으로 직관 설계된 정적 저장소(CMS) 제어 데스크입니다. 수정 사항은 로컬 브라우저에 투명히 저장됩니다.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">관리자용 비밀번호 입력</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="데모 비밀번호: admin 또는 1234"
                  className="w-full text-xs text-white border border-slate-800 rounded bg-slate-900 px-3.5 py-2.5 pl-10 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <Lock size={14} className="text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {authError && (
              <p className="text-[11px] text-rose-500 leading-normal pl-1.5 flex gap-1">
                <span>⚠</span> {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded transition shadow shadow-amber-900/15"
            >
              제어 대시보드 로그인 (데모)
            </button>
          </form>

          <div className="bg-slate-900/50 border border-slate-900 p-4 rounded-lg space-y-1.5">
            <span className="text-[10px] text-amber-500 uppercase font-semibold tracking-wider font-mono flex items-center gap-1">
              <AlertTriangle size={12} /> 정직한 한계 및 보안 안내
            </span>
            <p className="text-[10px] text-slate-500 leading-relaxed font-light">
              - 뒷단 데이터베이스 서버가 연계되지 않은 100% 안전한 클라이언트 형 static 시뮬레이터입니다.<br />
              - 비밀번호는 프론트 코드 안에서 판단 일치 확인하므로 임의 변경되지 않으며, 기기/브라우저가 바뀌면 보존에 한계가 있어 백업 JSON 기능을 동원해보세요.
            </p>
          </div>

          <div className="text-center pt-2 border-t border-slate-900">
            <button
              onClick={() => navigate('home')}
              className="text-xs text-slate-400 hover:text-white underline transition"
            >
              돌아가서 일반 사주 콘텐츠 읽기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800 antialiased">
      
      {/* LEFT SIDEBAR (WordPress Administration Navigation standard) */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        
        {/* Brand identity */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-amber-600 text-white font-serif flex items-center justify-center font-bold text-xs">
              공방
            </div>
            <span className="font-serif font-bold text-sm text-slate-100 uppercase tracking-widest block">
              사주공방 CMS
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="text-slate-500 hover:text-rose-400 transition"
            title="관리자 세션 종료"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Sidebar lists */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => { setActiveTab('dashboard'); setEditingPost(null); setEditingColumn(null); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-xs transition font-semibold ${
              activeTab === 'dashboard' ? 'text-amber-500 bg-slate-800' : 'hover:bg-slate-805 hover:text-white'
            }`}
          >
            <LayoutDashboard size={14} /> 대시보드 요약
          </button>

          <button
            onClick={() => { setActiveTab('posts'); setEditingPost(null); setEditingColumn(null); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-xs transition font-semibold ${
              activeTab === 'posts' ? 'text-amber-500 bg-slate-800' : 'hover:bg-slate-805 hover:text-white'
            }`}
          >
            <FileText size={14} /> 일반 학술 글 관리
          </button>

          <button
            onClick={() => { setActiveTab('columns'); setEditingPost(null); setEditingColumn(null); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-xs transition font-semibold ${
              activeTab === 'columns' ? 'text-amber-500 bg-slate-800' : 'hover:bg-slate-810 hover:text-white'
            }`}
          >
            <Feather size={14} /> 대표 에세이 칼럼 관리
          </button>

          <button
            onClick={() => { setActiveTab('categories'); setEditingPost(null); setEditingColumn(null); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-xs transition font-semibold ${
              activeTab === 'categories' ? 'text-amber-500 bg-slate-800' : 'hover:bg-slate-810 hover:text-white'
            }`}
          >
            <FolderOpen size={14} /> 카테고리 & 페이지 메뉴 관리
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setEditingPost(null); setEditingColumn(null); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-xs transition font-semibold ${
              activeTab === 'settings' ? 'text-amber-500 bg-slate-800' : 'hover:bg-slate-810 hover:text-white'
            }`}
          >
            <Settings size={14} /> 사이트 설정 변경
          </button>

          <button
            onClick={() => { setActiveTab('backup'); setEditingPost(null); setEditingColumn(null); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded text-xs transition font-semibold ${
              activeTab === 'backup' ? 'text-amber-500 bg-slate-800' : 'hover:bg-slate-810 hover:text-white'
            }`}
          >
            <Database size={14} /> 데이터 백업 / 복구
          </button>
        </nav>

        {/* Footer info box */}
        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 font-light space-y-1">
          <p>CMS-lite Framework v1.0</p>
          <p>호스트 포트: 3000</p>
          <p>로컬 저장고 연합 가동</p>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL */}
      <main className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
        
        {/* Toast Indicator Status */}
        {statusMsg.text && (
          <div className="flex items-center gap-2.5 p-4 rounded-lg bg-emerald-500 text-white text-xs font-semibold shadow-md animate-fade-in">
            <CheckCircle size={16} />
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* ==================== A. DASHBOARD VIEW ==================== */}
        {activeTab === 'dashboard' && !editingPost && !editingColumn && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header board */}
            <div>
              <h1 className="text-2xl font-serif font-bold text-slate-900">사주공방 관리자 종합 대시보드</h1>
              <p className="text-xs text-slate-500 mt-1 font-light">인생 지반 정보의 전례 없는 총량 구조를 한눈에 대조합니다.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider block">총 일반 학술 글 수</span>
                <span className="text-3xl font-serif font-bold text-slate-900 block mt-2">{posts.length} 개</span>
                <p className="text-[10px] text-slate-400 mt-2 font-light">초안 보존글: {posts.filter(p => p.status === 'draft').length}편</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-[10px] text-amber-650 font-bold uppercase tracking-wider block">운영자 칼럼 에세이 수</span>
                <span className="text-3xl font-serif font-bold text-slate-900 block mt-2">{columns.length} 개</span>
                <p className="text-[10px] text-slate-400 mt-2 font-light">초안: {columns.filter(c => c.status === 'draft').length}편</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-[10px] text-emerald-650 font-bold uppercase tracking-wider block">정렬 카테고리 수</span>
                <span className="text-3xl font-serif font-bold text-slate-900 block mt-2">{categories.length} 개</span>
                <p className="text-[10px] text-slate-400 mt-2 font-light">전체 정주 가동중</p>
              </div>

            </div>

            {/* 차트 대시보드 추가 (recharts) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 font-sans">
              
              {/* 차트 1: 방문자 수 추이 */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-sm">일주일간 방문자 분석 (Traffic-PV)</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-light">인생 안내서를 수조 관찰하러 들어온 고유 방문자수(UV) 및 총 뷰어십(PV)</p>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono font-semibold">실시간 수록</span>
                </div>
                
                <div className="h-64 w-full text-[10px]">
                  {analyticsData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={analyticsData.visitTrends}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01}/>
                          </linearGradient>
                          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d97706" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#d97706" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tickLine={false} stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Area name="총 페이지 뷰 (PV)" type="monotone" dataKey="pv" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                        <Area name="고유 방문자 (UV)" type="monotone" dataKey="uv" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">데이터를 집계하고 있습니다...</div>
                  )}
                </div>
              </div>

              {/* 차트 2: 카테고리별 클릭 점유 피라미드 */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                  <div>
                    <h3 className="font-serif font-bold text-slate-900 text-sm">카테고리 학리별 열람 점유</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-light">가장 많은 호응과 고찰 요청이 이어진 주제별 상대 점유 분포</p>
                  </div>
                  <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-mono font-semibold">실제 누적량</span>
                </div>
                
                <div className="h-64 w-full text-[10px]">
                  {analyticsData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.categoryClicks}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="categoryName" stroke="#94a3b8" tickLine={false} />
                        <YAxis stroke="#94a3b8" tickLine={false} />
                        <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                        <Bar name="열람 클릭수" dataKey="clicks" radius={[4, 4, 0, 0]}>
                          {analyticsData.categoryClicks.map((entry, index) => {
                            const colors = ['#7c2d12', '#9a3412', '#c2410c', '#ea580c', '#f97316', '#fb923c'];
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">학문 연산을 수행하고 있습니다...</div>
                  )}
                </div>
              </div>

            </div>

            {/* Two blocks detail widget */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              
              {/* Box 1: Recent articles status table */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-serif font-bold text-slate-900 text-sm">최근 작성 / 변경된 명리 수첩</h3>
                  <button
                    onClick={() => setActiveTab('posts')}
                    className="text-xs text-indigo-600 hover:underline font-semibold"
                  >
                    글 목록 바로가기
                  </button>
                </div>

                <div className="divide-y divide-slate-100 flex flex-col">
                  {posts.slice(0, 4).map(p => (
                    <div key={p.id} className="py-2.5 flex justify-between items-center text-xs gap-3">
                      <span className="font-medium text-slate-800 truncate max-w-xs">{p.title}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                          p.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {p.status === 'published' ? '발행됨' : '초안'}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">{p.updateDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2: Quick links overview */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <h3 className="font-serif font-bold text-slate-900 text-sm">신속 운영 기능 바로가기</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <button
                    onClick={handleCreateNewPost}
                    className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border text-left flex flex-col justify-between"
                  >
                    <span className="text-amber-600">+ 새 일반 글</span>
                    <span className="text-[10px] text-slate-400 font-light mt-1">15편 도서 가이드 확장용</span>
                  </button>
                  <button
                    onClick={handleCreateNewColumn}
                    className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg border text-left flex flex-col justify-between"
                  >
                    <span className="text-amber-600">+ 새 대표 에세이</span>
                    <span className="text-[10px] text-slate-400 font-light mt-1">수필집 첩 추가</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== B. GENERAL POSTS CRUD VIEW ==================== */}
        {activeTab === 'posts' && !editingPost && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-serif font-bold text-slate-900">학술 정보 콘텐츠 관리 ({posts.length})</h1>
                <p className="text-xs text-slate-500 mt-1">공방에 올라갈 정통 명리론 입문 문서를 추가, 편집, 삭제합니다.</p>
              </div>
              <button
                onClick={handleCreateNewPost}
                className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <Plus size={14} /> 새 명리 글 작성
              </button>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b font-semibold text-slate-600 select-none">
                  <tr>
                    <th className="p-4">제목 (슬러그)</th>
                    <th className="p-4">카테고리</th>
                    <th className="p-4">추천글</th>
                    <th className="p-4">상태</th>
                    <th className="p-4">날짜</th>
                    <th className="p-4 text-center">동작</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-[11px] sm:text-xs">
                  {posts.map(p => {
                    const cat = categories.find(c => c.id === p.category);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-4">
                          <span className="font-semibold block text-slate-800">{p.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">slug: {p.slug}</span>
                        </td>
                        <td className="p-4 text-slate-550">{cat ? cat.name.split(' (')[0] : p.category}</td>
                        <td className="p-4">
                          {p.isFeatured ? (
                            <span className="text-amber-600 font-bold">★ 추천</span>
                          ) : (
                            <span className="text-slate-300">일반</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            p.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {p.status === 'published' ? '발행됨' : '초안'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 font-mono">{p.updateDate}</td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditPost(p)}
                              className="p-1 px-2 text-slate-600 border rounded hover:text-indigo-600 hover:bg-slate-50 font-medium"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDeletePost(p.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== C. COLUMNS CRUD VIEW ==================== */}
        {activeTab === 'columns' && !editingColumn && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-serif font-bold text-slate-900">대표자 에세이 칼럼 수필집 관리 ({columns.length})</h1>
                <p className="text-xs text-slate-500 mt-1">대표 함경선의 수조 관찰 철학이 담긴 칼럼 글을 추가하거나 변경합니다.</p>
              </div>
              <button
                onClick={handleCreateNewColumn}
                className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <Plus size={14} /> 새 칼럼 작성
              </button>
            </div>

            {/* List Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b font-semibold text-slate-600 select-none">
                  <tr>
                    <th className="p-4">칼럼 제목 (슬러그)</th>
                    <th className="p-4">저자</th>
                    <th className="p-4">상태</th>
                    <th className="p-4">날짜</th>
                    <th className="p-4 text-center">동작</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-[11px] sm:text-xs">
                  {columns.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <span className="font-semibold block text-slate-800">{c.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">slug: {c.slug}</span>
                      </td>
                      <td className="p-4 font-semibold text-amber-750">{c.author}</td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          c.status === 'published' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.status === 'published' ? '발행됨' : '초안'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 font-mono">{c.updateDate}</td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditColumn(c)}
                            className="p-1 px-2 text-slate-600 border rounded hover:text-amber-600 hover:bg-slate-50 font-medium"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteColumn(c.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== D. EDITING FORMS BLOCK ==================== */}

        {/* 1. EDIT GENERAL POST FORM */}
        {editingPost && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6 animate-fade-in max-w-4xl">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="font-serif text-lg font-bold text-slate-900">
                {isCreatingNew ? '새로운 명리학 학술 글 작성' : '기존 명리 가이드 편집 변경'}
              </h2>
              <button
                onClick={() => setEditingPost(null)}
                className="text-xs text-slate-400 hover:text-slate-800"
              >
                닫기(취소)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold mb-1">* 글 제목</label>
                <input
                  type="text"
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost(p => ({ ...p, title: e.target.value }))}
                  className="w-full text-xs border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">* 고유 주소명 (Slug - 검색엔진 친화영어)</label>
                <input
                  type="text"
                  value={editingPost.slug || ''}
                  onChange={(e) => setEditingPost(p => ({ ...p, slug: e.target.value }))}
                  className="w-full text-xs border rounded p-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">설명형 서브타이틀</label>
                <input
                  type="text"
                  value={editingPost.subtitle || ''}
                  onChange={(e) => setEditingPost(p => ({ ...p, subtitle: e.target.value }))}
                  className="w-full text-xs border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">* 매칭 카테고리</label>
                <select
                  value={editingPost.category || ''}
                  onChange={(e) => setEditingPost(p => ({ ...p, category: e.target.value }))}
                  className="w-full text-xs border rounded p-2"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">검색엔진 최적 요합(Summary)</label>
                <input
                  type="text"
                  value={editingPost.summary || ''}
                  onChange={(e) => setEditingPost(p => ({ ...p, summary: e.target.value }))}
                  className="w-full text-xs border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">최종 개정 날짜</label>
                <input
                  type="text"
                  value={editingPost.updateDate || ''}
                  onChange={(e) => setEditingPost(p => ({ ...p, updateDate: e.target.value }))}
                  className="w-full text-xs border rounded p-2 font-mono"
                />
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-xs font-semibold mb-1">* 글 본문 에디팅 (paragraphs / ### 1단계 로 표시)</label>
              <textarea
                value={editingPost.content || ''}
                onChange={(e) => setEditingPost(p => ({ ...p, content: e.target.value }))}
                rows={10}
                className="w-full text-xs border rounded p-3 font-mono leading-relaxed focus:bg-white"
              ></textarea>
            </div>

            {/* Sub datasets list editing (checklist, mistakes) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">주의할 오해 행정들 (Mistakes)</label>
                <div className="space-y-1">
                  {editingPost.mistakes?.map((m, i) => (
                    <div key={i} className="flex gap-2 items-center text-[10px] text-slate-500">
                      <span>• {m}</span>
                      <button
                        onClick={() => setEditingPost(p => ({ ...p, mistakes: p.mistakes?.filter((_, index) => index !== i) }))}
                        className="text-rose-500 hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={currentMistake}
                    onChange={(e) => setCurrentMistake(e.target.value)}
                    placeholder="주의 오해 추가"
                    className="w-full text-[11px] border rounded p-1 bg-white"
                  />
                  <button
                    onClick={() => {
                      if (currentMistake.trim()) {
                        setEditingPost(p => ({ ...p, mistakes: [...(p.mistakes || []), currentMistake.trim()] }));
                        setCurrentMistake('');
                      }
                    }}
                    type="button"
                    className="px-2 py-1 bg-slate-800 text-white rounded text-[10px]"
                  >
                    추가
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">이건 챙기자 체크리스트 (Checklist)</label>
                <div className="space-y-1">
                  {editingPost.checklist?.map((c, i) => (
                    <div key={i} className="flex gap-2 items-center text-[10px] text-slate-500">
                      <span>• {c}</span>
                      <button
                        onClick={() => setEditingPost(p => ({ ...p, checklist: p.checklist?.filter((_, index) => index !== i) }))}
                        className="text-rose-500 hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={currentChecklist}
                    onChange={(e) => setCurrentChecklist(e.target.value)}
                    placeholder="체크사항 추가"
                    className="w-full text-[11px] border rounded p-1 bg-white"
                  />
                  <button
                    onClick={() => {
                      if (currentChecklist.trim()) {
                        setEditingPost(p => ({ ...p, checklist: [...(p.checklist || []), currentChecklist.trim()] }));
                        setCurrentChecklist('');
                      }
                    }}
                    type="button"
                    className="px-2 py-1 bg-slate-800 text-white rounded text-[10px]"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>

            {/* Post Thumbnail Image Attachment */}
            <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50 space-y-4">
              <span className="text-[11px] text-amber-600 font-bold uppercase tracking-wider block font-mono">
                ★ 대표 이미지 첨부 (Cover / Thumbnail Image)
              </span>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="h-20 w-20 shrink-0 flex items-center justify-center border border-slate-200 bg-white rounded-lg overflow-hidden relative group">
                  {editingPost.thumbnail ? (
                    <img 
                      src={editingPost.thumbnail} 
                      alt="Thumbnail Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium text-center">첨부 이미지<br />없음</span>
                  )}
                </div>

                <div className="flex-1 space-y-1.5 w-full text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <label className="cursor-pointer bg-[#0B2240] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-opacity-90 active:scale-95 transition-all inline-block shadow-3xs">
                      이미지 업로드 (Attach File)
                      <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingPost(p => ({ ...p!, thumbnail: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {editingPost.thumbnail && (
                      <button
                        type="button"
                        onClick={() => setEditingPost(p => ({ ...p!, thumbnail: '' }))}
                        className="border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded text-xs font-medium transition-all active:scale-95"
                      >
                        이미지 제거 (Remove)
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-light font-sans">
                    글 상단 및 목록 썸네일에 노출될 이미지를 등록합니다. 드래그 앤 드롭 업로드도 지원됩니다. (최대 1.5MB)
                  </p>
                </div>
              </div>

              {/* Drag and drop zone */}
              <div 
                className="border border-dashed border-slate-200 hover:border-amber-400 rounded-md p-3 text-center cursor-pointer transition-all bg-white hover:bg-amber-50/10"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditingPost(p => ({ ...p!, thumbnail: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              >
                <span className="text-[10px] text-slate-500 font-medium font-sans">
                  이곳에 이미지 파일을 드랍해도 글대표 이미지가 업로드됩니다. (Drag & Drop here)
                </span>
              </div>
            </div>

            {/* Checkbox and selects */}
            <div className="flex flex-wrap items-center gap-6 border-t pt-4">
              <label className="flex items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={editingPost.isFeatured || false}
                  onChange={(e) => setEditingPost(p => ({ ...p, isFeatured: e.target.checked }))}
                />
                사주공방 추천 글 목록에 노출함
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">글 발행 상태:</span>
                <select
                  value={editingPost.status || 'draft'}
                  onChange={(e) => setEditingPost(p => ({ ...p, status: e.target.value as 'published' | 'draft' }))}
                  className="text-xs border rounded p-1.5"
                >
                  <option value="draft">초안 (임시보관)</option>
                  <option value="published">공식 발행 (Published)</option>
                </select>
              </div>
            </div>

            {/* Saving Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 border rounded text-xs text-slate-500 hover:bg-slate-55"
              >
                닫기
              </button>
              <button
                onClick={handleSavePost}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded flex items-center gap-1.5"
              >
                <Save size={14} /> 글 저장 보관하기
              </button>
            </div>
          </div>
        )}

        {/* 2. EDIT OPERATOR COLUMN FORM */}
        {editingColumn && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6 animate-fade-in max-w-4xl">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="font-serif text-lg font-bold text-slate-900">
                {isCreatingNew ? '새로운 함경선 대표 칼럼 작성' : '대표 에세이 칼럼 편집 변경'}
              </h2>
              <button
                onClick={() => setEditingColumn(null)}
                className="text-xs text-slate-400 hover:text-slate-800"
              >
                취소
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold mb-1">* 칼럼 제목</label>
                <input
                  type="text"
                  value={editingColumn.title || ''}
                  onChange={(e) => setEditingColumn(c => ({ ...c, title: e.target.value }))}
                  className="w-full text-xs border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">* 고유 주소명 (Slug - 영어)</label>
                <input
                  type="text"
                  value={editingColumn.slug || ''}
                  onChange={(e) => setEditingColumn(c => ({ ...c, slug: e.target.value }))}
                  className="w-full text-xs border rounded p-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">칼럼 서브타이틀</label>
                <input
                  type="text"
                  value={editingColumn.subtitle || ''}
                  onChange={(e) => setEditingColumn(c => ({ ...c, subtitle: e.target.value }))}
                  className="w-full text-xs border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">저자</label>
                <input
                  type="text"
                  value={editingColumn.author || ''}
                  disabled
                  className="w-full text-xs border rounded p-2 bg-slate-50 text-slate-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1">독자 요약 (Summary)</label>
                <input
                  type="text"
                  value={editingColumn.summary || ''}
                  onChange={(e) => setEditingColumn(c => ({ ...c, summary: e.target.value }))}
                  className="w-full text-xs border rounded p-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1">집필 메모 / 개인 성찰 관점 (Notes - 칼럼 우대요소)</label>
                <input
                  type="text"
                  value={editingColumn.notes || ''}
                  placeholder="예: 현대의 무분별한 뜬구름 잡기 삼삼재 미신 가십을 성토하기 위해..."
                  onChange={(e) => setEditingColumn(c => ({ ...c, notes: e.target.value }))}
                  className="w-full text-xs border border-amber-200 rounded p-2 bg-amber-50/20"
                />
              </div>
            </div>

            {/* Column Body content */}
            <div>
              <label className="block text-xs font-semibold mb-1">* 칼럼 에세이 본문 (paragraphs / ### ─ 타이틀 ─ 로 표시)</label>
              <textarea
                value={editingColumn.content || ''}
                onChange={(e) => setEditingColumn(c => ({ ...c, content: e.target.value }))}
                rows={12}
                className="w-full text-xs border rounded p-3 font-serif leading-relaxed"
              ></textarea>
            </div>

            {/* Column Thumbnail Image Attachment */}
            <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50 space-y-4">
              <span className="text-[11px] text-amber-600 font-bold uppercase tracking-wider block font-mono">
                ★ 대표 이미지 첨부 (Column Thumbnail / Illustration Image)
              </span>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="h-20 w-20 shrink-0 flex items-center justify-center border border-slate-200 bg-white rounded-lg overflow-hidden relative group">
                  {editingColumn.thumbnail ? (
                    <img 
                      src={editingColumn.thumbnail} 
                      alt="Column Thumbnail Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium text-center">첨부 이미지<br />없음</span>
                  )}
                </div>

                <div className="flex-1 space-y-1.5 w-full text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <label className="cursor-pointer bg-[#0B2240] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-opacity-90 active:scale-95 transition-all inline-block shadow-3xs">
                      이미지 업로드 (Attach Column Image)
                      <input 
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingColumn(c => ({ ...c!, thumbnail: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {editingColumn.thumbnail && (
                      <button
                        type="button"
                        onClick={() => setEditingColumn(c => ({ ...c!, thumbnail: '' }))}
                        className="border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded text-xs font-medium transition-all active:scale-95"
                      >
                        이미지 제거 (Remove)
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-light font-sans">
                    사주 수필 칼럼 상단에 아름답게 노출될 기풍 서린 이미지를 등록합니다. 드래그 앤 드롭 업로드도 지원됩니다. (최대 1.5MB)
                  </p>
                </div>
              </div>

              {/* Drag and drop zone */}
              <div 
                className="border border-dashed border-slate-200 hover:border-amber-400 rounded-md p-3 text-center cursor-pointer transition-all bg-white hover:bg-amber-50/10"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditingColumn(c => ({ ...c!, thumbnail: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              >
                <span className="text-[10px] text-slate-500 font-medium font-sans">
                  이곳에 이미지 파일을 드랍해도 칼럼 대표 이미지가 업로드됩니다. (Drag & Drop here)
                </span>
              </div>
            </div>

            {/* Post status and actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">칼럼 발행상태:</span>
                <select
                  value={editingColumn.status || 'draft'}
                  onChange={(e) => setEditingColumn(c => ({ ...c, status: e.target.value as 'published' | 'draft' }))}
                  className="text-xs border rounded p-1.5"
                >
                  <option value="draft">초안 보존 (Draft)</option>
                  <option value="published">공식 에세이 발행 (Published)</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingColumn(null)}
                  className="px-4 py-2 border rounded text-xs text-slate-500 hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveColumn}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  칼럼 저장 보관하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== E. CATEGORIES & MENU ITEMS LIST VIEW ==================== */}
        {activeTab === 'categories' && (
          <div className="space-y-12 animate-fade-in max-w-6xl">
            
            {/* 상단 통합 안내 */}
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-xl font-serif font-bold text-slate-900">카테고리 및 상단 페이지 메뉴 권한 설정</h1>
              <p className="text-xs text-slate-500 mt-1">
                사주공방의 학술 분류 기둥(카테고리) 및 방문객이 열람하는 상단 헤더 메뉴의 순서와 추가/변경을 총괄합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Categories management (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-200 rounded-sm">
                  <div>
                    <h2 className="text-xs uppercase font-serif font-black text-amber-700 tracking-wider">
                      학술 분류 카테고리 구성 ({categories.length})
                    </h2>
                    <p className="text-[10px] text-slate-400 mt-0.5">명리 연구서 및 칼럼 연결의 핵심 뼈대입니다.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCatOpen(!newCatOpen);
                      setEditingCatId(null);
                      setCatForm({ id: '', name: '', description: '', slug: '' });
                    }}
                    className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                  >
                    <Plus size={12} />
                    {newCatOpen ? '입력 닫기' : '새 카테고리 추가'}
                  </button>
                </div>

                {/* Category Adding/Editing Form */}
                {(newCatOpen || editingCatId) && (
                  <form
                    onSubmit={handleSaveCategory}
                    className="bg-amber-50/15 border border-amber-200 rounded p-4 space-y-3.5"
                  >
                    <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block font-mono">
                      {editingCatId ? '★ 카테고리 내용 수정 중' : '★ 신규 학술 카테고리 등록'}
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">카테고리 고유 ID *</label>
                        <input
                          type="text"
                          disabled={!!editingCatId}
                          placeholder="예: ten-gods"
                          value={catForm.id}
                          onChange={(e) => setCatForm(prev => ({ ...prev, id: e.target.value }))}
                          className="w-full text-xs border rounded p-2 bg-white disabled:bg-slate-100 placeholder:text-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">카테고리 슬러그 (URL용) *</label>
                        <input
                          type="text"
                          placeholder="예: ten-gods"
                          value={catForm.slug}
                          onChange={(e) => setCatForm(prev => ({ ...prev, slug: e.target.value }))}
                          className="w-full text-xs border rounded p-2 bg-white placeholder:text-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">카테고리 한글 전시명 *</label>
                      <input
                        type="text"
                        placeholder="예: 십성론 (十星論)"
                        value={catForm.name}
                        onChange={(e) => setCatForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full text-xs border rounded p-2 bg-white placeholder:text-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">학술 배경 설명란</label>
                      <textarea
                        rows={2}
                        placeholder="카테고리를 대별하는 깊이 있는 설명을 입력하세요."
                        value={catForm.description}
                        onChange={(e) => setCatForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full text-xs border rounded p-2 bg-white placeholder:text-slate-300"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-amber-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatId(null);
                          setNewCatOpen(false);
                        }}
                        className="px-2.5 py-1 text-slate-500 text-xs hover:bg-slate-100 rounded"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800"
                      >
                        {editingCatId ? '변경 사항 적용' : '카테고리 등록'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Categories List */}
                <div className="space-y-3">
                  {categories.map((c, idx) => {
                    const count = posts.filter(p => p.category === c.id).length;
                    return (
                      <div
                        key={c.id}
                        className="bg-white p-4 border border-slate-200 rounded shadow-3xs flex flex-col justify-between"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-serif font-bold text-slate-900 text-sm leading-tight">{c.name}</h3>
                              <span className="text-[8px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono">
                                {count}편 연결됨
                              </span>
                            </div>
                            <p className="text-slate-400 text-[8.5px] font-mono mt-0.5">ID: {c.id} &nbsp;|&nbsp; 슬러그: {c.slug}</p>
                            <p className="text-slate-500 text-[11px] font-light leading-relaxed mt-2 block">
                              {c.description}
                            </p>
                          </div>

                          {/* Reordering and Editing controls */}
                          <div className="flex flex-col gap-1 shrink-0">
                            <div className="flex gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveCategory(idx, 'up')}
                                className="p-1 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded disabled:opacity-30 disabled:pointer-events-none"
                                title="위로 이동"
                              >
                                <ArrowUp size={11} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === categories.length - 1}
                                onClick={() => handleMoveCategory(idx, 'down')}
                                className="p-1 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded disabled:opacity-30 disabled:pointer-events-none"
                                title="아래로 이동"
                              >
                                <ArrowDown size={11} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCatId(c.id);
                                setNewCatOpen(false);
                                setCatForm({
                                  id: c.id,
                                  name: c.name,
                                  description: c.description,
                                  slug: c.slug
                                });
                              }}
                              className="px-1.5 py-0.5 border border-amber-300 text-amber-700 hover:bg-amber-50 rounded text-[9px] leading-none text-center font-bold"
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(c.id)}
                              className="px-1.5 py-0.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded text-[9px] leading-none text-center font-bold"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>


              {/* Right Column: Page Menu configuration (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex justify-between items-center bg-slate-50 p-4 border border-slate-200 rounded-sm">
                  <div>
                    <h2 className="text-xs uppercase font-serif font-black text-amber-700 tracking-wider">
                      상단 네비게이션 메뉴 구성 ({menuItems.length})
                    </h2>
                    <p className="text-[10px] text-slate-400 mt-0.5">상단 헤더에 보일 페이지 탭을 관리합니다.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewMenuOpen(!newMenuOpen);
                      setEditingMenuId(null);
                      setMenuForm({ id: '', name: '', path: '' });
                    }}
                    className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                  >
                    <Plus size={12} />
                    {newMenuOpen ? '닫기' : '메뉴 추가'}
                  </button>
                </div>

                {/* MenuItem Adding/Editing Form */}
                {(newMenuOpen || editingMenuId) && (
                  <form
                    onSubmit={handleSaveMenuItem}
                    className="bg-amber-50/15 border border-amber-200 rounded p-4 space-y-3.5"
                  >
                    <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block font-mono">
                      {editingMenuId ? '★ 메뉴 항목 수정 중' : '★ 신규 상단 메뉴 추가'}
                    </span>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">메뉴 표시 이름 *</label>
                      <input
                        type="text"
                        placeholder="예: 상담 가이드"
                        value={menuForm.name}
                        onChange={(e) => setMenuForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full text-xs border rounded p-2 bg-white placeholder:text-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">전시 페이지 경로 (Path) *</label>
                      <input
                        type="text"
                        placeholder="예: home, columns, categories, about, contact 또는 custom"
                        value={menuForm.path}
                        onChange={(e) => setMenuForm(prev => ({ ...prev, path: e.target.value }))}
                        className="w-full text-xs border rounded p-2 bg-white placeholder:text-slate-300"
                      />
                      
                      {/* Quick recommendations helper */}
                      <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[8px] text-slate-400 block font-sans mr-1">빠른 추천:</span>
                        {[
                          { label: '홈', path: 'home' },
                          { label: '에세이', path: 'columns' },
                          { label: '카테고리', path: 'categories' },
                          { label: '소개', path: 'about' },
                          { label: '상담가', path: 'author' },
                          { label: '문의', path: 'contact' }
                        ].map((rec, rIdx) => (
                          <button
                            key={rIdx}
                            type="button"
                            onClick={() => setMenuForm(prev => ({ ...prev, path: rec.path, name: prev.name || rec.label }))}
                            className="bg-slate-50 hover:bg-amber-50 text-slate-600 border border-slate-200 hover:border-amber-500 rounded px-1.5 py-0.5 text-[8.5px] transition"
                          >
                            {rec.label} ({rec.path})
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-amber-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMenuId(null);
                          setNewMenuOpen(false);
                        }}
                        className="px-2.5 py-1 text-slate-500 text-xs hover:bg-slate-100 rounded"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800"
                      >
                        {editingMenuId ? '변경 사항 적용' : '메뉴 추가 완료'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Menu Items List */}
                <div className="bg-white border border-slate-200 rounded overflow-hidden">
                  <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500 flex justify-between items-center">
                    <span>순서별 현재 등록된 상단 메뉴 탭</span>
                    <span>위치 변경 / 컨트롤</span>
                  </div>
                  
                  {menuItems.length === 0 ? (
                    <p className="p-4 text-xs text-slate-400 text-center font-light leading-relaxed">등록된 메뉴 탭이 비어있습니다.</p>
                  ) : (
                    <div className="divide-y divide-slate-150">
                      {menuItems.map((m, idx) => (
                        <div
                          key={m.id}
                          className="p-3 hover:bg-slate-50/40 transition flex justify-between items-center gap-3"
                        >
                          <div>
                            <span className="inline-block text-[10px] w-4 text-slate-400 font-mono font-bold leading-none">{idx + 1}</span>
                            <span className="font-serif font-black text-slate-900 text-xs tracking-tight">{m.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono ml-2 border border-slate-100 px-1 py-0.5 bg-slate-50 rounded">
                              /{m.path}
                            </span>
                          </div>

                          <div className="flex gap-1 shrink-0 items-center">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveMenuItem(idx, 'up')}
                              className="p-1 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded disabled:opacity-30 disabled:pointer-events-none"
                              title="위로 이동"
                            >
                              <ArrowUp size={11} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === menuItems.length - 1}
                              onClick={() => handleMoveMenuItem(idx, 'down')}
                              className="p-1 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded disabled:opacity-30 disabled:pointer-events-none"
                              title="아래로 이동"
                            >
                              <ArrowDown size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMenuId(m.id);
                                setNewMenuOpen(false);
                                setMenuForm({ id: m.id, name: m.name, path: m.path });
                              }}
                              className="px-1.5 py-0.5 border border-amber-300 text-amber-700 hover:bg-amber-50 rounded text-[9px] leading-none text-center font-bold"
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMenuItem(m.id)}
                              className="px-1.5 py-0.5 border border-rose-300 text-rose-700 hover:bg-rose-50 rounded text-[9px] leading-none text-center font-bold"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== F. SITE SETTINGS VIEW ==================== */}
        {activeTab === 'settings' && siteConfig && (
          <div className="space-y-6 max-w-3xl animate-fade-in">
            <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h1 className="text-xl font-serif font-bold text-slate-900">사주공방 대표 사이트 설정</h1>
                <p className="text-xs text-slate-500 mt-1">상호, 이메일, 대표자 정보 및 노출 색상을 한 데 모아 수정합니다.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">* 서비스명</label>
                  <input
                    type="text"
                    value={siteConfig.siteName}
                    onChange={(e) => setSiteConfig(c => ({ ...c!, siteName: e.target.value }))}
                    className="w-full text-xs border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">* 대표자/운영자 성명</label>
                  <input
                    type="text"
                    value={siteConfig.ownerName}
                    onChange={(e) => setSiteConfig(c => ({ ...c!, ownerName: e.target.value, ownerNameReal: e.target.value }))}
                    className="w-full text-xs border rounded p-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">한줄 간판 태그라인 (Tagline)</label>
                  <input
                    type="text"
                    value={siteConfig.tagline}
                    onChange={(e) => setSiteConfig(c => ({ ...c!, tagline: e.target.value }))}
                    className="w-full text-xs border rounded p-2"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1">대표자 신조 바이오 (Bio)</label>
                  <textarea
                    value={siteConfig.ownerBio}
                    rows={3}
                    onChange={(e) => setSiteConfig(c => ({ ...c!, ownerBio: e.target.value }))}
                    className="w-full text-xs border rounded p-2 font-light leading-relaxed"
                  ></textarea>
                </div>

                {/* 홈페이지 히어로 핵심 문구 및 배경 이미지 설정 */}
                <div className="sm:col-span-2 bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-4">
                  <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block font-mono">
                    ★ 홈페이지 대간판(Hero) 핵심 문구 및 대표 이미지 설정 (Home Hero Customization)
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">히어로 제목 (Hero Title)</label>
                      <input
                        type="text"
                        value={siteConfig.homeHeroTitle || ''}
                        onChange={(e) => setSiteConfig(c => ({ ...c!, homeHeroTitle: e.target.value }))}
                        className="w-full text-xs border rounded p-2"
                        placeholder="당신의 생년월일시,"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">히어로 부제목 (Hero Subtitle)</label>
                      <input
                        type="text"
                        value={siteConfig.homeHeroSubtitle || ''}
                        onChange={(e) => setSiteConfig(c => ({ ...c!, homeHeroSubtitle: e.target.value }))}
                        className="w-full text-xs border rounded p-2"
                        placeholder="우주가 프로그래밍한 코드"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold mb-1">히어로 버튼 텍스트 (Hero Button Text)</label>
                      <input
                        type="text"
                        value={siteConfig.homeHeroButtonText || ''}
                        onChange={(e) => setSiteConfig(c => ({ ...c!, homeHeroButtonText: e.target.value }))}
                        className="w-full text-xs border rounded p-2"
                        placeholder="사주 정보 탐색하기"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-xs font-semibold mb-1">히어로 대표 우측/전시 이미지 첨부 (Hero Banner Image)</label>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-slate-300 rounded-lg bg-white shadow-3xs">
                        <div className="h-16 w-24 shrink-0 flex items-center justify-center border border-slate-200 bg-slate-50 rounded-lg overflow-hidden relative group">
                          {siteConfig.homeHeroImage ? (
                            <img 
                              src={siteConfig.homeHeroImage} 
                              alt="Hero Preview" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">No Image</span>
                          )}
                        </div>

                        <div className="flex-1 space-y-1.5 w-full text-center sm:text-left">
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <label className="cursor-pointer bg-[#0B2240] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-opacity-90 active:scale-95 transition-all inline-block shadow-3xs">
                              파일 선택 (Choose Hero Image)
                              <input 
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setSiteConfig(c => ({ ...c!, homeHeroImage: reader.result as string }));
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>

                            {siteConfig.homeHeroImage && (
                              <button
                                type="button"
                                onClick={() => setSiteConfig(c => ({ ...c!, homeHeroImage: '' }))}
                                className="border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-medium transition-all active:scale-95"
                              >
                                이미지 제거 (Delete)
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-light font-sans">
                            홈페이지 히어로 영역 우측에 아름답게 수필처럼 합성되어 노출될 가로형/오행 이미지를 등록합니다. (최대 1.5MB)
                          </p>
                        </div>
                      </div>

                      {/* drag and drop support */}
                      <div 
                        className="border border-dashed border-slate-200 hover:border-amber-400 rounded-lg p-3 text-center cursor-pointer transition-all bg-white hover:bg-amber-50/20"
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file && file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setSiteConfig(c => ({ ...c!, homeHeroImage: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      >
                        <span className="text-[10px] text-slate-500 font-medium font-sans">
                          여기에 이미지 파일을 드래그하여 드롭해도 대표 이미지가 등록됩니다. (Drag & Drop here)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 상단 헤더 로고 커스터마이징 */}
                <div className="sm:col-span-2 bg-slate-50 p-4 border border-slate-200 rounded-lg space-y-4">
                  <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block font-mono">
                    ★ 상단 대표 로고 디자인 설정 (Brand Logo Customization)
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">로고 표현 방식 (Logo Mode)</label>
                      <select
                        value={siteConfig.logoMode || 'traditional'}
                        onChange={(e) => setSiteConfig(c => ({ ...c!, logoMode: e.target.value as any }))}
                        className="w-full text-xs border rounded p-2 bg-white"
                      >
                        <option value="traditional">정통 문양 (Hanok / Moon 일러스트)</option>
                        <option value="text">이니셜 텍스트형 (Text Wordmark)</option>
                        <option value="emoji">엠블럼 이모지형 (Iconic Emoji)</option>
                        <option value="image">이미지 직접 등록형 (Custom Image Upload)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">로고 전용 컬러 (Logo Primary Color)</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={siteConfig.logoColor || '#0B2240'}
                          onChange={(e) => setSiteConfig(c => ({ ...c!, logoColor: e.target.value }))}
                          className="h-8 w-8 cursor-pointer rounded border border-slate-300 p-0 shadow-3xs"
                        />
                        <input
                          type="text"
                          value={siteConfig.logoColor || '#0B2240'}
                          onChange={(e) => setSiteConfig(c => ({ ...c!, logoColor: e.target.value }))}
                          className="w-full text-xs font-mono border rounded p-1.5"
                          placeholder="#0B2240"
                        />
                      </div>
                    </div>

                    {siteConfig.logoMode === 'text' && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold mb-1">로고 표기 문구 (최대 4글자 권장)</label>
                        <input
                          type="text"
                          value={siteConfig.logoText || ''}
                          onChange={(e) => setSiteConfig(c => ({ ...c!, logoText: e.target.value }))}
                          className="w-full text-xs border rounded p-2"
                          placeholder="공방"
                          maxLength={10}
                        />
                        <p className="text-[10px] text-slate-400 mt-1 font-light">지반의 테두리와 함께 표기되는 단어입니다.</p>
                      </div>
                    )}

                    {siteConfig.logoMode === 'emoji' && (
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold mb-1">로고 대체용 국악/천문 이모지</label>
                        <input
                          type="text"
                          value={siteConfig.logoEmoji || ''}
                          onChange={(e) => setSiteConfig(c => ({ ...c!, logoEmoji: e.target.value }))}
                          className="w-full text-xs border rounded p-2 text-center text-lg"
                          placeholder="🏯"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {['🏯', '🌙', '🌌', '☀️', '☯️', '📜', '🎐', '🌲', '🏔️'].map(emo => (
                            <button
                              key={emo}
                              type="button"
                              onClick={() => setSiteConfig(c => ({ ...c!, logoEmoji: emo }))}
                              className={`p-1 border text-xs rounded hover:bg-slate-100 ${siteConfig.logoEmoji === emo ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white'}`}
                            >
                              {emo}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {siteConfig.logoMode === 'image' && (
                      <div className="sm:col-span-2 space-y-2">
                        <label className="block text-xs font-semibold mb-1">커스텀 로고 이미지 업로드 (Custom Logo Image)</label>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-slate-300 rounded-lg bg-white shadow-3xs">
                          {/* Image preview box */}
                          <div className="h-16 w-16 shrink-0 flex items-center justify-center border border-slate-200 bg-slate-50 rounded-lg overflow-hidden relative group">
                            {siteConfig.logoImage ? (
                              <img 
                                src={siteConfig.logoImage} 
                                alt="Logo Preview" 
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">No Image</span>
                            )}
                          </div>

                          {/* Controls */}
                          <div className="flex-1 space-y-1.5 w-full text-center sm:text-left">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              <label className="cursor-pointer bg-[#0B2240] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-opacity-90 active:scale-95 transition-all inline-block shadow-3xs">
                                파일 선택 (Choose File)
                                <input 
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setSiteConfig(c => ({ ...c!, logoImage: reader.result as string }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>

                              {siteConfig.logoImage && (
                                <button
                                  type="button"
                                  onClick={() => setSiteConfig(c => ({ ...c!, logoImage: '' }))}
                                  className="border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-medium transition-all active:scale-95"
                                >
                                  이미지 제거 (Delete)
                                </button>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-light">
                              가로세로 비율이 1:1에 가까운 투명(PNG) 혹은 원형의 이미지를 권장합니다. (최대 1.5MB)
                            </p>
                          </div>
                        </div>

                        {/* drag and drop support */}
                        <div 
                          className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-lg p-4 text-center cursor-pointer transition-all bg-slate-50 hover:bg-amber-50/20"
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const file = e.dataTransfer.files?.[0];
                            if (file && file.type.startsWith('image/')) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setSiteConfig(c => ({ ...c!, logoImage: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        >
                          <span className="text-[11px] text-slate-500 font-medium">
                            여기에 이미지 파일을 드래그하여 놓아도 로고가 자동으로 등록됩니다. (Drag & Drop here)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">* 공식 문의 이메일</label>
                  <input
                    type="email"
                    value={siteConfig.contactEmail}
                    onChange={(e) => setSiteConfig(c => ({ ...c!, contactEmail: e.target.value }))}
                    className="w-full text-xs border rounded p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">주소</label>
                  <input
                    type="text"
                    value={siteConfig.address}
                    onChange={(e) => setSiteConfig(c => ({ ...c!, address: e.target.value }))}
                    className="w-full text-xs border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">사업자정보 상호(업체명)</label>
                  <input
                    type="text"
                    value={siteConfig.companyName}
                    onChange={(e) => setSiteConfig(c => ({ ...c!, companyName: e.target.value }))}
                    className="w-full text-xs border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">사업자등록번호</label>
                  <input
                    type="text"
                    value={siteConfig.businessNumber}
                    onChange={(e) => setSiteConfig(c => ({ ...c!, businessNumber: e.target.value }))}
                    className="w-full text-xs border rounded p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">통신판매업신고번호</label>
                  <input
                    type="text"
                    value={siteConfig.mailOrderNumber || ''}
                    onChange={(e) => setSiteConfig(c => ({ ...c!, mailOrderNumber: e.target.value }))}
                    className="w-full text-xs border rounded p-2 font-mono"
                    placeholder="예: 제 2026-서울노원-1234호 또는 노원 제1234"
                  />
                </div>

                <div className="sm:col-span-2 mt-6 pt-6 border-t border-slate-150">
                  <h3 className="font-serif font-black text-xs sm:text-sm text-slate-900 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles size={14} className="text-amber-500" />
                    실시간 지반 테마 칼라 설정 (Dynamic Brand Colors System)
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 mb-4 font-light leading-relaxed">
                    디자인 무결성을 지키며 주 테마 색상을 변경할 수 있습니다. 아래 엄선된 동양 철학 테마 프리셋을 클릭하여 즉각 적용하거나, 각각의 색상 값을 정밀하게 수동 오버라이드하여 아름다운 서체 기품을 탄생시켜 조화시킬 수 있습니다.
                  </p>

                  {/* 엄선된 전통 오행 색채 프리셋 (Aesthetics Color Palette Presets) */}
                  <div className="mb-6 bg-slate-50 p-4 border border-slate-200 rounded-sm">
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mb-3 font-mono flex items-center gap-1">
                      <Palette size={13} className="text-amber-500" />
                      오행 및 지적 만세력 테마 색채 꾸러미 (PRO-DESIGN COLOR PALETTES)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        {
                          name: '단향묵즙 (Signature Charcoal Ink)',
                          description: '단아한 모래 한지 바탕과 숯빛 묵즙이 빚은 디폴트 시그니처',
                          themeBg: '#FDFCF8',
                          themeText: '#2D2926',
                          themeAccent: '#7D5A50',
                          themeSecondary: '#8C8279',
                          themeBorder: '#E5E1D8',
                          themeWarm: '#F2EDE4',
                          themeWarmDeep: '#EAE5DB',
                          themeDark: '#2D2926',
                        },
                        {
                          name: '청송비취 (Bamboo Sage Garden)',
                          description: '목(木)의 청아한 바람과 안식을 대별하는 담백한 푸른 대숲색',
                          themeBg: '#F4F7F5',
                          themeText: '#1C2E24',
                          themeAccent: '#2D6A4F',
                          themeSecondary: '#587063',
                          themeBorder: '#D8E2DC',
                          themeWarm: '#E8F0EC',
                          themeWarmDeep: '#DCE6E1',
                          themeDark: '#1C2E24',
                        },
                        {
                          name: '자광유금 (Imperial Purple Majesty)',
                          description: '황금과 자줏빛의 궁합으로 귀인(貴人)의 번영을 불러오는 자안색',
                          themeBg: '#FAF6F8',
                          themeText: '#2C1A24',
                          themeAccent: '#8A2C5B',
                          themeSecondary: '#705565',
                          themeBorder: '#E8D5E0',
                          themeWarm: '#F4EBF0',
                          themeWarmDeep: '#EBDFE5',
                          themeDark: '#2C1A24',
                        },
                        {
                          name: '심연묵객 (Mystic Midnight Noir)',
                          description: '수(水)의 깊은 통찰력과 은묘한 은하수의 우주를 담은 고위도 다크색',
                          themeBg: '#121214',
                          themeText: '#ECE7E1',
                          themeAccent: '#CD9A2B',
                          themeSecondary: '#8F8B85',
                          themeBorder: '#2E2B2D',
                          themeWarm: '#1B191C',
                          themeWarmDeep: '#232125',
                          themeDark: '#ECE7E1',
                        },
                        {
                          name: '홍련화염 (Cinnabar Brick Red)',
                          description: '화(火)의 열정이자 따스함과 온기를 발포하는 활력적인 단토 적갈색',
                          themeBg: '#FDFBFA',
                          themeText: '#2A1F1D',
                          themeAccent: '#C13B22',
                          themeSecondary: '#8F7773',
                          themeBorder: '#F0E3E0',
                          themeWarm: '#F7ECE9',
                          themeWarmDeep: '#EED9D5',
                          themeDark: '#2A1F1D',
                        }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSiteConfig(c => {
                              if (!c) return c;
                              return {
                                ...c,
                                themeBg: preset.themeBg,
                                themeText: preset.themeText,
                                themeAccent: preset.themeAccent,
                                themeSecondary: preset.themeSecondary,
                                themeBorder: preset.themeBorder,
                                themeWarm: preset.themeWarm,
                                themeWarmDeep: preset.themeWarmDeep,
                                themeDark: preset.themeDark,
                              };
                            });
                            triggerStatus(`"${preset.name}" 색상 조합 테마가 입력란에 수혈되었습니다.`);
                          }}
                          className="text-left bg-white hover:bg-amber-50/20 border border-slate-200 hover:border-amber-500 rounded p-3 transition-all duration-150 group flex flex-col justify-between h-[104px]"
                        >
                          <div>
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-700 transition font-serif leading-tight">
                                {preset.name}
                              </span>
                            </div>
                            <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed scale-95 origin-left">{preset.description}</p>
                          </div>
                          
                          {/* Mini visual swatch indicator */}
                          <div className="flex gap-1 mt-2">
                            {[
                              { label: '배경', color: preset.themeBg },
                              { label: '글씨', color: preset.themeText },
                              { label: '요소', color: preset.themeAccent },
                              { label: '음영', color: preset.themeWarm }
                            ].map((sw, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex items-center gap-0.5 border border-slate-100 rounded px-1 py-0.5 bg-slate-50 text-[7px] font-mono shrink-0 shadow-3xs"
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full inline-block border border-black/10 shrink-0"
                                  style={{ backgroundColor: sw.color }}
                                />
                                <span className="text-slate-500 scale-90">{sw.label}</span>
                              </div>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 정밀 수동 입력 폼 색상 (Precision Color Parameter Inputs) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-bold mb-1">기본 배경색 (theme-bg)</label>
                      <input
                        type="text"
                        placeholder="#FAF7F2"
                        value={siteConfig.themeBg || ''}
                        onChange={(e) => setSiteConfig(c => ({ ...c!, themeBg: e.target.value }))}
                        className="w-full text-xs border rounded p-2 font-mono text-slate-800 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 font-bold mb-1">기본 텍스트색 (theme-text)</label>
                      <input
                        type="text"
                        placeholder="#2D2926"
                        value={siteConfig.themeText || ''}
                        onChange={(e) => setSiteConfig(c => ({ ...c!, themeText: e.target.value }))}
                        className="w-full text-xs border rounded p-2 font-mono text-slate-800 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 font-bold mb-1">대표 포인트 강렬색 (theme-accent)</label>
                      <input
                        type="text"
                        placeholder="#7D5A50"
                        value={siteConfig.themeAccent || ''}
                        onChange={(e) => setSiteConfig(c => ({ ...c!, themeAccent: e.target.value }))}
                        className="w-full text-xs border rounded p-2 font-mono text-slate-800 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 font-bold mb-1">설명 부제 회색 (theme-secondary)</label>
                      <input
                        type="text"
                        placeholder="#555555"
                        value={siteConfig.themeSecondary || ''}
                        onChange={(e) => setSiteConfig(c => ({ ...c!, themeSecondary: e.target.value }))}
                        className="w-full text-xs border rounded p-2 font-mono text-slate-800 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 font-bold mb-1">경계 테두리선 (theme-border)</label>
                      <input
                        type="text"
                        placeholder="#E5E1D8"
                        value={siteConfig.themeBorder || ''}
                        onChange={(e) => setSiteConfig(c => ({ ...c!, themeBorder: e.target.value }))}
                        className="w-full text-xs border rounded p-2 font-mono text-slate-800 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-600 font-bold mb-1">보조 배경 박스색 (theme-warm)</label>
                      <input
                        type="text"
                        placeholder="#FAF6F0"
                        value={siteConfig.themeWarm || ''}
                        onChange={(e) => setSiteConfig(c => ({ ...c!, themeWarm: e.target.value }))}
                        className="w-full text-xs border rounded p-2 font-mono text-slate-800 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* 실시간 뷰 미리보기 시뮬레이터 (LIVE BRAND EXPERIENCE PREVIEW MOCKUP) */}
                  <div className="border border-slate-200 rounded p-4 bg-slate-50/50">
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mb-2 font-mono flex items-center gap-1">
                      <Eye size={12} className="text-amber-500" />
                      실시간 디자인 컴포넌트 동경 미리보기 (VIRTUAL COMPONENT MOCKUP)
                    </span>
                    <p className="text-[9px] text-slate-400 mb-4 scale-95 origin-left leading-normal">
                      아래 미니어처 시판은 현재 조율 중인 색채 수치로 즉각 수렴하여 서체 및 가시성이 흐트러지는지 먼저 감정할 수 있도록 조력하는 시뮬레이터입니다.
                    </p>

                    {/* Simulation frame with dynamic bounding */}
                    <div
                      className="border rounded-sm p-4 text-left transition-all duration-350 shadow-xs max-w-2xl mx-auto"
                      style={{
                        backgroundColor: siteConfig.themeBg || '#FDFCF8',
                        borderColor: siteConfig.themeBorder || '#E5E1D8',
                        color: siteConfig.themeText || '#2D2926'
                      }}
                    >
                      {/* Mini navbar mockup */}
                      <div
                        className="flex justify-between items-center pb-2 border-b text-[8px] font-sans font-bold uppercase tracking-wider mb-3.5"
                        style={{ borderColor: siteConfig.themeBorder || '#E5E1D8' }}
                      >
                        <div className="flex items-center gap-1 font-serif">
                          <span
                            className="w-2 h-2 rounded-xs"
                            style={{ backgroundColor: siteConfig.themeAccent || '#7D5A50' }}
                          />
                          <span style={{ color: siteConfig.themeText || '#2D2926' }}>사주공방 미리보기</span>
                        </div>
                        <div className="flex gap-2.5" style={{ color: siteConfig.themeSecondary || '#8C8279' }}>
                          <span>홈</span>
                          <span>소개</span>
                          <span>고문칼럼</span>
                        </div>
                      </div>

                      {/* Content simulated body */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-2">
                          <div className="flex flex-wrap gap-1 items-center">
                            <span
                              className="text-[8px] px-1.5 py-0.5 rounded-xs font-bold border"
                              style={{
                                backgroundColor: siteConfig.themeWarm || '#F2EDE4',
                                borderColor: siteConfig.themeBorder || '#E5E1D8',
                                color: siteConfig.themeAccent || '#7D5A50'
                              }}
                            >
                              ★ 금주의 추천 에세이
                            </span>
                            <span className="text-[7.5px] scale-90 text-slate-400 font-mono">13분 전 칼날 교정</span>
                          </div>

                          <h4
                            className="font-serif font-black text-xs leading-snug sm:text-sm tracking-tight"
                            style={{ color: siteConfig.themeText || '#2D2926' }}
                          >
                            성격의 한랭함과 건조함을 메우는 조후(調候)론의 이치
                          </h4>

                          <p
                            className="text-[9.5px] leading-relaxed line-clamp-3 font-medium"
                            style={{ color: siteConfig.themeSecondary || '#8C8279' }}
                          >
                            사주의 수(水)가 범람하여 마음이 시베리아 빙벽처럼 차갑게 동결될 때는, 비난을 퍼붓는 신점보다는 목(木)과 화(火)의 온기 어린 성격을 체현하려 부드럽게 대화를 고치는 태도가 가장 맑은 개운 책략이 됩니다.
                          </p>
                        </div>

                        {/* Traditional styled mini board card widget */}
                        <div
                          className="border rounded-sm p-3 flex flex-col justify-between"
                          style={{
                            backgroundColor: siteConfig.themeWarm || '#F2EDE4',
                            borderColor: siteConfig.themeBorder || '#E5E1D8'
                          }}
                        >
                          <div className="space-y-1">
                            <h5
                              className="font-serif font-bold text-[10px] leading-tight"
                              style={{ color: siteConfig.themeText || '#2D2926' }}
                            >
                              대표 함경선 올림
                            </h5>
                            <p
                              className="text-[8.5px] leading-relaxed scale-95 origin-top-left text-justify font-semibold"
                              style={{ color: siteConfig.themeSecondary || '#8C8279' }}
                            >
                              액운과 저주를 멀리하십시오. 지혜로운 조율이 함께합니다.
                            </p>
                          </div>

                          <button
                            type="button"
                            className="w-full mt-2.5 py-1.5 rounded-xs text-[8px] font-bold tracking-wider text-center cursor-default shrink-0"
                            style={{
                              backgroundColor: siteConfig.themeAccent || '#7D5A50',
                              color: '#FFFFFF'
                            }}
                          >
                            조력 신청반 안내
                          </button>
                        </div>
                      </div>

                      {/* Mockup footer signature line */}
                      <p
                        className="mt-3.5 pt-2 border-t text-center text-[7.5px] font-black scale-95 origin-center font-sans tracking-wide"
                        style={{
                          borderColor: siteConfig.themeBorder || '#E5E1D8',
                          color: siteConfig.themeSecondary || '#8C8279'
                        }}
                      >
                        "인생의 세찬 눈망울 속에서, 따스하게 전등을 밝히고 순리를 마주하십시오."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 mt-6 pt-6 border-t border-slate-150 space-y-6">
                  <div>
                    <h3 className="font-serif font-black text-xs sm:text-sm text-slate-900 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                      <LayoutDashboard size={14} className="text-amber-500" />
                      전체 화면 모듈식 노출 제어 (Design Sections Modularization Control)
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-light leading-relaxed">
                      각 페이지별로 기획된 UI 요소와 서술 모듈의 표시 여부를 체크 박스로 즉각 활성/비활성화하여 개인 맞춤형 사이트로 슬림하게 변모시킵니다.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Home page toggles */}
                    <div className="bg-slate-50 p-4 rounded-sm border border-slate-200">
                      <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mb-3 font-mono">
                        홈페이지 뷰 섹션 제어 (Home View Modules)
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.homeShowHero !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, homeShowHero: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          히어로 환영 성채
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.homeShowPillars !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, homeShowPillars: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          3가지 핵심 신조
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.homeShowCategories !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, homeShowCategories: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          대표 학술 카테고리
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.homeShowSpotlight !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, homeShowSpotlight: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          필자 수필 스포트라이트
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.homeShowBioCard !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, homeShowBioCard: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          상단 함경선 명함 카드
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.homeShowRecentUpdates !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, homeShowRecentUpdates: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          최신 업데이트 정량 목록
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.homeShowWarningBanner !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, homeShowWarningBanner: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          안전 면책 철학 배너
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.homeShowCTA !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, homeShowCTA: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          과욕 타개 상담신청 푸터
                        </label>
                      </div>
                    </div>

                    {/* About page toggles */}
                    <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 space-y-3">
                      <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block font-mono">
                        브랜드 소개 뷰 섹션 제어 및 텍스트 (About View Settings)
                      </span>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 mb-2 border-b border-slate-100">
                        <div>
                          <label className="block text-[9px] text-slate-600 font-bold mb-1">대표 소개글 타이틀 커스텀</label>
                          <input
                            type="text"
                            placeholder="명리를 빌린 현대인의 수신서"
                            value={siteConfig.aboutTitle || ''}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, aboutTitle: e.target.value }))}
                            className="w-full text-xs border rounded p-1.5 focus:ring-1 focus:ring-amber-500 text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-slate-600 font-bold mb-1">대표 소개글 하단 서브타이틀 커스텀</label>
                          <input
                            type="text"
                            placeholder='사주는 미래의 낙인이 아닌, 나만의 인생 날씨 지도입니다.'
                            value={siteConfig.aboutSubtitle || ''}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, aboutSubtitle: e.target.value }))}
                            className="w-full text-xs border rounded p-1.5 focus:ring-1 focus:ring-amber-500 text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.aboutShowBreadcrumb !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, aboutShowBreadcrumb: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          소개 경로 네비 (Breadcrumb)
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.aboutShowIdentityHeader !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, aboutShowIdentityHeader: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          브랜드 기치 헤더
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.aboutShowSection1 !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, aboutShowSection1: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          Section 1. 브랜드 탄생
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.aboutShowSection2 !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, aboutShowSection2: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          Section 2. 미신 구분 잣대
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.aboutShowSection3 !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, aboutShowSection3: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          Section 3. 고문 자문 협회
                        </label>
                      </div>
                    </div>

                    {/* Author page toggles */}
                    <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 font-medium">
                      <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mb-3 font-mono">
                        필자 소개 뷰 섹션 제어 (Author View Settings)
                      </span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.authorShowHeaderBanner !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, authorShowHeaderBanner: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          저자 대표 소개 포스터
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.authorShowPrinciples !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, authorShowPrinciples: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          필독 3대 학술 집필 원칙
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.authorShowConsultants !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, authorShowConsultants: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          공방 전속 자문단 목록
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium select-none">
                          <input
                            type="checkbox"
                            checked={siteConfig.authorShowRecentColumns !== false}
                            onChange={(e) => setSiteConfig(c => ({ ...c!, authorShowRecentColumns: e.target.checked }))}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          경선 대표자 최근 에세이함
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t text-right">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 ml-auto"
                >
                  <Save size={14} /> 설정 내용 저장 기표
                </button>
              </div>
            </form>

            {/* Administrator Password Edit/Reset (관리자 비밀번호 변경/초기화) */}
            <form onSubmit={handleChangePassword} className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h2 className="text-sm font-serif font-bold text-slate-900 flex items-center gap-1.5">
                  <Lock size={16} className="text-amber-600" />
                  관리자 계정 보안 설정 (비밀번호 변경 및 초기화)
                </h2>
                <p className="text-xs text-slate-500 mt-1">CMS 제어판 접속을 위한 비밀번호를 변경하거나 즉시 공장 초기상태(&apos;admin&apos;)로 재설정합니다.</p>
              </div>

              {pwError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-sm">
                  ⚠ {pwError}
                </div>
              )}

              {pwSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-700 text-xs rounded-sm">
                  ✓ {pwSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold mb-1">* 현재 비밀번호</label>
                  <input
                    type="password"
                    required
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="기존 비밀번호 입력"
                    className="w-full text-xs border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">* 새 비밀번호</label>
                  <input
                    type="password"
                    required
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="최소 4자 이상"
                    className="w-full text-xs border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">* 새 비밀번호 확인</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPw}
                    onChange={(e) => setConfirmNewPw(e.target.value)}
                    placeholder="동일한 비밀번호 재입력"
                    className="w-full text-xs border rounded p-2"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50 p-4 rounded-lg border">
                <div className="text-left">
                  <span className="text-xs font-semibold block text-slate-800">보안 초기화 (Reset)</span>
                  <p className="text-[10px] text-slate-400 font-light mt-0.5">변경한 비밀번호를 분실하셨을 때 기본 값(&apos;admin&apos;)으로 돌립니다.</p>
                </div>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold border border-rose-700 transition shrink-0"
                >
                  비밀번호 &apos;admin&apos; 초기화
                </button>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 ml-auto shadow-sm"
                >
                  <Lock size={14} /> 비밀번호 변경 반영
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== G. BACKUP / RESTORE DATABASE VIEW ==================== */}
        {activeTab === 'backup' && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6 animate-fade-in max-w-xl">
            <div>
              <h1 className="text-xl font-serif font-bold text-slate-900">클라이언트 데이터 주권 관리</h1>
              <p className="text-xs text-slate-500 mt-1">로컬저장소의 한계를 보완하고 수정한 데이터를 안전하게 이전 보관합니다.</p>
            </div>

            {/* Sub description */}
            <div className="p-4 bg-indigo-50 text-indigo-950 rounded-lg text-xs leading-relaxed font-light space-y-1">
              <strong>안내 사항:</strong>
              <p>
                사주공방의 CMS-lite는 브라우저의 localStorage를 디지털 영토로 점화하여 동작합니다. 기기를 포맷하거나 캐시를 지우면 공들여 쓴 글들이 초기 15편으로 덮어써질 수 있습니다. 글 작성 후 필히 아래 파일 내보내기 생성을 보존해주시기 바랍니다.
              </p>
            </div>

            <div className="space-y-4 pt-3">
              {/* Back Export */}
              <div className="flex justify-between items-center p-4 bg-slate-50 border rounded-lg">
                <div>
                  <span className="text-xs font-semibold block text-slate-800">1. 로컬 데이터셋 내보내기</span>
                  <span className="text-[10px] text-slate-405 font-light">작성글, 칼럼, 설정 일식을 JSON 파일로 내립니다.</span>
                </div>
                <button
                  onClick={handleJsonExport}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download size={13} /> 내보내기 (Export)
                </button>
              </div>

              {/* Import */}
              <div className="flex justify-between items-center p-4 bg-slate-50 border rounded-lg">
                <div>
                  <span className="text-xs font-semibold block text-slate-800">2. 백업 파일 가져오기</span>
                  <span className="text-[10px] text-slate-400 font-light">내려받았던 백업 JSON을 불러와 엎어씌웁니다.</span>
                </div>
                <label className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition">
                  <Upload size={13} /> 파일 선택 (Import)
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleJsonImport}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Force Reset */}
              <div className="flex justify-between items-center p-4 bg-rose-50 border border-rose-100 rounded-lg">
                <div>
                  <span className="text-xs font-semibold block text-rose-900">3. 로컬 DB 완벽 청소 및 공장화</span>
                  <span className="text-[10px] text-slate-400 font-light">로컬 변경치를 날리고 15편의 디폴트로 채웁니다.</span>
                </div>
                <button
                  onClick={handleFactoryReset}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <RefreshCw size={13} /> 공 초기화 (Reset)
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
