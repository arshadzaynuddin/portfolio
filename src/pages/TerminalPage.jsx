import { motion } from 'framer-motion';
import Terminal from '../components/Terminal/Terminal';

const TerminalPage = () => {
    return (
        <main className="relative min-h-screen flex items-center justify-center bg-night-950 pt-28 pb-16 px-6 overflow-hidden">
            {/* Ambient glows + grid, matching the hero */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-500/15 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyanic-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-grid-pattern [background-size:60px_60px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full"
            >
                <Terminal />
            </motion.div>
        </main>
    );
};

export default TerminalPage;
