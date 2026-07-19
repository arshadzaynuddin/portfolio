import { ArrowRight, ChevronDown, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { personalDetails } from '../../data/content';

// Pure-CSS animated background: aurora blobs + floating geometric outlines.
// Transform-only animations, no JS per frame, no WebGL payload.
const HeroBackground = () => (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Aurora blobs */}
        <div
            className="absolute top-[8%] left-[10%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-accent-500/25 blur-[110px]"
            style={{ animation: 'drift-a 20s ease-in-out infinite' }}
        />
        <div
            className="absolute bottom-[5%] right-[8%] w-[40vw] h-[40vw] max-w-[540px] max-h-[540px] rounded-full bg-cyanic-500/20 blur-[110px]"
            style={{ animation: 'drift-b 26s ease-in-out infinite' }}
        />
        <div
            className="absolute top-[40%] left-[45%] w-[30vw] h-[30vw] max-w-[420px] max-h-[420px] rounded-full bg-accent-400/15 blur-[100px]"
            style={{ animation: 'drift-c 32s ease-in-out infinite' }}
        />

        {/* Floating geometric outlines (stand-ins for the old wireframes) */}
        <div
            className="absolute top-[18%] right-[12%] w-28 h-28 border border-accent-500/30 rounded-2xl animate-float"
            style={{ animation: 'spin-slow 24s linear infinite, float 7s ease-in-out infinite' }}
        />
        <div
            className="absolute bottom-[22%] left-[8%] w-20 h-20 border border-cyanic-400/30 rounded-full"
            style={{ animation: 'float 9s ease-in-out infinite' }}
        />
        <div
            className="absolute top-[60%] right-[22%] w-14 h-14 border border-accent-400/25 rotate-45"
            style={{ animation: 'float 6s ease-in-out infinite' }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern [background-size:60px_60px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]" />
    </div>
);

const Hero = () => {
    // Scroll-linked parallax: content drifts up and fades as you scroll past the hero
    const { scrollY } = useScroll();
    const contentY = useTransform(scrollY, [0, 700], [0, -120]);
    const contentOpacity = useTransform(scrollY, [0, 500], [1, 0.1]);
    const sceneScale = useTransform(scrollY, [0, 700], [1, 1.15]);

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-night-950 pt-20">
            {/* Animated background (pure CSS — no WebGL payload) */}
            <motion.div className="absolute inset-0" style={{ scale: sceneScale }}>
                <HeroBackground />
            </motion.div>

            <motion.div
                className="container mx-auto px-6 relative z-10"
                style={{ y: contentY, opacity: contentOpacity }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, type: 'spring' }}
                            className="relative animate-float"
                        >
                            {/* Rotating gradient ring */}
                            <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-accent-500 via-cyanic-400 to-accent-500 opacity-70 blur-md animate-spin [animation-duration:8s]"></div>
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-accent-500 to-cyanic-400 animate-spin [animation-duration:8s]"></div>
                            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-night-950 shadow-glow">
                                <img
                                    src={personalDetails.img}
                                    alt={personalDetails.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 glass p-3 rounded-full shadow-glow-sm">
                                <span className="text-2xl">👋</span>
                            </div>
                        </motion.div>

                        <div className="text-center md:text-left max-w-2xl">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full glass text-cyanic-300 text-sm font-medium mb-6"
                            >
                                <MapPin size={14} /> Based in {personalDetails.location}
                            </motion.span>
                            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight leading-tight">
                                Hi, I&apos;m{' '}
                                <span className="text-gradient">{personalDetails.name}</span>
                            </h1>
                            <h2 className="text-xl md:text-2xl text-night-300 font-medium mb-6">
                                {personalDetails.title}
                            </h2>
                            <p className="text-lg text-night-400 mb-8 leading-relaxed">
                                {personalDetails.tagline}
                            </p>

                            <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-4">
                                <a
                                    href="#contact"
                                    className="group px-8 py-3.5 bg-gradient-to-r from-accent-600 to-cyanic-500 text-white font-semibold rounded-xl shadow-glow hover:shadow-glow-cyan hover:scale-105 transition-all duration-300 flex items-center gap-2"
                                >
                                    Get in Touch
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a
                                    href="#projects"
                                    className="px-8 py-3.5 glass glass-hover text-night-200 font-semibold rounded-xl hover:text-white transition-all duration-300"
                                >
                                    View Projects
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Scroll hint */}
            <motion.a
                href="#expertise"
                aria-label="Scroll to expertise"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-night-500 hover:text-cyanic-400 transition-colors"
            >
                <ChevronDown size={28} className="animate-bounce" />
            </motion.a>
        </section>
    );
};

export default Hero;
