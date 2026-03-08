import { motion } from 'framer-motion';
import { Check, Sparkles, ArrowRight, Zap } from 'lucide-react';

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Perfect to get started.',
        features: ['1 workspace', '5 boards max', 'Core node editor', 'Community support'],
        cta: 'Start for free',
        ctaStyle: 'bg-gray-100 text-[#342F2F] hover:bg-gray-200',
        highlighted: false,
    },
    {
        name: 'Pro',
        price: '$29',
        period: 'per month',
        description: 'For serious thinkers.',
        features: ['Unlimited boards', 'AI Quick Think', 'Semantic Clustering', 'One-Shot Board', 'Priority support', 'Custom exports'],
        cta: 'Start Pro trial',
        ctaStyle: 'bg-[#342F2F] text-white hover:bg-[#1a1614]',
        highlighted: true,
        badge: 'Most popular',
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: 'per team',
        description: 'For large organizations.',
        features: ['Everything in Pro', 'Unlimited members', 'SSO & SAML', 'Dedicated CSM', 'SLA guarantee', 'On-premise option'],
        cta: 'Contact sales',
        ctaStyle: 'bg-gray-100 text-[#342F2F] hover:bg-gray-200',
        highlighted: false,
    },
];

const Pricing = () => (
    <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[9px] font-black uppercase tracking-widest mb-5">
                    <Zap size={9} className="text-[#342F2F]" /> Pricing
                </div>
                <h2 className="Melodrama-Bold text-4xl md:text-5xl font-bold text-[#342F2F] mb-4">
                    Simple, honest pricing
                </h2>
                <p className="text-gray-400 text-base">Start free. Scale when you're ready.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                {plans.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className={`relative flex flex-col rounded-3xl p-7 transition-all
                            ${plan.highlighted
                                ? 'bg-[#342F2F] text-white shadow-2xl shadow-[#342F2F]/30 md:-translate-y-3 ring-1 ring-[#342F2F]'
                                : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-lg'
                            }`}
                    >
                        {plan.badge && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                                    <Sparkles size={8} fill="currentColor" />
                                    {plan.badge}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <p className={`text-xs font-black uppercase tracking-widest mb-2 ${plan.highlighted ? 'text-white/40' : 'text-gray-400'}`}>
                                {plan.name}
                            </p>
                            <div className="flex items-end gap-1.5 mb-1">
                                <span className={`text-4xl font-black leading-none ${plan.highlighted ? 'text-white' : 'text-[#342F2F]'}`}>
                                    {plan.price}
                                </span>
                                {plan.price !== 'Custom' && (
                                    <span className={`text-sm mb-1 ${plan.highlighted ? 'text-white/40' : 'text-gray-400'}`}>
                                        / {plan.period}
                                    </span>
                                )}
                            </div>
                            <p className={`text-sm ${plan.highlighted ? 'text-white/50' : 'text-gray-400'}`}>
                                {plan.description}
                            </p>
                        </div>

                        <div className="h-px mb-6" style={{ backgroundColor: plan.highlighted ? 'rgba(255,255,255,0.08)' : '#f3f4f6' }} />

                        <ul className="space-y-3 mb-8 flex-1">
                            {plan.features.map(f => (
                                <li key={f} className={`flex items-center gap-2.5 text-sm ${plan.highlighted ? 'text-white/80' : 'text-gray-600'}`}>
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlighted ? 'bg-white/10' : 'bg-gray-100'}`}>
                                        <Check size={9} strokeWidth={3} className={plan.highlighted ? 'text-white' : 'text-gray-500'} />
                                    </div>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <button className={`w-full py-3 rounded-2xl text-sm font-black transition-all active:scale-[0.98] flex items-center justify-center gap-2 group ${plan.ctaStyle}`}>
                            {plan.cta}
                            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Trust line */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center text-xs text-gray-400 mt-8"
            >
                No credit card required · Cancel anytime · GDPR compliant
            </motion.p>
        </div>
    </section>
);

export default Pricing;