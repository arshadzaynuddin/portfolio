import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../UI/SectionTitle';
import TiltCard from '../UI/TiltCard';
import Reveal from '../UI/Reveal';
import { projects as localProjects } from '../../data/content';
import { fetchProjects, slugify } from '../../lib/firebase';
import { Sparkles, ArrowRight } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState(localProjects);

    // Projects managed from /admin (Firestore) replace the local list when present
    useEffect(() => {
        let cancelled = false;
        fetchProjects().then((remote) => {
            if (!cancelled && remote.length) setProjects(remote);
        });
        return () => { cancelled = true; };
    }, []);

    return (
        <section id="projects" className="section-shell bg-night-950">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <SectionTitle title="Featured Projects" subtitle="Case Studies" />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {projects.map((project, index) => (
                        <Reveal key={project.id || index} delay={index * 0.12} className="h-full">
                            <Link to={`/projects/${project.id || slugify(project.title)}`} className="block h-full">
                            <TiltCard className="flex flex-col h-full overflow-hidden group">
                                <div className="relative h-48 overflow-hidden bg-night-800 rounded-t-2xl">
                                    <img
                                        src={project.img || '/images/project_placeholder.svg'}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-night-950/90 via-night-950/20 to-transparent"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="text-xs font-bold glass text-cyanic-300 uppercase tracking-wider px-3 py-1.5 rounded-lg">
                                            {project.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-gradient transition-colors">
                                        {project.title}
                                    </h3>

                                    <p className="text-night-300 mb-6 flex-grow text-sm leading-relaxed">
                                        {project.description}
                                    </p>

                                    <div className="mb-6 flex flex-wrap gap-2">
                                        {(project.tech || []).map((tech, i) => (
                                            <span
                                                key={i}
                                                className="text-xs bg-accent-500/10 text-accent-300 px-2.5 py-1 rounded-md font-medium border border-accent-500/20"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="pt-5 border-t border-white/10 mt-auto">
                                        <ul className="space-y-2 mb-4">
                                            {(project.highlights || []).map((highlight, i) => (
                                                <li key={i} className="text-sm text-night-400 flex items-start gap-2">
                                                    <Sparkles size={14} className="text-cyanic-400 mt-0.5 flex-shrink-0" />
                                                    {highlight}
                                                </li>
                                            ))}
                                        </ul>
                                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-300 group-hover:text-white transition-colors">
                                            View case study
                                            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </TiltCard>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
