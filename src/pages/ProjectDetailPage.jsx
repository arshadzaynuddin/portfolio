import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Sparkles, Loader2 } from 'lucide-react';
import { projects as localProjects } from '../data/content';
import { fetchProjectById, slugify } from '../lib/firebase';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        window.scrollTo(0, 0);
        (async () => {
            // Firestore first; fall back to the hardcoded list matched by slug
            const remote = await fetchProjectById(id);
            const found = remote || localProjects.find((p) => slugify(p.title) === id) || null;
            if (!cancelled) {
                setProject(found);
                setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-night-950 pt-24">
                <Loader2 className="animate-spin text-accent-400" size={32} />
            </main>
        );
    }

    if (!project) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-night-950 pt-24 px-6">
                <div className="glass rounded-2xl p-10 text-center max-w-md w-full">
                    <h1 className="font-display text-2xl font-bold text-white mb-2">Project not found</h1>
                    <p className="text-night-400 mb-8">This project doesn&apos;t exist or was removed.</p>
                    <Link
                        to="/#projects"
                        className="inline-flex items-center gap-2 px-6 py-3 glass glass-hover text-night-200 font-semibold rounded-xl"
                    >
                        <ArrowLeft size={18} /> Back to projects
                    </Link>
                </div>
            </main>
        );
    }

    const paragraphs = (project.content || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

    return (
        <main className="relative min-h-screen bg-night-950 pt-28 pb-20 px-6 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto max-w-4xl relative z-10"
            >
                <Link
                    to="/#projects"
                    className="inline-flex items-center gap-2 text-sm font-medium text-night-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft size={16} /> All projects
                </Link>

                {/* Banner */}
                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden glass mb-8">
                    <img
                        src={project.img || '/images/project_placeholder.svg'}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/30 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                        <span className="text-xs font-bold glass text-cyanic-300 uppercase tracking-wider px-3 py-1.5 rounded-lg">
                            {project.category}
                        </span>
                        <h1 className="font-display text-3xl md:text-5xl font-bold text-white mt-3">
                            {project.title}
                        </h1>
                    </div>
                </div>

                {/* Action links */}
                {(project.link || project.github) && (
                    <div className="flex flex-wrap gap-3 mb-8">
                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-600 to-cyanic-500 text-white text-sm font-semibold rounded-xl shadow-glow-sm hover:scale-105 transition-transform"
                            >
                                <ExternalLink size={16} /> View Live
                            </a>
                        )}
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 glass glass-hover text-night-200 text-sm font-semibold rounded-xl"
                            >
                                <Github size={16} /> Source Code
                            </a>
                        )}
                    </div>
                )}

                {/* Overview */}
                <p className="text-lg text-night-300 leading-relaxed mb-8">{project.description}</p>

                {/* Full write-up */}
                {paragraphs.length > 0 && (
                    <div className="space-y-5 text-night-300 leading-relaxed mb-10">
                        {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Tech stack */}
                    {(project.tech || []).length > 0 && (
                        <div className="glass rounded-2xl p-6">
                            <h2 className="font-display text-lg font-bold text-white mb-4">Tech Stack</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map((tech, i) => (
                                    <span key={i} className="text-sm bg-accent-500/10 text-accent-300 px-3 py-1.5 rounded-lg font-medium border border-accent-500/20">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Highlights */}
                    {(project.highlights || []).length > 0 && (
                        <div className="glass rounded-2xl p-6">
                            <h2 className="font-display text-lg font-bold text-white mb-4">Key Highlights</h2>
                            <ul className="space-y-3">
                                {project.highlights.map((h, i) => (
                                    <li key={i} className="text-sm text-night-300 flex items-start gap-2.5">
                                        <Sparkles size={15} className="text-cyanic-400 mt-0.5 flex-shrink-0" />
                                        {h}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </motion.div>
        </main>
    );
};

export default ProjectDetailPage;
