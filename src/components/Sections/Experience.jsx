import SectionTitle from '../UI/SectionTitle';
import Reveal from '../UI/Reveal';
import { experience } from '../../data/content';
import { Calendar, MapPin } from 'lucide-react';

const Experience = () => {
    return (
        <section id="experience" className="section-shell bg-night-900/40">
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyanic-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <SectionTitle title="Professional Experience" subtitle="Career Trajectory" />

                <div className="mt-12 relative ml-4 space-y-12">
                    {/* Gradient timeline line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-accent-500 via-cyanic-400 to-transparent"></div>

                    {experience.map((job, index) => (
                        <Reveal key={index} delay={index * 0.15} className="relative pl-8 md:pl-12">
                            {/* Timeline dot */}
                            <div className="absolute -left-[8px] top-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-accent-500 to-cyanic-400 shadow-glow-sm ring-4 ring-night-950"></div>

                            <div className="glass glass-hover rounded-2xl p-6 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-display text-xl font-bold text-white">{job.role}</h3>
                                        <div className="text-lg font-semibold text-gradient">{job.company}</div>
                                    </div>
                                    <div className="flex flex-col md:items-end mt-2 md:mt-0 text-sm text-night-400 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-accent-400" /> {job.duration}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <MapPin size={14} className="text-cyanic-400" /> {job.location}
                                        </div>
                                    </div>
                                </div>

                                <p className="text-night-300 mb-5 italic border-l-2 border-accent-500/40 pl-4">
                                    {job.description}
                                </p>

                                <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2.5">
                                    {job.responsibilities.map((resp, i) => (
                                        <li key={i} className="text-night-300 text-sm flex items-start gap-2.5">
                                            <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-gradient-to-r from-accent-400 to-cyanic-400 flex-shrink-0"></span>
                                            <span>{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
