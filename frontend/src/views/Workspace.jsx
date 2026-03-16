import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
    ReactFlowProvider, ReactFlow, Background, MiniMap, Controls,
    useNodesState, useEdgesState, addEdge, Handle, Position,
    MarkerType, useReactFlow, Panel, getBezierPath, EdgeLabelRenderer,
    BaseEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
    Layers, Search, Settings, Hash, Type, MousePointer2,
    ArrowLeft, Plus, Trash2, Download, LayoutGrid,
    Link2, Tag, Copy, Zap, Move, PenLine, Check,
    Sparkles, ArrowRight, Undo2, Redo2, Share2, ListOrdered,
    Palette, Square
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* =====================================================================
   COLORS
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

/* =====================================================================
   MODULE-LEVEL REF — lets SynapseNode call WorkspaceContent callbacks
   ===================================================================== */
const wsCallbacks = { current: null };

/* =====================================================================
   ISLAND SATELLITE ANGLE TABLE
   ===================================================================== */
const ISLAND_ANGLES_DEG = [0, 180, 90, 270, 45, 225, 135, 315, 22, 202];
const ISLAND_RADIUS = 230;

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
    const isGroupNode = !!data.groupType;

    /* sync from external changes */
    useEffect(() => { if (!isEditing) setEditText(data.label || ''); }, [data.label, isEditing]);
    useEffect(() => { if (!isEditingTag) setEditTag(data.tag || ''); }, [data.tag, isEditingTag]);
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [isEditing, editText]);

    /* ---------- label editing ---------- */
    const startEditing = (e) => {
        e.stopPropagation(); e.preventDefault();
        setIsEditing(true); setEditText(data.label || '');
        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const l = textareaRef.current.value.length;
                textareaRef.current.setSelectionRange(l, l);
            }
        });
    };
    const commitEdit = () => {
        setIsEditing(false);
        setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, label: editText } } : n));
    };
    const handleLabelKeyDown = (e) => {
        e.stopPropagation();
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
        if (e.key === 'Escape') { setIsEditing(false); setEditText(data.label || ''); }
    };

    /* ---------- tag editing ---------- */
    const startEditingTag = (e) => {
        e.stopPropagation(); e.preventDefault();
        setIsEditingTag(true); setEditTag(data.tag || '');
        requestAnimationFrame(() => { tagInputRef.current?.focus(); tagInputRef.current?.select(); });
    };
    const commitTag = () => {
        setIsEditingTag(false);
        setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, tag: editTag } } : n));
    };
    const handleTagKeyDown = (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') { e.preventDefault(); commitTag(); }
        if (e.key === 'Escape') { setIsEditingTag(false); setEditTag(data.tag || ''); }
    };

    const handleStyle = `!w-2.5 !h-2.5 !border-2 !border-white transition-all duration-200 opacity-0 group-hover:opacity-100 ${selected ? '!opacity-100' : ''}`;

    /* ---------- add-child button label ---------- */
    const addChildLabel = data.groupType === 'steps' ? 'Étape suivante' : 'Ajouter une idée';

    return (
        <div
            className={`relative group min-w-[160px] max-w-[280px] rounded-2xl transition-all duration-200 cursor-pointer
                ${selected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-xl shadow-blue-500/20 scale-[1.02]' : 'hover:shadow-lg'}`}
            style={{
                backgroundColor: colorScheme.bg,
                borderWidth: 2, borderStyle: 'solid',
                borderColor: selected ? '#3b82f6' : colorScheme.border,
            }}
        >
            {/* Handles */}
            <Handle type="target" position={Position.Top} id="top" className={`${handleStyle} !-top-1.5 !bg-blue-500`} style={{ zIndex: 2 }} />
            <Handle type="target" position={Position.Left} id="left" className={`${handleStyle} !-left-1.5 !bg-blue-500`} style={{ zIndex: 2 }} />
            <Handle type="source" position={Position.Right} id="right" className={`${handleStyle} !-right-1.5 !bg-blue-500 hover:!w-3.5 hover:!h-3.5`} style={{ zIndex: 2 }} />
            <Handle type="source" position={Position.Bottom} id="bottom" className={`${handleStyle} !-bottom-1.5 !bg-blue-500 hover:!w-3.5 hover:!h-3.5`} style={{ zIndex: 2 }} />

            {/* Tag bar */}
            <div className="px-3 py-1.5 flex items-center justify-between border-b relative z-10" style={{ borderColor: colorScheme.border }}>
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
                    >
                        {data.tag || 'Node'}
                    </span>
                )}
                {/* Group type badge */}
                {isGroupNode && (
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                        {data.groupType === 'island' && <Share2 size={8} style={{ color: colorScheme.text, opacity: 0.35 }} />}
                        {data.groupType === 'steps' && <ListOrdered size={8} style={{ color: colorScheme.text, opacity: 0.35 }} />}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 relative z-10" onDoubleClick={startEditing}>
                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        value={editText}
                        onChange={e => {
                            setEditText(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onBlur={commitEdit}
                        onKeyDown={handleLabelKeyDown}
                        onClick={e => e.stopPropagation()}
                        className="nodrag w-full bg-transparent resize-none outline-none text-sm font-semibold leading-snug overflow-hidden"
                        style={{ color: colorScheme.text, minHeight: '24px', caretColor: colorScheme.text }}
                        rows={1}
                    />
                ) : (
                    <p className="text-sm font-semibold leading-snug whitespace-pre-wrap break-words"
                        style={{ color: colorScheme.text, minHeight: '24px' }}>
                        {data.label || <span className="opacity-25 italic font-normal text-xs">Double-clic pour éditer...</span>}
                    </p>
                )}
                {!isEditing && (
                    <div className="absolute bottom-1.5 right-2.5 opacity-0 group-hover:opacity-25 transition-opacity pointer-events-none">
                        <PenLine size={9} style={{ color: colorScheme.text }} />
                    </div>
                )}
            </div>

            {/* ── Floating "+" add-child button — appears below the node on hover ── */}
            {isGroupNode && (
                <div
                    className="nodrag nopan absolute left-1/2 -translate-x-1/2 -bottom-5 z-20
                        opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                        transition-all duration-150 pointer-events-none group-hover:pointer-events-auto"
                >
                    <button
                        onClick={e => { e.stopPropagation(); wsCallbacks.current?.addChild(id); }}
                        onMouseDown={e => e.stopPropagation()}
                        title={addChildLabel}
                        className="w-9 h-9 rounded-full flex items-center justify-center shadow-xl border-[2.5px] border-white text-white hover:scale-110 active:scale-95 transition-transform"
                        style={{ backgroundColor: data.groupType === 'island' ? '#f59e0b' : '#10b981' }}
                    >
                        <Plus size={15} strokeWidth={2.5} />
                    </button>
                </div>
            )}
        </div>
    );
};

/* =====================================================================
   CUSTOM EDGE WITH INLINE LABEL
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

    useEffect(() => { if (!isEditingLabel) setLabelText(data?.label || ''); }, [data?.label, isEditingLabel]);

    const commitLabel = () => {
        setIsEditingLabel(false);
        setEdges(eds => eds.map(e => e.id === id ? { ...e, data: { ...e.data, label: labelText } } : e));
    };
    const startEditing = (e) => {
        e.stopPropagation();
        setIsEditingLabel(true); setLabelText(data?.label || '');
        requestAnimationFrame(() => { inputRef.current?.focus(); inputRef.current?.select(); });
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={{
                ...style, stroke: selected ? '#3b82f6' : '#94a3b8',
                strokeWidth: selected ? 2.5 : 1.5,
            }} />
            {/* Wide invisible hit area */}
            <path d={edgePath} fill="none" stroke="transparent" strokeWidth={20}
                onDoubleClick={startEditing} style={{ cursor: 'pointer' }}
                className="react-flow__edge-interaction" />
            <EdgeLabelRenderer>
                <div style={{
                    position: 'absolute',
                    transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
                    pointerEvents: 'all',
                }} className="nodrag nopan">
                    {isEditingLabel ? (
                        <input ref={inputRef} value={labelText}
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
                        <div onDoubleClick={startEditing}
                            className={`cursor-pointer transition-all duration-150
                                ${data?.label
                                    ? 'px-2.5 py-0.5 rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 text-[11px] font-semibold'
                                    : 'px-2 py-0.5 rounded-full text-[10px] font-semibold opacity-0 hover:opacity-100 bg-white/80 border border-gray-200 text-gray-400'
                                } ${selected ? '!opacity-100' : ''}`}
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
   COLOR PICKER
   ===================================================================== */
const ColorPicker = ({ currentColor, onChange }) => (
    <div className="flex flex-wrap gap-1.5">
        {Object.entries(NODE_COLORS).map(([key, val]) => (
            <button key={key} onClick={() => onChange(key)} title={val.label}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 active:scale-95
                    ${currentColor === key ? 'border-blue-500 scale-110 shadow-md' : 'border-gray-300'}`}
                style={{ backgroundColor: val.bg }} />
        ))}
    </div>
);

/* =====================================================================
   GROUP PATTERN PREVIEWS (dock icons)
   ===================================================================== */
const IslandPreview = () => (
    <svg viewBox="0 0 36 36" width="28" height="28">
        <rect x="12" y="13" width="12" height="10" rx="3" fill="#fde047" stroke="#fde047" strokeWidth="0.5" />
        {[[4, 4], [26, 4], [4, 22], [26, 22]].map(([x, y], i) => (
            <g key={i}>
                <line x1={18} y1={18} x2={x + 4} y2={y + 4} stroke="#94a3b8" strokeWidth="0.8" />
                <rect x={x} y={y} width="8" height="8" rx="2" fill="white" stroke="#e5e7eb" strokeWidth="0.5" />
            </g>
        ))}
        <rect x="12" y="13" width="12" height="10" rx="3" fill="#fef9c3" stroke="#fde047" strokeWidth="1" />
    </svg>
);

const StepsPreview = () => (
    <svg viewBox="0 0 36 36" width="28" height="28">
        {[[2, 2], [10, 10], [18, 18], [26, 26]].map(([x, y], i) => (
            <g key={i}>
                {i > 0 && <line x1={x - 4} y1={y - 4} x2={x + 5} y2={y + 4} stroke="#86efac" strokeWidth="0.8" />}
                <rect x={x} y={y} width="14" height="9" rx="2.5"
                    fill={i === 0 ? '#dcfce7' : '#f0fdf4'} stroke="#86efac" strokeWidth="0.8" />
            </g>
        ))}
    </svg>
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
    const [activeTab, setActiveTab] = useState('layers');
    const [notification, setNotification] = useState(null);

    /* ---- history ---- */
    const historyRef = useRef([{ nodes: [], edges: [] }]);
    const historyIdxRef = useRef(0);
    const isRestoringRef = useRef(false);

    const pushHistory = useCallback((newNodes, newEdges) => {
        if (isRestoringRef.current) return;
        const snap = { nodes: JSON.parse(JSON.stringify(newNodes)), edges: JSON.parse(JSON.stringify(newEdges)) };
        historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
        historyRef.current.push(snap);
        if (historyRef.current.length > 60) historyRef.current.shift();
        historyIdxRef.current = historyRef.current.length - 1;
    }, []);

    const { screenToFlowPosition, setCenter, fitView, getNodes, getEdges, getViewport } = useReactFlow();

    /* ---- focus if off-screen ---- */
    const focusNodeIfOffscreen = useCallback((node) => {
        const { x: vpX, y: vpY, zoom } = getViewport();
        const canvasW = window.innerWidth - 240 - 288;
        const padding = 60;
        const screenX = node.position.x * zoom + vpX;
        const screenY = node.position.y * zoom + vpY;
        const isVisible = screenX > padding && screenX < canvasW - padding &&
            screenY > padding && screenY < window.innerHeight - padding;
        if (!isVisible) setCenter(node.position.x + 80, node.position.y + 60, { zoom, duration: 500 });
    }, [getViewport, setCenter]);

    const nodeTypes = useMemo(() => ({ synapse: SynapseNode }), []);
    const edgeTypes = useMemo(() => ({ synapse: SynapseEdge }), []);

    const defaultEdgeOptions = {
        type: 'synapse', animated: false,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8', width: 16, height: 16 },
        data: { label: '' },
    };

    const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 2000); };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    const selectedEdge = edges.find(e => e.id === selectedEdgeId);

    /* ══════════════════════════════════════════════════════════════════
       GROUP CREATORS
    ══════════════════════════════════════════════════════════════════ */

    /* Island: creates a hub node */
    const createIslandGroup = useCallback(() => {
        const groupId = `island-${Date.now()}`;
        const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        const hubId = `n-${Date.now()}`;
        const hub = {
            id: hubId, type: 'synapse',
            position: { x: center.x, y: center.y },
            data: { label: 'Idée principale', tag: 'Main', color: 'yellow', groupType: 'island', groupId, isHub: true },
        };
        setNodes(nds => { const next = [...nds, hub]; pushHistory(next, getEdges()); return next; });
        setSelectedNodeId(hubId);
        notify('Groupe île créé — cliquez + pour ajouter des idées');
    }, [screenToFlowPosition, setNodes, getEdges, pushHistory]);

    /* Steps: creates the Start node */
    const createStepsGroup = useCallback(() => {
        const groupId = `steps-${Date.now()}`;
        const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        const startId = `n-${Date.now()}`;
        const start = {
            id: startId, type: 'synapse',
            position: { x: center.x, y: center.y },
            data: { label: 'Point de départ', tag: 'Start', color: 'green', groupType: 'steps', groupId, stepIndex: 0 },
        };
        setNodes(nds => { const next = [...nds, start]; pushHistory(next, getEdges()); return next; });
        setSelectedNodeId(startId);
        notify('Groupe steps créé — cliquez + pour ajouter des étapes');
    }, [screenToFlowPosition, setNodes, getEdges, pushHistory]);

    /* Free standalone node */
    const createFreeNode = useCallback(() => {
        const id = `n-${Date.now()}`;
        const center = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        const node = {
            id, type: 'synapse',
            position: { x: center.x + (Math.random() * 60 - 30), y: center.y + (Math.random() * 60 - 30) },
            data: { label: 'Nouvelle idée', tag: 'Note', color: 'white' },
        };
        setNodes(nds => { const next = [...nds, node]; pushHistory(next, getEdges()); return next; });
        setSelectedNodeId(id);
    }, [screenToFlowPosition, setNodes, getEdges, pushHistory]);

    /* ──────────────────────────────────────────────────────────────────
       ADD CHILD — called from SynapseNode via wsCallbacks
    ────────────────────────────────────────────────────────────────── */
    const addChildToGroup = useCallback((sourceNodeId) => {
        const allNodes = getNodes();
        const allEdges = getEdges();
        const node = allNodes.find(n => n.id === sourceNodeId);
        if (!node || !node.data.groupType) return;

        const newId = `n-${Date.now()}`;

        /* ---- ISLAND ---- */
        if (node.data.groupType === 'island') {
            const groupNodes = allNodes.filter(n => n.data.groupId === node.data.groupId);
            const hub = groupNodes.find(n => n.data.isHub);
            if (!hub) return;

            const children = groupNodes.filter(n => !n.data.isHub);
            const childNum = children.length + 1;

            // Distribute evenly in a full circle, starting at top (-90°)
            const totalSlots = Math.max(children.length + 1, 4); // always at least 4 slots so spacing looks good
            const angleRad = (-Math.PI / 2) + (children.length / totalSlots) * Math.PI * 2;

            // Re-space existing children too so they stay evenly distributed
            const updatedExisting = children.map((child, i) => ({
                ...child,
                position: {
                    x: hub.position.x + Math.cos((-Math.PI / 2) + (i / totalSlots) * Math.PI * 2) * ISLAND_RADIUS,
                    y: hub.position.y + Math.sin((-Math.PI / 2) + (i / totalSlots) * Math.PI * 2) * ISLAND_RADIUS,
                },
            }));

            const newNode = {
                id: newId, type: 'synapse',
                position: {
                    x: hub.position.x + Math.cos(angleRad) * ISLAND_RADIUS,
                    y: hub.position.y + Math.sin(angleRad) * ISLAND_RADIUS,
                },
                data: {
                    label: `Idée ${childNum}`,
                    tag: `Idée ${childNum}`,
                    color: 'white',
                    groupType: 'island',
                    groupId: node.data.groupId,
                    isHub: false,
                },
            };
            const newEdge = {
                id: `e-${Date.now()}`, source: hub.id, target: newId,
                ...defaultEdgeOptions,
                markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8', width: 14, height: 14 },
            };

            setNodes(nds => {
                // Re-space existing children + append new one
                const merged = nds.map(n => updatedExisting.find(u => u.id === n.id) || n);
                const next = [...merged, newNode];
                pushHistory(next, [...allEdges, newEdge]);
                return next;
            });
            setEdges(eds => [...eds, newEdge]);
            setSelectedNodeId(newId);
            setTimeout(() => focusNodeIfOffscreen(newNode), 50);
        }

        /* ---- STEPS ---- */
        else if (node.data.groupType === 'steps') {
            const groupNodes = allNodes.filter(n => n.data.groupId === node.data.groupId);
            const maxIdx = Math.max(...groupNodes.map(n => n.data.stepIndex ?? 0));
            const lastNode = groupNodes.find(n => n.data.stepIndex === maxIdx);
            if (!lastNode) return;

            const newIdx = maxIdx + 1;
            const newNode = {
                id: newId, type: 'synapse',
                position: {
                    x: lastNode.position.x + 200,   // right + slight down = cascade diagonal
                    y: lastNode.position.y + 100,
                },
                data: {
                    label: `Étape ${newIdx}`,
                    tag: `Step ${newIdx}`,
                    color: 'green',
                    groupType: 'steps',
                    groupId: node.data.groupId,
                    stepIndex: newIdx,
                },
            };
            const newEdge = {
                id: `e-${Date.now()}`, source: lastNode.id, target: newId,
                ...defaultEdgeOptions,
                markerEnd: { type: MarkerType.ArrowClosed, color: '#86efac', width: 14, height: 14 },
            };

            setNodes(nds => { const next = [...nds, newNode]; pushHistory(next, [...allEdges, newEdge]); return next; });
            setEdges(eds => [...eds, newEdge]);
            setSelectedNodeId(newId);
            setTimeout(() => focusNodeIfOffscreen(newNode), 50);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getNodes, getEdges, setNodes, setEdges, pushHistory, focusNodeIfOffscreen]);

    /* ---- wire wsCallbacks so SynapseNode can call addChildToGroup ---- */
    useEffect(() => {
        wsCallbacks.current = { addChild: addChildToGroup };
    }, [addChildToGroup]);

    /* ══════════════════════════════════════════════════════════════════
       CONNECT / DRAG / CLICK
    ══════════════════════════════════════════════════════════════════ */
    const onConnect = useCallback((params) => {
        setEdges(eds => {
            const next = addEdge({ ...params, ...defaultEdgeOptions, id: `e-${Date.now()}` }, eds);
            pushHistory(getNodes(), next);
            return next;
        });
    }, [setEdges, getNodes, pushHistory]);

    const onNodeDragStop = useCallback(() => { pushHistory(getNodes(), getEdges()); }, [getNodes, getEdges, pushHistory]);

    const onNodeClick = useCallback((_, node) => {
        setSelectedNodeId(node.id); setSelectedEdgeId(null);
        focusNodeIfOffscreen(node);
    }, [focusNodeIfOffscreen]);

    const onEdgeClick = useCallback((_, edge) => {
        setSelectedEdgeId(edge.id); setSelectedNodeId(null);
    }, []);

    /* ══════════════════════════════════════════════════════════════════
       DATA MUTATIONS
    ══════════════════════════════════════════════════════════════════ */
    const updateNodeData = useCallback((key, value) => {
        setNodes(nds => {
            const next = nds.map(n => n.id === selectedNodeId ? { ...n, data: { ...n.data, [key]: value } } : n);
            pushHistory(next, getEdges());
            return next;
        });
    }, [selectedNodeId, setNodes, getEdges, pushHistory]);

    const deleteSelectedNode = useCallback(() => {
        if (!selectedNodeId) return;
        setNodes(nds => {
            const next = nds.filter(n => n.id !== selectedNodeId);
            setEdges(eds => {
                const nextE = eds.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId);
                pushHistory(next, nextE);
                return nextE;
            });
            return next;
        });
        setSelectedNodeId(null);
        notify('Node supprimé');
    }, [selectedNodeId, setNodes, setEdges, pushHistory]);

    const deleteSelectedEdge = useCallback(() => {
        if (!selectedEdgeId) return;
        setEdges(eds => { const next = eds.filter(e => e.id !== selectedEdgeId); pushHistory(getNodes(), next); return next; });
        setSelectedEdgeId(null);
        notify('Lien supprimé');
    }, [selectedEdgeId, setEdges, getNodes, pushHistory]);

    const duplicateNode = useCallback(() => {
        if (!selectedNode) return;
        const newId = `n-${Date.now()}`;
        const newNode = { ...selectedNode, id: newId, position: { x: selectedNode.position.x + 30, y: selectedNode.position.y + 30 }, selected: false };
        setNodes(nds => { const next = [...nds, newNode]; pushHistory(next, getEdges()); return next; });
        setSelectedNodeId(newId);
        notify('Node dupliqué');
    }, [selectedNode, setNodes, getEdges, pushHistory]);

    /* ══════════════════════════════════════════════════════════════════
       UNDO / REDO
    ══════════════════════════════════════════════════════════════════ */
    const undo = useCallback(() => {
        if (historyIdxRef.current <= 0) return;
        historyIdxRef.current--;
        const snap = historyRef.current[historyIdxRef.current];
        isRestoringRef.current = true;
        setNodes(snap.nodes); setEdges(snap.edges);
        setSelectedNodeId(null); setSelectedEdgeId(null);
        setTimeout(() => { isRestoringRef.current = false; }, 0);
        notify('Annulé');
    }, [setNodes, setEdges]);

    const redo = useCallback(() => {
        if (historyIdxRef.current >= historyRef.current.length - 1) return;
        historyIdxRef.current++;
        const snap = historyRef.current[historyIdxRef.current];
        isRestoringRef.current = true;
        setNodes(snap.nodes); setEdges(snap.edges);
        setSelectedNodeId(null); setSelectedEdgeId(null);
        setTimeout(() => { isRestoringRef.current = false; }, 0);
        notify('Rétabli');
    }, [setNodes, setEdges]);

    /* ══════════════════════════════════════════════════════════════════
       LAYOUT / EXPORT
    ══════════════════════════════════════════════════════════════════ */
    const autoLayout = useCallback(() => {
        const COLS = Math.ceil(Math.sqrt(nodes.length));
        setNodes(nds => {
            const next = nds.map((n, i) => ({
                ...n, position: {
                    x: (i % COLS) * 300 - ((COLS - 1) * 300) / 2,
                    y: Math.floor(i / COLS) * 200,
                },
            }));
            pushHistory(next, getEdges());
            return next;
        });
        setTimeout(() => fitView({ padding: 0.2, duration: 600 }), 50);
        notify('Layout appliqué');
    }, [nodes, setNodes, fitView, getEdges, pushHistory]);

    const exportJSON = useCallback(() => {
        const blob = new Blob([JSON.stringify({ nodes: getNodes(), edges: getEdges() }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), { href: url, download: 'synapse-board.json' });
        a.click();
        notify('Export JSON réussi');
    }, [getNodes, getEdges]);

    /* ══════════════════════════════════════════════════════════════════
       KEYBOARD SHORTCUTS
    ══════════════════════════════════════════════════════════════════ */
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

    /* ══════════════════════════════════════════════════════════════════
       FILTERED LAYERS
    ══════════════════════════════════════════════════════════════════ */
    const filteredNodes = search
        ? nodes.filter(n => (n.data.label || '').toLowerCase().includes(search.toLowerCase()) || (n.data.tag || '').toLowerCase().includes(search.toLowerCase()))
        : nodes;

    /* ══════════════════════════════════════════════════════════════════
       RENDER
    ══════════════════════════════════════════════════════════════════ */
    return (
        <div className="flex h-screen w-screen bg-[#1a1614] text-white overflow-hidden font-sans">

            {/* Notification */}
            {notification && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#342F2F] text-white text-xs font-semibold rounded-full border border-white/10 shadow-xl flex items-center gap-2 pointer-events-none">
                    <Check size={12} className="text-green-400" />
                    {notification}
                </div>
            )}

            {/* ═══════════════════ LEFT SIDEBAR ═══════════════════ */}
            <aside className="w-60 flex flex-col border-r border-white/10 bg-[#231f1f] flex-shrink-0 z-20">

                {/* Header */}
                <div className="h-14 flex items-center px-3 border-b border-white/10 gap-2">
                    <Link to="/Dashboard" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                        <ArrowLeft size={15} />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Workspace</p>
                        <p className="text-[10px] text-gray-500">{nodes.length} nodes · {edges.length} liens</p>
                    </div>
                </div>

                {/* Search */}
                <div className="p-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            type="text" placeholder="Rechercher..."
                            className="w-full bg-black/20 border border-white/5 rounded-lg py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-white/20 text-gray-300 placeholder-gray-600" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 px-2 pb-2 gap-1">
                    {[['layers', 'Calques', Layers], ['groups', 'Groupes', LayoutGrid]].map(([tab, label, Icon]) => (
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
                        filteredNodes.length === 0 ? (
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
                                            <div className="w-2.5 h-2.5 rounded-full shrink-0 border"
                                                style={{ backgroundColor: scheme.bg, borderColor: scheme.border }} />
                                            <span className="flex-1 truncate font-medium">{node.data.label || 'Sans titre'}</span>
                                            {/* Group badge */}
                                            {node.data.groupType === 'island' && <Share2 size={8} className="text-yellow-500 opacity-60 shrink-0" />}
                                            {node.data.groupType === 'steps' && <ListOrdered size={8} className="text-green-500 opacity-60 shrink-0" />}
                                            <span className="text-[9px] text-gray-600 border border-gray-700 px-1 rounded opacity-0 group-hover:opacity-100">{node.data.tag}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )
                    ) : (
                        /* ---- GROUPS TAB ---- */
                        <div className="space-y-3 p-1">
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest px-1">Créer un groupe</p>

                            {/* Island */}
                            <button onClick={createIslandGroup}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all group text-left">
                                <IslandPreview />
                                <div>
                                    <p className="text-xs font-bold text-yellow-300">Groupe Île</p>
                                    <p className="text-[9px] text-gray-500 leading-relaxed mt-0.5">Hub central + idées<br />connectées tout autour</p>
                                </div>
                            </button>

                            {/* Steps */}
                            <button onClick={createStepsGroup}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all group text-left">
                                <StepsPreview />
                                <div>
                                    <p className="text-xs font-bold text-green-300">Groupe Steps</p>
                                    <p className="text-[9px] text-gray-500 leading-relaxed mt-0.5">Chaîne d'étapes<br />séquentielles</p>
                                </div>
                            </button>

                            <div className="h-px bg-white/5" />

                            {/* Free node */}
                            <button onClick={createFreeNode}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-all text-left">
                                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                                    <Square size={12} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-300">Node libre</p>
                                    <p className="text-[9px] text-gray-500">Sans groupe</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Bottom utilities */}
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

            {/* ═══════════════════ CANVAS ═══════════════════ */}
            <main className="flex-1 flex flex-col relative h-full">
                <ReactFlow
                    nodes={nodes} edges={edges}
                    nodeTypes={nodeTypes} edgeTypes={edgeTypes}
                    defaultEdgeOptions={defaultEdgeOptions}
                    connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                    onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                    onConnect={onConnect} onNodeClick={onNodeClick}
                    onEdgeClick={onEdgeClick} onNodeDragStop={onNodeDragStop}
                    onPaneClick={() => { setSelectedNodeId(null); setSelectedEdgeId(null); }}
                    fitView fitViewOptions={{ padding: 0.3 }}
                    proOptions={{ hideAttribution: true }}
                    minZoom={0.05} maxZoom={3}
                    connectionMode="loose"
                    className="bg-[#f3f4f6]"
                    deleteKeyCode={null}
                >
                    <Background gap={32} size={1} color="#cbd5e1" variant="dots" />

                    {/* Undo / Redo */}
                    <Panel position="top-left" className="!top-3 !left-3">
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#231f1f] border border-white/10 shadow-lg">
                            <button onClick={undo} title="Annuler (Ctrl+Z)"
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-95">
                                <Undo2 size={15} />
                            </button>
                            <button onClick={redo} title="Rétablir (Ctrl+Shift+Z)"
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all active:scale-95">
                                <Redo2 size={15} />
                            </button>
                        </div>
                    </Panel>

                    <MiniMap style={{ background: '#231f1f', border: '1px solid rgba(255,255,255,0.1)' }}
                        maskColor="rgba(0,0,0,0.3)"
                        nodeColor={n => NODE_COLORS[n.data?.color]?.bg || '#fff'}
                        className="!bottom-4 !right-4 !rounded-xl overflow-hidden shadow-xl"
                        zoomable pannable />

                    <Controls className="!bottom-4 !left-1/2 !-translate-x-1/2" showInteractive={false} />

                    {/* Empty state */}
                    {nodes.length === 0 && (
                        <Panel position="top-center" className="mt-20">
                            <div className="text-center text-gray-400">
                                <div className="w-16 h-16 rounded-3xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Sparkles size={24} className="text-gray-300" />
                                </div>
                                <p className="text-sm font-semibold text-gray-500">Canvas vide</p>
                                <p className="text-xs text-gray-400 mt-1">Choisissez un groupe dans le dock ↓</p>
                            </div>
                        </Panel>
                    )}
                </ReactFlow>

                {/* ── BOTTOM DOCK ── */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                    <div className="pointer-events-auto flex flex-col items-center gap-2">
                        <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[9px] text-gray-300 font-black uppercase tracking-widest shadow-lg">
                            Nouveau groupe
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#231f1f] border border-white/10 shadow-2xl ring-1 ring-black/30">

                            {/* Island */}
                            <button onClick={createIslandGroup}
                                title="Groupe Île"
                                className="group relative flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 hover:border-yellow-400/40 transition-all active:scale-95">
                                <IslandPreview />
                                <span className="text-[8px] font-bold text-yellow-400">Île</span>
                            </button>

                            {/* Steps */}
                            <button onClick={createStepsGroup}
                                title="Groupe Steps"
                                className="group relative flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-400/40 transition-all active:scale-95">
                                <StepsPreview />
                                <span className="text-[8px] font-bold text-green-400">Steps</span>
                            </button>

                            <div className="w-px h-8 bg-white/10" />

                            {/* Free node */}
                            <button onClick={createFreeNode}
                                title="Node libre"
                                className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all active:scale-95">
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* ═══════════════════ RIGHT SIDEBAR ═══════════════════ */}
            <aside className="w-72 flex flex-col border-l border-white/10 bg-[#231f1f] shrink-0 z-20">
                <div className="h-14 flex items-center px-4 border-b border-white/10 justify-between">
                    <span className="font-bold text-sm">Propriétés</span>
                    <Settings size={14} className="text-gray-500" />
                </div>

                <div className="flex-1 overflow-y-auto">
                    {selectedNode ? (
                        <div className="p-4 space-y-5">

                            {/* ID + actions */}
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-600 font-mono bg-black/20 px-2 py-0.5 rounded truncate max-w-[120px]">{selectedNode.id}</span>
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

                            {/* Group info badge */}
                            {selectedNode.data.groupType && (
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold
                                    ${selectedNode.data.groupType === 'island' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-300' : 'bg-green-500/10 border border-green-500/20 text-green-300'}`}>
                                    {selectedNode.data.groupType === 'island'
                                        ? <><Share2 size={11} /> Groupe Île · {selectedNode.data.isHub ? 'Hub' : 'Idée'}</>
                                        : <><ListOrdered size={11} /> Groupe Steps · Step {selectedNode.data.stepIndex ?? 0}</>
                                    }
                                </div>
                            )}

                            <div className="h-px bg-white/5" />

                            {/* Tag */}
                            <div>
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                    <Tag size={10} /> Tag
                                </label>
                                <input type="text"
                                    className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    value={selectedNode.data.tag || ''}
                                    onChange={e => updateNodeData('tag', e.target.value)} />
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
                                    placeholder="Contenu du node..." />
                            </div>

                            {/* Color */}
                            <div>
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                    <Palette size={10} /> Couleur
                                </label>
                                <ColorPicker currentColor={selectedNode.data.color || 'white'} onChange={val => updateNodeData('color', val)} />
                            </div>

                            <div className="h-px bg-white/5" />

                            {/* AI placeholder */}
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <div className="flex items-center gap-2 text-blue-300 text-xs font-bold mb-1.5">
                                    <Sparkles size={12} className="text-purple-400" /> Quick Think (IA)
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
                        <div className="p-4 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-400"><Link2 size={14} /><span>Lien sélectionné</span></div>
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
                                <input type="text" placeholder="Double-clic sur le lien..."
                                    className="w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    value={selectedEdge.data?.label || ''}
                                    onChange={e => setEdges(eds => eds.map(edge =>
                                        edge.id === selectedEdgeId ? { ...edge, data: { ...edge.data, label: e.target.value } } : edge
                                    ))} />
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-black/20 rounded-xl text-xs text-gray-400">
                                <ArrowRight size={11} />
                                <span className="truncate">{selectedEdge.source} → {selectedEdge.target}</span>
                            </div>
                        </div>

                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600 px-6">
                            <MousePointer2 size={36} className="mb-4 stroke-1 opacity-30" />
                            <p className="text-xs text-center leading-relaxed opacity-50">
                                Sélectionnez un node<br />ou un lien pour l'éditer
                            </p>
                            <div className="mt-8 w-full space-y-2 text-[10px] text-gray-600">
                                {[
                                    ['⌘Z', 'Annuler'], ['⌘⇧Z', 'Rétablir'],
                                    ['Del', 'Supprimer'], ['⌘D', 'Dupliquer'],
                                    ['2×clic', 'Éditer texte'], ['Esc', 'Désélectionner'],
                                ].map(([key, label]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 bg-black/30 rounded text-gray-500 font-mono">{key}</kbd>
                                        <span>{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-3 border-t border-white/10">
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
   WRAPPER
   ===================================================================== */
const Workspace = () => (
    <ReactFlowProvider>
        <WorkspaceContent />
    </ReactFlowProvider>
);

export default Workspace;