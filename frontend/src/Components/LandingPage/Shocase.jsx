import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GitBranch, Zap, LayoutGrid, Sparkles } from 'lucide-react';

/* Mini fake canvas preview */
const MockCanvas = () => {
    const nodes = [
        { x: 12,  y: 14, w: 120, label: 'Product Vision',    tag: 'Goal',    color: '#342F2F', text: '#fff' },
        { x: 170, y: 6,  w: 110, label: 'User Research',     tag: 'Input',   color: '#fff',    text: '#342F2F' },
        { x: 170, y: 76, w: 110, label: 'Market Analysis',   tag: 'Input',   color: '#fff',    text: '#342F2F' },
        { x: 320, y: 14, w: 110, label: 'Core Features',     tag: 'Phase 1', color: '#dbeafe', text: '#1e3a8a' },
        { x: 320, y: 84, w: 110, label: 'Go-to-market',      tag: 'Phase 2', color: '#dcfce7', text: '#14532d' },
        { x: 470, y: 44, w: 100, label: '✦ AI Clustering',   tag: 'AI',      color: '#f3e8ff', text: '#581c87' },
    ];
    const edges = [
        [{ x: 132, y: 38 }, { x: 170, y: 27 }],
        [{ x: 132, y: 38 }, { x: 170, y: 100 }],
        [{ x: 280, y: 27 }, { x: 320, y: 38 }],
        [{ x: 280, y: 100 }, { x: 320, y: 100 }],
        [{ x: 430, y: 38 }, { x: 470, y: 64 }],
        [{ x: 430, y: 106 }, { x: 470, y: 76 }],
    ];

    return (
        <svg viewBox="0 0 600 160" className="w-full h-full">
            {/* Dot grid */}
            <defs>
                <pattern id="dotgrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.8" fill="rgba(52,47,47,0.08)" />
                </pattern>
            </defs>
            <rect width="600" height="160" fill="url(#dotgrid)" />

            {/* Edges */}
            {edges.map(([a, b], i) => (
                <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke="rgba(52,47,47,0.15)" strokeWidth="1.5" strokeDasharray="4 3" />
            ))}

            {/* Nodes */}
            {nodes.map((n, i) => (
                <g key={i}>
                    <rect x={n.x} y={n.y} width={n.w} height={52} rx={10}
                        fill={n.color} stroke="rgba(0,0,0,0.07)" strokeWidth="1" />
                    {/* tag bar */}
                    <rect x={n.x} y={n.y} width={n.w} height={14} rx={10} fill="rgba(0,0,0,0.04)" />
                    <rect x={n.x} y={n.y + 8} width={n.w} height={6} fill="rgba(0,0,0,0.04)" />
                    <text x={n.x + 8} y={n.y + 10} fontSize="6" fontWeight="800"
                        fill={n.text} opacity="0.5" letterSpacing="0.5"
                        fontFamily="system-ui">{n.tag.toUpperCase()}</text>
                    <text x={n.x + 8} y={n.y + 33} fontSize="8.5" fontWeight="700"
                        fill={n.text} fontFamily="Georgia, serif">{n.label}</text>
                </g>
            ))}
        </svg>
    );
};

const Showcase = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const scale   = useTransform(scrollYProgress, [0, 0.45], [0.88, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
    const rotateX = useTransform(scrollYProgress, [0, 0.45], [12, 0]);
    const y       = useTransform(scrollYProgress, [0, 0.45], [60, 0]);

    return (
        <motion.section
            ref={ref}
            className="py-28 px-4 md:px-12 lg:px-24 flex flex-col items-center"
            style={{ perspective: '1200px' }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 max-w-xl"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">
                    <LayoutGrid size={10} /> Workspace
                </div>
                <h2 className="Melodrama-Bold text-4xl md:text-5xl text-[#342F2F] leading-tight">
                    Your ideas, <br />finally organized
                </h2>
                <p className="text-gray-400 mt-4 text-base leading-relaxed">
                    An infinite canvas that adapts to how you think — not the other way around.
                </p>
            </motion.div>

            {/* Browser mockup */}
            <motion.div
                style={{ scale, rotateX, y, opacity }}
                className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(52,47,47,0.18)] border border-black/8"
            >
                {/* Browser chrome */}
                <div className="bg-[#f5f3f1] border-b border-black/8 px-4 h-10 flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-md border border-black/8 text-[10px] text-gray-400 font-mono w-48">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            app.synapse.io/workspace
                        </div>
                    </div>
                </div>

                {/* App shell */}
                <div className="flex bg-[#f8f6f4]" style={{ height: '420px' }}>
                    {/* Left sidebar */}
                    <div className="w-52 bg-[#342F2F] flex flex-col py-3 px-2 shrink-0">
                        <div className="flex items-center gap-2 px-2 mb-4">
                            <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
                                <Sparkles size={9} className="text-white/60" />
                            </div>
                            <span className="text-white text-xs font-bold">Synapse</span>
                        </div>
                        {['Product Roadmap', 'Marketing Q4', 'UX Research', 'Architecture'].map((item, i) => (
                            <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 ${i === 0 ? 'bg-white/10' : ''}`}>
                                <GitBranch size={9} className={i === 0 ? 'text-white/70' : 'text-white/25'} />
                                <span className={`text-[9px] font-medium truncate ${i === 0 ? 'text-white' : 'text-white/30'}`}>{item}</span>
                            </div>
                        ))}
                        <div className="mt-auto px-2 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Zap size={9} className="text-blue-300" />
                                <span className="text-[8px] text-blue-300 font-bold">Quick Think AI</span>
                            </div>
                            <div className="space-y-1">
                                {['Analyze nodes', 'Cluster themes', 'Generate ideas'].map(s => (
                                    <div key={s} className="text-[8px] text-white/30 flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-white/20" />{s}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Canvas */}
                    <div className="flex-1 relative overflow-hidden">
                        <div className="absolute inset-0 p-6 flex items-center">
                            <MockCanvas />
                        </div>
                    </div>

                    {/* Right panel */}
                    <div className="w-44 bg-white border-l border-black/5 py-3 px-3 shrink-0">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-3">Properties</p>
                        {[
                            { label: 'Tag', value: 'Goal' },
                            { label: 'Color', value: 'Dark' },
                        ].map(({ label, value }) => (
                            <div key={label} className="mb-3">
                                <p className="text-[7px] text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
                                <div className="bg-gray-50 border border-gray-100 rounded-md px-2 py-1 text-[9px] text-gray-600">{value}</div>
                            </div>
                        ))}
                        <div className="mt-4 p-2 bg-purple-50 border border-purple-100 rounded-lg">
                            <p className="text-[7px] font-bold text-purple-500 mb-1">✦ AI Suggestion</p>
                            <p className="text-[7px] text-gray-400 leading-relaxed">3 related ideas detected nearby</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
};

export default Showcase;