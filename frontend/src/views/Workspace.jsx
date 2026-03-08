import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    ReactFlowProvider, ReactFlow, Background, MiniMap, Controls,
    useNodesState, useEdgesState, addEdge, Handle, Position,
    MarkerType, useReactFlow, Panel, getBezierPath, EdgeLabelRenderer,
    BaseEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
    Layers, Search, Settings, Hash, Type, MousePointer2, BoxSelect,
    ArrowLeft, Plus, Square, Diamond, Database, PlayCircle, XCircle,
    Palette, AlignLeft, Trash2, Download, LayoutGrid, Maximize2,
    ChevronRight, Link2, Tag, Copy, Zap, Move, PenLine, Check,
    MoreHorizontal, Sparkles, ArrowRight, Undo2, Redo2
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* =====================================================================
   CONSTANTS & CONFIG
   ===================================================================== */

const NODE_COLORS = {
    white: { bg: '#ffffff', border: '#e5e7eb', text: '#342F2F', label: 'Blanc' },
    dark: { bg: '#342F2F', border: '#1a1a1a', text: '#ffffff', label: 'Dark' },
    blue: { bg: '#dbeafe', border: '#93c5fd', text: '#1e3a8a', label: 'Bleu' },
    green: { bg: '#dcfce7', border: '#86efac', text: '#14532d', label: 'Vert' },
    yellow: { bg: '#fef9c3', border: '#fde047', text: '#713f12', label: 'Jaune' },
    red: { bg: '#fee2e2', border: '#fca5a5', text: '#7f1d1d', label: 'Rouge' },
    purple: { bg: '#f3e8ff', border: '#d8b4fe', text: '#581c87', label: 'Violet' },
    orange: { bg: '#ffedd5', border: '#fdba74', text: '#7c2d12', label: 'Orange' },
};

const NODE_TYPES_CONFIG = [
    { type: 'idea', icon: Square, label: 'Idée', color: 'white', tag: 'Idée', defaultText: 'Nouvelle idée' },
    { type: 'decision', icon: Diamond, label: 'Décision', color: 'yellow', tag: 'Décision', defaultText: 'Choix clé' },
    { type: 'data', icon: Database, label: 'Données', color: 'purple', tag: 'Data', defaultText: 'Stockage info' },
    { type: 'start', icon: PlayCircle, label: 'Début', color: 'green', tag: 'Start', defaultText: 'Point de départ' },
    { type: 'note', icon: AlignLeft, label: 'Note', color: 'blue', tag: 'Note', defaultText: 'Annotation...' },
];

/* =====================================================================
   CUSTOM NODE
   ===================================================================== */
const SynapseNode = ({ id, data, selected }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(data.label || '');
    const [isEditingTag, setIsEditingTag] = useState(false);
    const [editTag, setEditTag] = useState(data.tag || '');
    const textareaRef = useRef(null);
    const tagInputRef = useRef(null);
    const { setNodes } = useReactFlow();

    const colorScheme = NODE_COLORS[data.color] || NODE_COLORS.white;

    useEffect(() => {
        if (!isEditing) setEditText(data.label || '');
    }, [data.label, isEditing]);

    useEffect(() => {
        if (!isEditingTag) setEditTag(data.tag || '');
    }, [data.tag, isEditingTag]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [isEditing, editText]);

    const startEditing = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsEditing(true);
        setEditText(data.label || '');
        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const len = textareaRef.current.value.length;
                textareaRef.current.setSelectionRange(len, len);
            }
        });
    };

    const commitEdit = () => {
        setIsEditing(false);
        setNodes(nds => nds.map(n => n.id === id
            ? { ...n, data: { ...n.data, label: editText } }
            : n
        ));
    };

    const handleKeyDown = (e) => {
        e.stopPropagation();
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
        if (e.key === 'Escape') { setIsEditing(false); setEditText(data.label || ''); }
    };

    // ---- Tag editing ----
    const startEditingTag = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsEditingTag(true);
        setEditTag(data.tag || '');
        requestAnimationFrame(() => {
            if (tagInputRef.current) {
                tagInputRef.current.focus();
                tagInputRef.current.select();
            }
        });
    };

    const commitTag = () => {
        setIsEditingTag(false);
        setNodes(nds => nds.map(n => n.id === id
            ? { ...n, data: { ...n.data, tag: editTag } }
            : n
        ));
    };

    const handleTagKeyDown = (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') { e.preventDefault(); commitTag(); }
        if (e.key === 'Escape') { setIsEditingTag(false); setEditTag(data.tag || ''); }
    };

    const handleStyle = `!w-2.5 !h-2.5 !border-2 !border-white transition-all duration-200 opacity-0 group-hover:opacity-100 ${selected ? '!opacity-100' : ''}`;

    return (
        <div
            className={`relative group min-w-[160px] max-w-[280px] rounded-2xl transition-all duration-200 cursor-pointer
                ${selected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-xl shadow-blue-500/20 scale-[1.02]' : 'hover:shadow-lg'}`}
            style={{
                backgroundColor: colorScheme.bg,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: selected ? '#3b82f6' : colorScheme.border,
            }}
        >
            {/* ---- Visible edge handles ---- */}
            <Handle type="target" position={Position.Top} id="top" className={`${handleStyle} !-top-1.5 !bg-blue-500`} style={{ zIndex: 2 }} />
            <Handle type="target" position={Position.Left} id="left" className={`${handleStyle} !-left-1.5 !bg-blue-500`} style={{ zIndex: 2 }} />
            <Handle type="source" position={Position.Right} id="right" className={`${handleStyle} !-right-1.5 !bg-blue-500 hover:!w-3.5 hover:!h-3.5`} style={{ zIndex: 2 }} />
            <Handle type="source" position={Position.Bottom} id="bottom" className={`${handleStyle} !-bottom-1.5 !bg-blue-500 hover:!w-3.5 hover:!h-3.5`} style={{ zIndex: 2 }} />

            {/* ---- Tag bar ---- */}
            <div
                className="px-3 py-1.5 flex items-center justify-between border-b relative z-10"
                style={{ borderColor: colorScheme.border }}
            >
                {isEditingTag ? (
                    <input
                        ref={tagInputRef}
                        value={editTag}
                        onChange={e => setEditTag(e.target.value)}
                        onBlur={commitTag}
                        onKeyDown={handleTagKeyDown}
                        onClick={e => e.stopPropagation()}
                        className="nodrag bg-transparent outline-none text-[9px] font-black uppercase tracking-[0.15em] w-full"
                        style={{ color: colorScheme.text, caretColor: colorScheme.text }}
                    />
                ) : (
                    <span
                        onDoubleClick={startEditingTag}
                        className="text-[9px] font-black uppercase tracking-[0.15em] opacity-60 hover:opacity-90 cursor-text transition-opacity"
                        style={{ color: colorScheme.text }}
                        title="Double-clic pour éditer le tag"
                    >
                        {data.tag || 'Node'}
                    </span>
                )}
                <div className="w-1.5 h-1.5 rounded-full opacity-50 group-hover:opacity-100 transition-opacity shrink-0 ml-2"
                    style={{ backgroundColor: colorScheme.border }} />
            </div>

            {/* ---- Content / inline edit ---- */}
            <div className="p-4 relative z-10" onDoubleClick={startEditing}>
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        value={editText}
                        onChange={e => {
                            setEditText(e.target.value);
                            // Live auto-resize
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onBlur={commitEdit}
                        onKeyDown={handleKeyDown}
                        onClick={e => e.stopPropagation()}
                        className="nodrag w-full bg-transparent resize-none outline-none text-sm font-semibold leading-snug overflow-hidden"
                        style={{
                            color: colorScheme.text,
                            minHeight: '24px',
                            caretColor: colorScheme.text,
                        }}
                        rows={1}
                    />
                ) : (
                    <p
                        className="text-sm font-semibold leading-snug whitespace-pre-wrap break-words"
                        style={{ color: colorScheme.text, minHeight: '24px' }}
                        title="Double-clic pour éditer"
                    >
                        {data.label || (
                            <span className="opacity-25 italic font-normal text-xs">Double-clic pour éditer...</span>
                        )}
                    </p>
                )}

                {/* Edit hint icon */}
                {!isEditing && (
                    <div className="absolute bottom-1.5 right-2.5 opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none">
                        <PenLine size={9} style={{ color: colorScheme.text }} />
                    </div>
                )}
            </div>
        </div>
    );
};

/* =====================================================================
   CUSTOM EDGE WITH LABEL
   ===================================================================== */
const SynapseEdge = ({
    id, sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    data, markerEnd, style, selected
}) => {
    const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
    const [isEditingLabel, setIsEditingLabel] = useState(false);
    const [labelText, setLabelText] = useState(data?.label || '');
    const inputRef = useRef(null);
    const { setEdges } = useReactFlow();

    // Sync if external change
    useEffect(() => {
        if (!isEditingLabel) setLabelText(data?.label || '');
    }, [data?.label, isEditingLabel]);

    const commitLabel = () => {
        setIsEditingLabel(false);
        setEdges(eds => eds.map(e => e.id === id
            ? { ...e, data: { ...e.data, label: labelText } }
            : e
        ));
    };

    const startEditing = (e) => {
        e.stopPropagation();
        setIsEditingLabel(true);
        setLabelText(data?.label || '');
        requestAnimationFrame(() => {
            if (inputRef.current) { inputRef.current.focus(); inputRef.current.select(); }
        });
    };

    return (
        <>
            {/* Visible path */}
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={{
                ...style,
                stroke: selected ? '#3b82f6' : '#94a3b8',
                strokeWidth: selected ? 2.5 : 1.5,
            }} />

            {/* Wide invisible path for easier clicking/double-clicking */}
            <path
                d={edgePath}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
                onDoubleClick={startEditing}
                style={{ cursor: 'pointer' }}
                className="react-flow__edge-interaction"
            />

            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    {isEditingLabel ? (
                        <input
                            ref={inputRef}
                            value={labelText}
                            onChange={e => setLabelText(e.target.value)}
                            onBlur={commitLabel}
                            onKeyDown={e => {
                                e.stopPropagation();
                                if (e.key === 'Enter') commitLabel();
                                if (e.key === 'Escape') { setIsEditingLabel(false); setLabelText(data?.label || ''); }
                            }}
                            onClick={e => e.stopPropagation()}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-white border-2 border-blue-400 outline-none shadow-lg text-gray-700 font-semibold text-center"
                            style={{ width: Math.max(80, labelText.length * 8 + 24) + 'px' }}
                        />
                    ) : (
                        <div
                            onDoubleClick={startEditing}
                            className={`group/label cursor-pointer transition-all duration-150
                                ${data?.label
                                    ? 'px-2.5 py-0.5 rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 text-[11px] font-semibold'
                                    : 'px-2 py-0.5 rounded-full text-[10px] font-semibold opacity-0 hover:opacity-100 bg-white/80 border border-gray-200 text-gray-400'
                                }
                                ${selected ? '!opacity-100' : ''}
                            `}
                        >
                            {data?.label || <span className="flex items-center gap-1"><PenLine size={9} />label</span>}
                        </div>
                    )}
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

/* =====================================================================
   COLOR PICKER COMPONENT
   ===================================================================== */
const ColorPicker = ({ currentColor, onChange }) => (
    <div className="flex flex-wrap gap-1.5">
        {Object.entries(NODE_COLORS).map(([key, val]) => (
            <button
                key={key}
                onClick={() => onChange(key)}
                title={val.label}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 active:scale-95
                    ${currentColor === key ? 'border-blue-500 scale-110 shadow-md' : 'border-gray-300'}`}
                style={{ backgroundColor: val.bg }}
            />
        ))}
    </div>
);

/* =====================================================================
   WORKSPACE CONTENT
   ===================================================================== */
const WorkspaceContent = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState(null);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('properties');
    const [notification, setNotification] = useState(null);

    // ---- History (undo/redo) ----
    const historyRef = useRef([{ nodes: [], edges: [] }]);
    const historyIdxRef = useRef(0);
    const isRestoringRef = useRef(false);

    const pushHistory = useCallback((newNodes, newEdges) => {
        if (isRestoringRef.current) return;
        const snap = {
            nodes: JSON.parse(JSON.stringify(newNodes)),
            edges: JSON.parse(JSON.stringify(newEdges)),
        };
        // Truncate redo branch
        historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
        historyRef.current.push(snap);
        if (historyRef.current.length > 60) historyRef.current.shift();
        historyIdxRef.current = historyRef.current.length - 1;
    }, []);

    const { screenToFlowPosition, setCenter, fitView, getNodes, getEdges, getViewport } = useReactFlow();

    /* ---- Focus node only if off-screen, preserve current zoom ---- */
    const focusNodeIfOffscreen = useCallback((node) => {
        const { x: vpX, y: vpY, zoom } = getViewport();

        // Sidebar widths: left=240px, right=288px
        const canvasW = window.innerWidth - 240 - 288;
        const canvasH = window.innerHeight;
        const padding = 60; // px margin before considered "off screen"

        // Node center in screen coordinates (relative to canvas)
        const screenX = node.position.x * zoom + vpX;
        const screenY = node.position.y * zoom + vpY;

        const isVisible =
            screenX > padding &&
            screenX < canvasW - padding &&
            screenY > padding &&
            screenY < canvasH - padding;

        if (!isVisible) {
            setCenter(
                node.position.x + 80,
                node.position.y + 60,
                { zoom, duration: 500 }
            );
        }
    }, [getViewport, setCenter]);

    const nodeTypes = useMemo(() => ({ synapse: SynapseNode }), []);
    const edgeTypes = useMemo(() => ({ synapse: SynapseEdge }), []);

    const defaultEdgeOptions = {
        type: 'synapse',
        animated: false,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8', width: 16, height: 16 },
        data: { label: '' },
    };

    /* ---- Helpers ---- */
    const notify = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 2000);
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    const selectedEdge = edges.find(e => e.id === selectedEdgeId);

    /* ---- Add node ---- */
    const addNode = useCallback((typeConfig) => {
        const id = `n-${Date.now()}`;
        const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        const newNode = {
            id,
            type: 'synapse',
            position: {
                x: center.x + (Math.random() * 100 - 50),
                y: center.y + (Math.random() * 100 - 50),
            },
            data: {
                label: typeConfig.defaultText,
                tag: typeConfig.tag,
                color: typeConfig.color,
            },
        };
        setNodes(nds => {
            const next = [...nds, newNode];
            pushHistory(next, getEdges());
            return next;
        });
        setSelectedNodeId(id);
        setSelectedEdgeId(null);
        notify(`Node "${typeConfig.label}" ajouté`);
    }, [screenToFlowPosition, setNodes, getEdges, pushHistory]);

    /* ---- Connect (allow multiple connections per handle) ---- */
    const onConnect = useCallback((params) => {
        setEdges(eds => {
            const next = addEdge({ ...params, ...defaultEdgeOptions, id: `e-${Date.now()}` }, eds);
            pushHistory(getNodes(), next);
            return next;
        });
    }, [setEdges, getNodes, pushHistory]);

    /* ---- Node drag stop → push history ---- */
    const onNodeDragStop = useCallback(() => {
        pushHistory(getNodes(), getEdges());
    }, [getNodes, getEdges, pushHistory]);

    /* ---- Click handlers ---- */
    const onNodeClick = useCallback((_, node) => {
        setSelectedNodeId(node.id);
        setSelectedEdgeId(null);
        focusNodeIfOffscreen(node);
    }, [focusNodeIfOffscreen]);

    const onEdgeClick = useCallback((_, edge) => {
        setSelectedEdgeId(edge.id);
        setSelectedNodeId(null);
    }, []);

    /* ---- Update node data ---- */
    const updateNodeData = useCallback((key, value) => {
        setNodes(nds => {
            const next = nds.map(n => n.id === selectedNodeId
                ? { ...n, data: { ...n.data, [key]: value } }
                : n
            );
            pushHistory(next, getEdges());
            return next;
        });
    }, [selectedNodeId, setNodes, getEdges, pushHistory]);

    /* ---- Delete ---- */
    const deleteSelectedNode = useCallback(() => {
        if (!selectedNodeId) return;
        setNodes(nds => {
            const next = nds.filter(n => n.id !== selectedNodeId);
            setEdges(eds => {
                const nextEdges = eds.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId);
                pushHistory(next, nextEdges);
                return nextEdges;
            });
            return next;
        });
        setSelectedNodeId(null);
        notify('Node supprimé');
    }, [selectedNodeId, setNodes, setEdges, pushHistory]);

    const deleteSelectedEdge = useCallback(() => {
        if (!selectedEdgeId) return;
        setEdges(eds => {
            const next = eds.filter(e => e.id !== selectedEdgeId);
            pushHistory(getNodes(), next);
            return next;
        });
        setSelectedEdgeId(null);
        notify('Lien supprimé');
    }, [selectedEdgeId, setEdges, getNodes, pushHistory]);

    /* ---- Duplicate ---- */
    const duplicateNode = useCallback(() => {
        if (!selectedNode) return;
        const id = `n-${Date.now()}`;
        const newNode = {
            ...selectedNode,
            id,
            position: { x: selectedNode.position.x + 30, y: selectedNode.position.y + 30 },
            selected: false,
        };
        setNodes(nds => {
            const next = [...nds, newNode];
            pushHistory(next, getEdges());
            return next;
        });
        setSelectedNodeId(id);
        notify('Node dupliqué');
    }, [selectedNode, setNodes, getEdges, pushHistory]);

    /* ---- Undo / Redo ---- */
    const undo = useCallback(() => {
        if (historyIdxRef.current <= 0) return;
        historyIdxRef.current--;
        const snap = historyRef.current[historyIdxRef.current];
        isRestoringRef.current = true;
        setNodes(snap.nodes);
        setEdges(snap.edges);
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setTimeout(() => { isRestoringRef.current = false; }, 0);
        notify('Annulé');
    }, [setNodes, setEdges]);

    const redo = useCallback(() => {
        if (historyIdxRef.current >= historyRef.current.length - 1) return;
        historyIdxRef.current++;
        const snap = historyRef.current[historyIdxRef.current];
        isRestoringRef.current = true;
        setNodes(snap.nodes);
        setEdges(snap.edges);
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setTimeout(() => { isRestoringRef.current = false; }, 0);
        notify('Rétabli');
    }, [setNodes, setEdges]);

    /* ---- Auto-layout (simple grid) ---- */
    const autoLayout = useCallback(() => {
        const COLS = Math.ceil(Math.sqrt(nodes.length));
        const GAP_X = 300;
        const GAP_Y = 200;
        setNodes(nds => {
            const next = nds.map((n, i) => ({
                ...n,
                position: {
                    x: (i % COLS) * GAP_X - ((COLS - 1) * GAP_X) / 2,
                    y: Math.floor(i / COLS) * GAP_Y,
                },
            }));
            pushHistory(next, getEdges());
            return next;
        });
        setTimeout(() => fitView({ padding: 0.2, duration: 600 }), 50);
        notify('Layout appliqué');
    }, [nodes, setNodes, fitView, getEdges, pushHistory]);

    /* ---- Export ---- */
    const exportJSON = useCallback(() => {
        const data = JSON.stringify({ nodes: getNodes(), edges: getEdges() }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'synapse-board.json';
        a.click();
        notify('Export JSON réussi');
    }, [getNodes, getEdges]);

    /* ---- Keyboard shortcuts ---- */
    useEffect(() => {
        const handler = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedNodeId) deleteSelectedNode();
                else if (selectedEdgeId) deleteSelectedEdge();
            }
            if (e.key === 'Escape') { setSelectedNodeId(null); setSelectedEdgeId(null); }
            if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo(); }
            if ((e.metaKey || e.ctrlKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) { e.preventDefault(); redo(); }
            if ((e.metaKey || e.ctrlKey) && e.key === 'd') { e.preventDefault(); duplicateNode(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [selectedNodeId, selectedEdgeId, deleteSelectedNode, deleteSelectedEdge, duplicateNode, undo, redo]);

    /* ---- Filtered nodes ---- */
    const filteredNodes = search
        ? nodes.filter(n =>
            (n.data.label || '').toLowerCase().includes(search.toLowerCase()) ||
            (n.data.tag || '').toLowerCase().includes(search.toLowerCase()))
        : nodes;

    /* =====================================================================
       RENDER
       ===================================================================== */
    return (
        <div className="flex h-screen w-screen bg-[#1a1614] text-white overflow-hidden font-sans">

            {/* ================= NOTIFICATION ================= */}
            {notification && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#342F2F] text-white text-xs font-semibold rounded-full border border-white/10 shadow-xl flex items-center gap-2 animate-pulse">
                    <Check size={12} className="text-green-400" />
                    {notification}
                </div>
            )}

            {/* ================= LEFT SIDEBAR ================= */}
            <aside className="w-60 flex flex-col border-r border-white/10 bg-[#231f1f] flex-shrink-0 z-20">

                {/* Header */}
                <div className="h-14 flex items-center px-3 border-b border-white/10 gap-2">
                    <Link to="/Dashboard" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                        <ArrowLeft size={15} />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Brainstorming</p>
                        <p className="text-[10px] text-gray-500">{nodes.length} nodes · {edges.length} liens</p>
                    </div>
                </div>

                {/* Search */}
                <div className="p-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full bg-black/20 border border-white/5 rounded-lg py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-white/20 text-gray-300 placeholder-gray-600"
                        />
                    </div>
                </div>

                {/* Tab toggle */}
                <div className="flex border-b border-white/10 px-2 pb-2 gap-1">
                    {[['layers', 'Calques', Layers], ['properties', 'Types', LayoutGrid]].map(([tab, label, Icon]) => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all
                                ${activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                            <Icon size={11} />{label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-2 py-2">
                    {activeTab === 'layers' ? (
                        <>
                            {filteredNodes.length === 0 ? (
                                <div className="text-center mt-12 text-gray-600 text-xs px-4">
                                    <Move size={28} className="mx-auto mb-3 stroke-1 opacity-40" />
                                    Aucune node.<br />Utilisez le dock en bas.
                                </div>
                            ) : (
                                <ul className="space-y-0.5">
                                    {filteredNodes.map(node => {
                                        const scheme = NODE_COLORS[node.data.color] || NODE_COLORS.white;
                                        return (
                                            <li key={node.id}
                                                onClick={() => { setSelectedNodeId(node.id); focusNodeIfOffscreen(node); }}
                                                className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-xs transition-all
                                                    ${selectedNodeId === node.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
                                                <div className="w-2.5 h-2.5 rounded-full shrink-0 border" style={{ backgroundColor: scheme.bg, borderColor: scheme.border }} />
                                                <span className="flex-1 truncate font-medium">{node.data.label || 'Sans titre'}</span>
                                                <span className="text-[9px] text-gray-600 border border-gray-700 px-1 rounded opacity-0 group-hover:opacity-100">{node.data.tag}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </>
                    ) : (
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest px-1 mb-2">Types de nodes</p>
                            {NODE_TYPES_CONFIG.map(cfg => {
                                const Icon = cfg.icon;
                                const scheme = NODE_COLORS[cfg.color];
                                return (
                                    <button key={cfg.type}
                                        onClick={() => addNode(cfg)}
                                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-all group text-left">
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: scheme.bg }}>
                                            <Icon size={13} style={{ color: scheme.text }} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold">{cfg.label}</p>
                                            <p className="text-[9px] text-gray-600">{cfg.tag}</p>
                                        </div>
                                        <Plus size={11} className="ml-auto opacity-0 group-hover:opacity-100 text-gray-400" />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Bottom actions */}
                <div className="p-2 border-t border-white/10 space-y-1">
                    <button onClick={autoLayout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        <LayoutGrid size={13} /> Auto-layout
                    </button>
                    <button onClick={exportJSON}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        <Download size={13} /> Exporter JSON
                    </button>
                </div>
            </aside>

            {/* ================= CENTER: CANVAS ================= */}
            <main className="flex-1 flex flex-col relative h-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    defaultEdgeOptions={defaultEdgeOptions}
                    connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeClick={onNodeClick}
                    onEdgeClick={onEdgeClick}
                    onNodeDragStop={onNodeDragStop}
                    onPaneClick={() => { setSelectedNodeId(null); setSelectedEdgeId(null); }}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    proOptions={{ hideAttribution: true }}
                    minZoom={0.05}
                    maxZoom={3}
                    connectionMode="loose"
                    className="bg-[#f3f4f6]"
                    deleteKeyCode={null}
                >
                    <Background gap={32} size={1} color="#cbd5e1" variant="dots" />

                    {/* Undo / Redo toolbar */}
                    <Panel position="top-left" className="!top-3 !left-3">
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#231f1f] border border-white/10 shadow-lg">
                            <button
                                onClick={undo}
                                title="Annuler (Ctrl+Z)"
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-95"
                            >
                                <Undo2 size={15} />
                            </button>
                            <button
                                onClick={redo}
                                title="Rétablir (Ctrl+Shift+Z)"
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-95"
                            >
                                <Redo2 size={15} />
                            </button>
                        </div>
                    </Panel>

                    <MiniMap
                        style={{ background: '#231f1f', border: '1px solid rgba(255,255,255,0.1)' }}
                        maskColor="rgba(0,0,0,0.3)"
                        nodeColor={(n) => NODE_COLORS[n.data?.color]?.bg || '#fff'}
                        className="!bottom-4 !right-4 !rounded-xl overflow-hidden shadow-xl"
                        zoomable pannable
                    />

                    <Controls
                        className="!bottom-4 !left-1/2 !-translate-x-1/2"
                        showInteractive={false}
                    />

                    {/* Empty state */}
                    {nodes.length === 0 && (
                        <Panel position="top-center" className="mt-24">
                            <div className="text-center text-gray-400">
                                <div className="w-20 h-20 rounded-3xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Sparkles size={32} className="text-gray-300" />
                                </div>
                                <p className="text-sm font-semibold text-gray-500">Canvas vide</p>
                                <p className="text-xs text-gray-400 mt-1">Ajoutez des nodes via le dock en bas</p>
                            </div>
                        </Panel>
                    )}
                </ReactFlow>

                {/* ---- BOTTOM DOCK ---- */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                    <div className="pointer-events-auto flex flex-col items-center gap-2">
                        <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[9px] text-gray-300 font-black uppercase tracking-widest shadow-lg">
                            Ajout rapide
                        </div>
                        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#231f1f] border border-white/10 shadow-2xl ring-1 ring-black/30">
                            {NODE_TYPES_CONFIG.map(cfg => {
                                const Icon = cfg.icon;
                                const scheme = NODE_COLORS[cfg.color];
                                return (
                                    <button
                                        key={cfg.type}
                                        onClick={() => addNode(cfg)}
                                        title={cfg.label}
                                        className="group relative w-11 h-11 flex flex-col items-center justify-center rounded-xl hover:bg-white/10 border border-white/5 hover:border-white/20 text-gray-400 hover:text-white transition-all active:scale-95"
                                    >
                                        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: scheme.bg + '30' }}>
                                            <Icon size={14} style={{ color: scheme.bg }} />
                                        </div>
                                        <span className="absolute -bottom-5 text-[8px] font-bold text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{cfg.label}</span>
                                    </button>
                                );
                            })}

                            <div className="w-px h-6 bg-white/10 mx-0.5" />

                            <button
                                onClick={() => addNode(NODE_TYPES_CONFIG[0])}
                                className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 active:scale-95 transition-all">
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* ================= RIGHT SIDEBAR ================= */}
            <aside className="w-72 flex flex-col border-l border-white/10 bg-[#231f1f] shrink-0 z-20">
                <div className="h-14 flex items-center px-4 border-b border-white/10 justify-between">
                    <span className="font-bold text-sm">Propriétés</span>
                    <Settings size={14} className="text-gray-500" />
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* ---- NODE PROPERTIES ---- */}
                    {selectedNode ? (
                        <div className="p-4 space-y-5">

                            {/* Node ID + actions */}
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-600 font-mono bg-black/20 px-2 py-0.5 rounded">{selectedNode.id}</span>
                                <div className="flex gap-1">
                                    <button onClick={duplicateNode} title="Dupliquer (Cmd+D)"
                                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                                        <Copy size={12} />
                                    </button>
                                    <button onClick={deleteSelectedNode} title="Supprimer (Delete)"
                                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            {/* Tag */}
                            <div>
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                    <Tag size={10} /> Tag
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    value={selectedNode.data.tag || ''}
                                    onChange={e => updateNodeData('tag', e.target.value)}
                                />
                            </div>

                            {/* Label */}
                            <div>
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                    <Type size={10} /> Contenu
                                </label>
                                <textarea
                                    className="w-full h-24 bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    value={selectedNode.data.label || ''}
                                    onChange={e => updateNodeData('label', e.target.value)}
                                    placeholder="Contenu du node..."
                                />
                            </div>

                            {/* Color */}
                            <div>
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                    <Palette size={10} /> Couleur
                                </label>
                                <ColorPicker
                                    currentColor={selectedNode.data.color || 'white'}
                                    onChange={val => updateNodeData('color', val)}
                                />
                            </div>

                            {/* Node type quick-change */}
                            <div>
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                    <Hash size={10} /> Type Rapide
                                </label>
                                <div className="grid grid-cols-3 gap-1">
                                    {NODE_TYPES_CONFIG.map(cfg => {
                                        const Icon = cfg.icon;
                                        const isActive = selectedNode.data.tag === cfg.tag;
                                        return (
                                            <button key={cfg.type}
                                                onClick={() => { updateNodeData('tag', cfg.tag); updateNodeData('color', cfg.color); }}
                                                className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[9px] font-bold border transition-all
                                                    ${isActive ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' : 'bg-black/10 border-white/5 text-gray-400 hover:bg-white/5'}`}>
                                                <Icon size={10} />{cfg.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            {/* AI Placeholder */}
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <div className="flex items-center gap-2 text-blue-300 text-xs font-bold mb-1.5">
                                    <Sparkles size={12} className="text-purple-400" />
                                    Quick Think (IA)
                                </div>
                                <p className="text-[10px] text-gray-400 leading-relaxed mb-2">
                                    Suggestions basées sur "{(selectedNode.data.label || '').slice(0, 20)}..."
                                </p>
                                <button className="w-full text-[10px] py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all font-semibold flex items-center justify-center gap-1">
                                    <Zap size={10} /> Étendre cette idée
                                </button>
                            </div>
                        </div>

                    ) : selectedEdge ? (
                        /* ---- EDGE PROPERTIES ---- */
                        <div className="p-4 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Link2 size={14} />
                                    <span>Lien sélectionné</span>
                                </div>
                                <button onClick={deleteSelectedEdge}
                                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div>
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                    <Tag size={10} /> Label du lien
                                </label>
                                <input
                                    type="text"
                                    placeholder="Double-clic sur le lien aussi..."
                                    className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    value={selectedEdge.data?.label || ''}
                                    onChange={e => setEdges(eds => eds.map(edge =>
                                        edge.id === selectedEdgeId
                                            ? { ...edge, data: { ...edge.data, label: e.target.value } }
                                            : edge
                                    ))}
                                />
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-black/20 rounded-xl text-xs text-gray-400">
                                <ArrowRight size={11} />
                                <span>{selectedEdge.source} → {selectedEdge.target}</span>
                            </div>
                        </div>

                    ) : (
                        /* ---- EMPTY STATE ---- */
                        <div className="flex flex-col items-center justify-center h-full text-gray-600 px-6">
                            <MousePointer2 size={36} className="mb-4 stroke-1 opacity-30" />
                            <p className="text-xs text-center leading-relaxed opacity-50">
                                Sélectionnez un node<br />ou un lien pour l'éditer
                            </p>
                            <div className="mt-8 w-full space-y-2 text-[10px] text-gray-600">
                                <div className="flex items-center gap-2">
                                    <kbd className="px-1.5 py-0.5 bg-black/30 rounded text-gray-500 font-mono">⌘Z</kbd>
                                    <span>Annuler</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-1.5 py-0.5 bg-black/30 rounded text-gray-500 font-mono">⌘⇧Z</kbd>
                                    <span>Rétablir</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-1.5 py-0.5 bg-black/30 rounded text-gray-500 font-mono">Del</kbd>
                                    <span>Supprimer</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-1.5 py-0.5 bg-black/30 rounded text-gray-500 font-mono">⌘D</kbd>
                                    <span>Dupliquer</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-1.5 py-0.5 bg-black/30 rounded text-gray-500 font-mono">2×clic</kbd>
                                    <span>Éditer texte</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <kbd className="px-1.5 py-0.5 bg-black/30 rounded text-gray-500 font-mono">Esc</kbd>
                                    <span>Désélectionner</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom export */}
                <div className="p-3 border-t border-white/10 space-y-2">
                    <button onClick={exportJSON}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-[#342F2F] text-xs font-black hover:bg-gray-100 transition-all shadow-sm">
                        <Download size={13} /> Exporter JSON
                    </button>
                </div>
            </aside>
        </div>
    );
};

/* =====================================================================
   WRAPPER WITH PROVIDER
   ===================================================================== */
const Workspace = () => (
    <ReactFlowProvider>
        <WorkspaceContent />
    </ReactFlowProvider>
);

export default Workspace;