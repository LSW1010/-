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
  Link2
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
  resetToDefault,
  exportAllData,
  importAllData
} from '../../data/db';
import { Post, Column, Category, SiteConfig, FAQ } from '../../types';

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
  const [siteConfig, setSiteConfig] = React.useState<SiteConfig | null>(null);

  // Editing state trackers
  const [editingPost, setEditingPost] = React.useState<Partial<Post> | null>(null);
  const [editingColumn, setEditingColumn] = React.useState<Partial<Column> | null>(null);
  const [isCreatingNew, setIsCreatingNew] = React.useState(false);

  // Form lists values (checklist, mistakes, faqs)
  const [currentFaqQ, setCurrentFaqQ] = React.useState('');
  const [currentFaqA, setCurrentFaqA] = React.useState('');
  const [currentMistake, setCurrentMistake] = React.useState('');
  const [currentChecklist, setCurrentChecklist] = React.useState('');

  // Toast / Status banner
  const [statusMsg, setStatusMsg] = React.useState({ type: 'success', text: '' });

  // Load Database state
  const loadDatabase = () => {
    setPosts(getPosts());
    setColumns(getColumns());
    setCategories(getCategories());
    setSiteConfig(getSiteConfig());
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
    if (password === 'admin' || password === '1234') {
      setAdminLoggedIn(true);
      setIsLogged(true);
      setAuthError('');
      triggerStatus('관리자 모드로 안전 로그인하였습니다.');
      onStateChange(); // Notify root
    } else {
      setAuthError('패스워드가 잘못되었습니다. 관리자 데모 비밀번호는 "admin" 또는 "1234" 입니다.');
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
            <FolderOpen size={14} /> 카테고리 구조 보기
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

              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">메인 추천 노출형 글</span>
                <span className="text-3xl font-serif font-bold text-slate-900 block mt-2">{posts.filter(p => p.isFeatured).length} 개</span>
                <p className="text-[10px] text-slate-400 mt-2 font-light">추천 가이드 마킹</p>
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

        {/* ==================== E. CATEGORIES LIST VIEW ==================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div>
              <h1 className="text-xl font-serif font-bold text-slate-900">명리학 정밀 카테고리 구조</h1>
              <p className="text-xs text-slate-500 mt-1">사주공방의 5대 핵심 지반 카테고리 계통의 설명과 고정 메타입니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map(c => {
                const count = posts.filter(p => p.category === c.id).length;
                return (
                  <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded uppercase font-semibold">
                      총 {count}편의 글 연결
                    </span>
                    <h3 className="font-serif font-bold text-slate-900 text-md mt-2 mb-1">{c.name}</h3>
                    <p className="text-slate-400 text-[10px] font-mono">ID: {c.id}</p>
                    <p className="text-slate-500 text-xs font-light leading-relaxed mt-2 border-t pt-2">
                      {c.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== F. SITE SETTINGS VIEW ==================== */}
        {activeTab === 'settings' && siteConfig && (
          <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6 animate-fade-in max-w-3xl">
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
