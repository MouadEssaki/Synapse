import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const values = [
    {
        badge: 'Synchronization',
        title: 'Centralize your knowledge',
        description: 'Stop juggling ten tools. Every idea, diagram, and decision lives in one place — perfectly synced across your entire team in real time.',
        visual: (
            <div className="w-full h-full bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Animated sync rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {[1, 2, 3].map(i => (
                        <motion.div key={i}
                            className="absolute rounded-full border border-[#342F2F]/8"
                            style={{ width: i * 80, height: i * 80 }}
                            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.2, 0.6] }}
                            transition={{ duration: 2.4, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    ))}
                </div>
                {/* Center node */}
                <div className="relative z-10 bg-[#342F2F] rounded-2xl px-5 py-4 shadow-xl shadow-[#342F2F]/20">
                    <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1.5">Synapse</div>
                    <div className="text-sm font-bold text-white">All ideas synced</div>
                    <div className="flex items-center gap-1 mt-2">
                        {['blue', 'green', 'yellow', 'red'].map(c => (
                            <div key={c} className={`w-4 h-4 rounded-full border-2 border-white/20 bg-${c}-400`}
                                style={{ backgroundColor: { blue: '#60a5fa', green: '#4ade80', yellow: '#facc15', red: '#f87171' }[c] }} />
                        ))}
                        <span className="text-[9px] text-white/50 ml-1 font-semibold">4 members</span>
                    </div>
                </div>
                {/* Orbiting nodes */}
                {[
                    { top: '12%', left: '10%',  label: 'Marketing' },
                    { top: '10%', right: '8%',  label: 'Dev' },
                    { bottom: '14%', left: '8%', label: 'Design' },
                    { bottom: '12%', right: '10%', label: 'Strategy' },
                ].map(({ label, ...pos }) => (
                    <div key={label}
                        className="absolute bg-white rounded-xl px-3 py-1.5 shadow-md border border-gray-100 text-[9px] font-bold text-gray-500"
                        style={pos}
                    >
                        {label}
                    </div>
                ))}
            </div>
        ),
    },
    {
        badge: 'Analytics',
        title: 'Analyze your performance',
        description: 'Powerful dashboards surface what matters. Track idea velocity, identify bottlenecks, and make decisions grounded in real data — not gut feelings.',
        visual: (
            <div className="w-full h-full bg-[#342F2F] rounded-2xl flex flex-col p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full -translate-y-20 translate-x-20" />
                <div className="flex gap-1.5 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Board Overview</p>
                {/* Bars */}
                <div className="flex items-end gap-2 h-20 mb-4">
                    {[60, 85, 45, 95, 70, 55, 80].map((h, i) => (
                        <motion.div key={i}
                            className="flex-1 rounded-t-md"
                            style={{ background: i === 3 ? '#60a5fa' : 'rgba(255,255,255,0.12)' }}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                        />
                    ))}
                </div>
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { val: '48', label: 'Nodes' },
                        { val: '12', label: 'Clusters' },
                        { val: '94%', label: 'Coverage' },
                    ].map(({ val, label }) => (
                        <div key={label} className="bg-white/5 rounded-xl px-3 py-2">
                            <p className="text-base font-black text-white leading-none">{val}</p>
                            <p className="text-[8px] text-white/30 font-semibold mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        ),
    },
    {
        badge: 'Collaboration',
        title: 'Collaborate without limits',
        description: 'Invite your team, share boards with a single link, and comment in real time. Built for the way modern distributed teams actually work.',
        visual: (
            <div className="w-full h-full bg-gray-50 rounded-2xl border border-gray-100 flex flex-col p-5 gap-3">
                {/* Chat bubbles */}
                {[
                    { side: 'left',  name: 'Sarah', color: '#60a5fa', msg: 'Should we add a "Research" cluster here?' },
                    { side: 'right', name: 'Marc',  color: '#4ade80', msg: 'Yes! And connect it to the roadmap node.' },
                    { side: 'left',  name: 'Sarah', color: '#60a5fa', msg: 'Done ✓ The AI clustered 3 more ideas.' },
                ].map(({ side, name, color, msg }) => (
                    <div key={msg} className={`flex items-end gap-2 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
                        <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white text-[8px] font-black"
                            style={{ backgroundColor: color }}>
                            {name[0]}
                        </div>
                        <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-[10px] leading-relaxed font-medium
                            ${side === 'left' ? 'bg-white border border-gray-100 text-gray-600 rounded-bl-sm shadow-sm' : 'bg-[#342F2F] text-white rounded-br-sm'}`}>
                            {msg}
                        </div>
                    </div>
                ))}
                {/* Live indicator */}
                <div className="flex items-center gap-2 mt-auto">
                    <div className="flex -space-x-1">
                        {['#60a5fa', '#4ade80', '#f472b6'].map(c => (
                            <div key={c} className="w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-[9px] text-gray-400 font-semibold">3 editing live</span>
                    </div>
                </div>
            </div>
        ),
    },
];

const ValueBlock = ({ title, description, badge, visual, reversed, index }) => (
    <motion.div
        className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-20 mb-20 last:mb-0`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
    >
        {/* Visual */}
        <div className="w-full md:w-1/2">
            <div className="relative h-72 w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.09)]">
                {visual}
            </div>
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 bg-gray-100 text-gray-500">
                {badge}
            </div>
            <h3 className="Melodrama-Bold text-3xl md:text-4xl font-bold mb-5 text-[#342F2F] leading-tight">
                {title}
            </h3>
            <p className="text-base text-gray-400 leading-relaxed mb-8">
                {description}
            </p>
            <div className="flex items-center gap-2 text-[#342F2F] text-sm font-bold cursor-pointer group w-fit">
                <span>Learn more</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </motion.div>
);

const Values = () => (
    <section className="py-24 px-4 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-24"
            >
                <h2 className="Melodrama-Bold text-4xl md:text-5xl font-bold mb-4 text-[#342F2F]">Why choose us?</h2>
                <p className="text-lg text-gray-400 max-w-md mx-auto">Everything your team needs to think, build, and ship faster.</p>
            </motion.div>

            {values.map((v, i) => (
                <ValueBlock key={v.badge} {...v} reversed={i % 2 !== 0} index={i} />
            ))}
        </div>
    </section>
);

export default Values;