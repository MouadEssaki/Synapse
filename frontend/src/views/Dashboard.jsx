import { useState } from 'react';
import {
    LayoutGrid, Folder, Settings, LogOut, Plus, Search,
    MoreVertical, ChevronRight, Star, Clock, Zap, Users,
    TrendingUp, ArrowUpRight, GitBranch, Filter, Grid3x3,
    List, Sparkles, Lock, Globe, Trash2, Copy, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Mini node-graph preview rendered in SVG ─────────────────────────── */
const GraphPreview = ({ seed = 0 }) => {
    const configs = [
        {
            nodes: [{ x: 50, y: 40 }, { x: 130, y: 25 }, { x: 160, y: 75 }, { x: 70, y: 90 }, { x: 110, y: 60 }],
            edges: [[0, 1], [0, 4], [1, 2], [4, 2], [4, 3], [0, 3]]
        },
        {
            nodes: [{ x: 40, y: 55 }, { x: 100, y: 25 }, { x: 165, y: 45 }, { x: 130, y: 85 }, { x: 70, y: 88 }],
            edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3]]
        },
        {
            nodes: [{ x: 90, y: 30 }, { x: 45, y: 65 }, { x: 145, y: 65 }, { x: 70, y: 95 }, { x: 125, y: 95 }],
            edges: [[0, 1], [0, 2], [1, 3], [2, 4], [1, 2], [3, 4]]
        },
    ];
    const { nodes, edges } = configs[seed % configs.length];
    return (
        <svg viewBox="0 0 200 120" className="w-full h-full" style={{ opacity: 0.9 }}>
            {edges.map(([a, b], i) => (
                <line key={i}
                    x1={nodes[a].x} y1={nodes[a].y}
                    x2={nodes[b].x} y2={nodes[b].y}
                    stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"
                />
            ))}
            {nodes.map((n, i) => (
                <g key={i}>
                    <rect
                        x={n.x - 18} y={n.y - 10} width={36} height={20}
                        rx={5}
                        fill="rgba(255,255,255,0.07)"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth="1"
                    />
                    <rect
                        x={n.x - 18} y={n.y - 10} width={36} height={5}
                        rx={5}
                        fill="rgba(255,255,255,0.04)"
                    />
                </g>
            ))}
        </svg>
    );
};

/* ── Workspace card ──────────────────────────────────────────────────── */
const WorkspaceCard = ({ id, title, updatedAt, nodeCount, shared, starred, index }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isStarred, setIsStarred] = useState(starred);

    const tags = ['Design', 'Dev', 'Strategy', 'Research', 'Marketing'];
    const tag = tags[id % tags.length];
    const tagColors = {
        Design: 'bg-blue-500/20 text-blue-300',
        Dev: 'bg-green-500/20 text-green-300',
        Strategy: 'bg-orange-500/20 text-orange-300',
        Research: 'bg-purple-500/20 text-purple-300',
        Marketing: 'bg-pink-500/20 text-pink-300',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.07, ease: 'easeOut' }}
            className="group relative"
        >
            <div className="bg-[#2a2524] rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-0.5">

                {/* Graph preview */}
                <Link to={`/Workspace/${id}`} className="block relative h-36 bg-[#1e1b1a] overflow-hidden">
                    <div className="absolute inset-0 opacity-60"
                        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                    <GraphPreview seed={id} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2a2524] via-transparent to-transparent" />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex items-center gap-2 bg-[#342F2F]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <ExternalLink size={13} className="text-white" />
                            <span className="text-white text-xs font-semibold">Ouvrir</span>
                        </div>
                    </div>
                </Link>

                {/* Card body */}
                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${tagColors[tag]}`}>
                                    {tag}
                                </span>
                                {shared && <Globe size={10} className="text-gray-500" />}
                            </div>
                            <Link to={`/Workspace/${id}`}>
                                <h3 className="text-sm font-bold text-white truncate hover:text-gray-200 transition-colors">{title}</h3>
                            </Link>
                        </div>

                        <div className="flex items-center gap-1 ml-2 shrink-0">
                            <button
                                onClick={() => setIsStarred(s => !s)}
                                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-white/10 ${isStarred ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-300'}`}
                            >
                                <Star size={13} fill={isStarred ? 'currentColor' : 'none'} />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={e => { e.preventDefault(); setMenuOpen(o => !o); }}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/10 transition-all"
                                >
                                    <MoreVertical size={13} />
                                </button>
                                <AnimatePresence>
                                    {menuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.92, y: -4 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.92, y: -4 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-8 w-44 bg-[#1e1b1a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                            onMouseLeave={() => setMenuOpen(false)}
                                        >
                                            {[
                                                { icon: Copy, label: 'Dupliquer' },
                                                { icon: Star, label: 'Favori' },
                                                { icon: ExternalLink, label: 'Ouvrir' },
                                            ].map(({ icon: Icon, label }) => (
                                                <button key={label} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                                                    <Icon size={12} /> {label}
                                                </button>
                                            ))}
                                            <div className="h-px bg-white/5 mx-2" />
                                            <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                                                <Trash2 size={12} /> Supprimer
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1 text-[10px] text-gray-600">
                            <Clock size={9} />
                            <span>{updatedAt}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-600">
                            <GitBranch size={9} />
                            <span>{nodeCount} nodes</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

/* ── Stat pill ───────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, delta, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.06 }}
        className="bg-[#2a2524] border border-white/5 rounded-2xl px-5 py-4 flex items-center gap-4"
    >
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
            <Icon size={16} className="text-gray-300" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">{label}</p>
            <p className="text-lg font-black text-white leading-none">{value}</p>
        </div>
        {delta && (
            <div className="flex items-center gap-0.5 text-green-400 text-[10px] font-bold">
                <ArrowUpRight size={11} />
                {delta}
            </div>
        )}
    </motion.div>
);

/* ── Main Dashboard ──────────────────────────────────────────────────── */
const WORKSPACES = [
    { id: 1, title: 'Marketing Campaign Q4', updatedAt: 'Il y a 2h', nodeCount: 24, shared: true, starred: true },
    { id: 2, title: 'SaaS Architecture', updatedAt: 'Hier', nodeCount: 41, shared: false, starred: false },
    { id: 3, title: 'Onboarding Flow', updatedAt: 'Il y a 3j', nodeCount: 17, shared: true, starred: false },
    { id: 4, title: 'Product Roadmap 2025', updatedAt: 'Il y a 1s', nodeCount: 58, shared: false, starred: true },
    { id: 5, title: 'Design System', updatedAt: 'Il y a 2s', nodeCount: 32, shared: true, starred: false },
];

const NAV = [
    { icon: LayoutGrid, label: 'Dashboard', active: true },
    { icon: Folder, label: 'Projects', active: false },
    { icon: Star, label: 'Favoris', active: false },
    { icon: Users, label: 'Équipe', active: false },
];

const Dashboard = () => {
    const [search, setSearch] = useState('');
    const [view, setView] = useState('grid'); // 'grid' | 'list'
    const [filter, setFilter] = useState('all'); // 'all' | 'starred' | 'shared'

    const filtered = WORKSPACES.filter(w => {
        const matchSearch = w.title.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || (filter === 'starred' && w.starred) || (filter === 'shared' && w.shared);
        return matchSearch && matchFilter;
    });

    return (
        <div className="flex h-screen bg-[#1a1614] font-sans overflow-hidden">

            {/* ═══ SIDEBAR ═══ */}
            <aside className="w-64 flex flex-col bg-[#1a1614] border-r border-white/5 shrink-0 py-6 px-4">
                {/* Logo */}
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="w-8 h-8 rounded-lg p-1 border border-white/20">
                        <img src="/tt.png" alt="Synapse Logo" />
                    </div>
                    <span className="Melodrama-Bold text-white text-2xl tracking-tight">Synapse</span>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1">
                    {NAV.map(({ icon: Icon, label, active }) => (
                        <button key={label}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                                ${active
                                    ? 'bg-white/10 text-white'
                                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'}`}
                        >
                            <Icon size={16} className={active ? 'text-white' : ''} />
                            {label}
                            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
                        </button>
                    ))}
                </nav>

                {/* Quick create */}
                <div className="mt-6">
                    <Link to="/Workspace/new">
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-[#342F2F] text-sm font-black hover:bg-gray-100 active:scale-[0.98] transition-all shadow-lg shadow-black/20">
                            <Plus size={15} />
                            Nouveau Board
                        </button>
                    </Link>
                </div>

                {/* Recents */}
                <div className="mt-8">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest px-2 mb-2">Récents</p>
                    {WORKSPACES.slice(0, 3).map(w => (
                        <Link key={w.id} to={`/Workspace/${w.id}`}>
                            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer">
                                <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <GitBranch size={10} className="text-gray-400" />
                                </div>
                                <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors truncate font-medium">{w.title}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Settings + User */}
                <div className="mt-auto space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-200 hover:bg-white/5 transition-all">
                        <Settings size={16} />
                        Paramètres
                    </button>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                        <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                            alt="avatar" className="w-7 h-7 rounded-full border border-white/10" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">Username</p>
                            <p className="text-[10px] text-gray-600">Free Plan</p>
                        </div>
                        <LogOut size={13} className="text-gray-600 group-hover:text-gray-300 transition-colors" />
                    </div>
                </div>
            </aside>

            {/* ═══ MAIN ═══ */}
            <main className="flex-1 flex flex-col overflow-hidden">

                {/* Top bar */}
                <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 shrink-0">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="Melodrama-Bold text-3xl text-white tracking-tight"
                        >
                            Mes Workspaces
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="text-xs text-gray-500 mt-0.5"
                        >
                            {WORKSPACES.length} boards · dernière activité il y a 2h
                        </motion.p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Rechercher..."
                                className="w-52 bg-white/5 border border-white/5 focus:border-white/15 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 outline-none transition-all focus:bg-white/8 focus:w-64"
                            />
                        </div>

                        {/* View toggle */}
                        <div className="flex items-center gap-0.5 p-1 bg-white/5 rounded-xl border border-white/5">
                            <button onClick={() => setView('grid')} className={`w-8 h-7 flex items-center justify-center rounded-lg transition-all ${view === 'grid' ? 'bg-white/15 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                                <Grid3x3 size={13} />
                            </button>
                            <button onClick={() => setView('list')} className={`w-8 h-7 flex items-center justify-center rounded-lg transition-all ${view === 'list' ? 'bg-white/15 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                                <List size={13} />
                            </button>
                        </div>

                        <Link to="/Workspace/new">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#342F2F] text-sm font-black rounded-xl hover:bg-gray-100 transition-all active:scale-[0.98] shadow-lg shadow-black/20">
                                <Plus size={14} />
                                Nouveau
                            </button>
                        </Link>
                    </div>
                </header>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-8 py-6">

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        <StatCard icon={GitBranch} label="Total boards" value={WORKSPACES.length} delta="+2" index={0} />
                        <StatCard icon={TrendingUp} label="Nodes créés" value="172" delta="+18" index={1} />
                        <StatCard icon={Users} label="Partagés" value="3" index={2} />
                        <StatCard icon={Zap} label="IA utilisée" value="14×" delta="+5" index={3} />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 mb-6">
                        {[
                            { key: 'all', label: 'Tous' },
                            { key: 'starred', label: '⭐ Favoris' },
                            { key: 'shared', label: '🌐 Partagés' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                                    ${filter === key
                                        ? 'bg-white text-[#342F2F]'
                                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                        <span className="ml-auto text-xs text-gray-600">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Grid */}
                    <AnimatePresence mode="wait">
                        {view === 'grid' ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                            >
                                {filtered.map((w, i) => (
                                    <WorkspaceCard key={w.id} {...w} index={i} />
                                ))}

                                {/* Create new card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.35, delay: filtered.length * 0.07 }}
                                >
                                    <Link to="/Workspace/new">
                                        <div className="h-full min-h-[220px] rounded-2xl border-2 border-dashed border-white/10 hover:border-white/25 bg-transparent hover:bg-white/[0.02] transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer group">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                                                <Plus size={22} className="text-gray-400 group-hover:text-white" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Nouveau Workspace</p>
                                                <p className="text-[10px] text-gray-600 mt-0.5">Créer un board vide</p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        ) : (
                            /* List view */
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-2"
                            >
                                {filtered.map((w, i) => (
                                    <motion.div
                                        key={w.id}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.25, delay: i * 0.05 }}
                                        className="group flex items-center gap-4 px-5 py-4 bg-[#2a2524] border border-white/5 hover:border-white/15 rounded-2xl transition-all hover:-translate-x-0.5"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-[#1e1b1a] border border-white/10 flex items-center justify-center shrink-0">
                                            <GitBranch size={14} className="text-gray-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-white truncate">{w.title}</p>
                                                {w.starred && <Star size={10} className="text-yellow-400 shrink-0" fill="currentColor" />}
                                                {w.shared && <Globe size={10} className="text-gray-500 shrink-0" />}
                                            </div>
                                            <p className="text-[10px] text-gray-600 mt-0.5">{w.updatedAt} · {w.nodeCount} nodes</p>
                                        </div>
                                        <Link to={`/Workspace/${w.id}`}>
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                                Ouvrir <ChevronRight size={11} />
                                            </button>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty state */}
                    {filtered.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-24 text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                                <Search size={24} className="text-gray-600" />
                            </div>
                            <p className="text-sm font-bold text-gray-400">Aucun résultat</p>
                            <p className="text-xs text-gray-600 mt-1">Essayez un autre terme ou filtre</p>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;