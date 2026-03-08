import { motion } from 'framer-motion';
import { Zap, BrainCircuit, Wand2, Sparkles, ArrowRight } from 'lucide-react';

const features = [
    {
        title: 'Quick Think',
        description: 'Dump raw thoughts in bulk. The AI extracts key concepts and generates a structured graph — in seconds, not hours.',
        icon: Zap,
        gradient: 'from-blue-500/15 via-transparent to-transparent',
        accent: '#3b82f6',
        demo: (
            <div className="mt-6 p-3 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-2">Input</p>
                <p className="text-[10px] text-white/50 leading-relaxed italic">
                    "mobile app, fitness tracker, social sharing, gamification, progress charts, nutrition logging..."
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                    <div className="flex-1 h-px bg-blue-500/30" />
                    <Zap size={9} className="text-blue-400" />
                    <div className="flex-1 h-px bg-blue-500/30" />
                </div>
                <p className="text-[9px] text-blue-300 mt-2 font-semibold">→ 14 nodes generated across 4 clusters</p>
            </div>
        ),
    },
    {
        title: 'Semantic Clustering',
        description: 'The engine scans all your nodes and groups them by thematic similarity using vector embeddings — surfacing hidden connections.',
        icon: BrainCircuit,
        gradient: 'from-emerald-500/15 via-transparent to-transparent',
        accent: '#10b981',
        demo: (
            <div className="mt-6 flex flex-wrap gap-1.5">
                {[
                    { label: 'UX Flow',        color: '#3b82f6' },
                    { label: 'Tech Stack',      color: '#10b981' },
                    { label: 'Business Model',  color: '#f59e0b' },
                    { label: 'Competitors',     color: '#ef4444' },
                    { label: 'Roadmap',         color: '#8b5cf6' },
                ].map(({ label, color }) => (
                    <div key={label}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-bold"
                        style={{ borderColor: color + '40', color, backgroundColor: color + '15' }}>
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
                        {label}
                    </div>
                ))}
            </div>
        ),
    },
    {
        title: 'One-Shot Board',
        description: 'Describe your project in plain language. The AI generates a complete board with categories, sub-nodes, and logical connections.',
        icon: Wand2,
        gradient: 'from-orange-500/15 via-transparent to-transparent',
        accent: '#f97316',
        demo: (
            <div className="mt-6 space-y-1.5">
                {[
                    '📱  Mobile App Core',
                    '🎯  User Acquisition',
                    '💰  Monetization',
                    '🔧  Tech Infrastructure',
                ].map((item, i) => (
                    <motion.div key={item}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                    >
                        <span className="text-[10px] text-white/60 font-medium">{item}</span>
                        <ArrowRight size={8} className="ml-auto text-orange-400/60" />
                    </motion.div>
                ))}
            </div>
        ),
    },
];

const Features = () => (
    <section className="py-24 px-6 md:px-12 bg-[#342F2F] relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-2xl mx-auto mb-16"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[9px] font-black uppercase tracking-widest mb-5">
                    <Sparkles size={9} className="text-purple-400" fill="currentColor" />
                    Pro AI Features
                </div>
                <h2 className="Melodrama-Bold text-4xl md:text-5xl text-white tracking-tight leading-tight mb-4">
                    Supercharge your brain<br />
                    <span className="text-white/40">with </span>
                    <span className="Melodrama-Regular text-[#ded5cd]">Artificial Intelligence</span>
                </h2>
                <p className="text-gray-500 text-base leading-relaxed">
                    From instant graph generation to semantic clustering — the tools that turn chaos into clarity.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((f, i) => {
                    const Icon = f.icon;
                    return (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.12 }}
                            className="group relative rounded-3xl border border-white/6 bg-white/[0.04] p-7 hover:border-white/15 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                            {/* Gradient glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-[#2a2524] border border-white/8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Icon size={22} strokeWidth={1.5} style={{ color: f.accent }} />
                                    </div>
                                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-[9px] font-black text-white/40 uppercase tracking-widest">
                                        <Sparkles size={8} className="text-purple-400" fill="currentColor" />
                                        PRO
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>

                                {f.demo}

                                <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-white/25 group-hover:text-white/60 transition-colors cursor-pointer">
                                    <span>Discover feature</span>
                                    <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    </section>
);

export default Features;