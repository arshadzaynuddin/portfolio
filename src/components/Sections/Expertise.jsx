import { CheckCircle2, Server, Database, Cloud } from 'lucide-react';
import SectionTitle from '../UI/SectionTitle';
import TiltCard from '../UI/TiltCard';
import Reveal from '../UI/Reveal';
import { expertise } from '../../data/content';

const Expertise = () => {
    return (
        <section id="expertise" className="section-shell bg-night-950">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <SectionTitle
                    title="Core Expertise"
                    subtitle="Technical Capabilities"
                    center
                />

                <div className="grid md:grid-cols-2 gap-8 mt-12">
                    <Reveal>
                        <TiltCard className="p-8 h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-accent-500/20 to-accent-500/5 text-accent-400 border border-accent-500/20">
                                    <Database size={26} />
                                </div>
                                <h3 className="font-display text-2xl font-bold text-white">Odoo ERP Solutions</h3>
                            </div>
                            <ul className="space-y-4">
                                {expertise.odoo.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="text-accent-400 mt-1 flex-shrink-0" size={18} />
                                        <span className="text-night-300 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </TiltCard>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <TiltCard className="p-8 h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-cyanic-500/20 to-cyanic-500/5 text-cyanic-400 border border-cyanic-500/20">
                                    <Server size={26} />
                                </div>
                                <h3 className="font-display text-2xl font-bold text-white">Backend Engineering</h3>
                            </div>
                            <ul className="space-y-4">
                                {expertise.backend.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="text-cyanic-400 mt-1 flex-shrink-0" size={18} />
                                        <span className="text-night-300 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </TiltCard>
                    </Reveal>
                </div>

                <Reveal delay={0.2}>
                    <div className="mt-12 glass rounded-2xl p-8">
                        <h4 className="font-display text-lg font-bold text-white mb-5 flex items-center gap-2">
                            <Cloud size={20} className="text-accent-400" /> DevOps &amp; Infrastructure
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {expertise.devops.map((item, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 rounded-lg bg-night-800/80 border border-white/10 text-night-200 text-sm font-medium hover:border-accent-500/50 hover:text-white hover:shadow-glow-sm transition-all duration-300 cursor-default"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default Expertise;
