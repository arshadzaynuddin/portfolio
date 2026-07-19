import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, TerminalSquare } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <main className="relative min-h-screen flex items-center justify-center bg-night-950 pt-24 px-6 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyanic-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-grid-pattern [background-size:60px_60px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center max-w-lg"
            >
                <div className="font-display text-8xl md:text-9xl font-bold text-gradient mb-4">404</div>

                <h1 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
                    Page not found
                </h1>
                <p className="text-night-400 mb-4">
                    This route doesn&apos;t exist — maybe it was migrated to a newer Odoo version. 😄
                </p>
                <p className="font-mono text-sm text-emerald-400/80 glass rounded-lg px-4 py-2 inline-block mb-8">
                    zsh: no such file or directory: {window.location.pathname}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-600 to-cyanic-500 text-white font-semibold rounded-xl shadow-glow hover:scale-105 transition-transform"
                    >
                        <Home size={18} /> Back to Home
                    </Link>
                    <Link
                        to="/terminal"
                        className="inline-flex items-center gap-2 px-6 py-3 glass glass-hover font-mono font-semibold text-emerald-400 rounded-xl"
                    >
                        <TerminalSquare size={18} /> ~/terminal
                    </Link>
                </div>
            </motion.div>
        </main>
    );
};

export default NotFoundPage;
