import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge, useReactFlow } from '@xyflow/react';
import { ReactFlow, Background } from '@xyflow/react';
import HeroNode from './HeroNode';

const getNodes = (isMobile) => [
    {
        id: 'n1',
        type: 'heroNode',
        position: isMobile ? { x: 0, y: 0 } : { x: -280, y: -200 },
        data: {
            tag: 'Synapse',
            label: (
                <div className="py-3">
                    <h1 className="Melodrama-Bold text-3xl md:text-5xl tracking-tight leading-[1.05] text-[#342F2F]">
                        Turn Chaos<br />Into Clarity
                    </h1>
                </div>
            )
        }
    },
    {
        id: 'n2',
        type: 'heroNode',
        position: isMobile ? { x: 0, y: 500 } : { x: 180, y: -360 },
        data: {
            tag: 'Step 01',
            type: 'output',
            label: (
                <div className="py-1">
                    <p className="Melodrama-Medium text-2xl md:text-3xl text-[#342F2F] leading-tight">Brainstorm</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">Dump your raw ideas</p>
                </div>
            )
        }
    },
    {
        id: 'n3',
        type: 'heroNode',
        position: isMobile ? { x: 0, y: 200 } : { x: 420, y: -240 },
        data: {
            tag: 'Step 02',
            type: 'output',
            label: (
                <div className="py-1">
                    <p className="Melodrama-Medium text-2xl md:text-3xl text-[#342F2F] leading-tight">Connect</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">Link ideas visually</p>
                </div>
            )
        }
    },
    {
        id: 'n4',
        type: 'heroNode',
        position: isMobile ? { x: 0, y: 350 } : { x: 340, y: -60 },
        data: {
            tag: 'Step 03',
            type: 'output',
            label: (
                <div className="py-1">
                    <p className="Melodrama-Medium text-2xl md:text-3xl text-[#342F2F] leading-tight">Clarify</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">Structure emerges</p>
                </div>
            )
        }
    },

];

const initialEdges = [
    { id: 'e1-2', source: 'n1', target: 'n2', type: 'default', animated: true, style: { stroke: '#e2ddd9', strokeWidth: 1.5 } },
    { id: 'e1-3', source: 'n1', target: 'n3', type: 'default', animated: true, style: { stroke: '#e2ddd9', strokeWidth: 1.5 } },
    { id: 'e1-4', source: 'n1', target: 'n4', type: 'default', animated: true, style: { stroke: '#e2ddd9', strokeWidth: 1.5 } },
    { id: 'e2-3', source: 'n2', target: 'n3', type: 'default', style: { stroke: '#ede8e4', strokeWidth: 1 } },
    { id: 'e3-4', source: 'n3', target: 'n4', type: 'default', style: { stroke: '#ede8e4', strokeWidth: 1 } },
];

const FlowContent = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState(initialEdges);
    const nodeTypes = useMemo(() => ({ heroNode: HeroNode }), []);
    const { fitView } = useReactFlow();

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            setNodes(getNodes(isMobile));
            setTimeout(() => fitView({ padding: 0.25, duration: 600 }), 100);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [fitView]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []
    );
    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)), []
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            panOnScroll={false}
            zoomOnScroll={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
            panOnDrag={window.innerWidth >= 768}
            autoPanOnNodeDrag={false}
        >
            <Background gap={28} size={1} color="#e8e4e0" variant="dots" />
        </ReactFlow>
    );
};

export default FlowContent;