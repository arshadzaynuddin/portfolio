import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, TerminalSquare } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { personalDetails, odooAppsConfig } from '../../data/content';

const staticHasApps = odooAppsConfig.apps.length > 0 || Boolean(odooAppsConfig.apiUrl);

const buildNavLinks = (hasApps, hasTestimonials) => [
    { name: 'Expertise', href: '#expertise' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    ...(hasApps ? [{ name: 'Odoo Apps', href: '#odoo-apps' }] : []),
    { name: 'About', href: '#about' },
    ...(hasTestimonials ? [{ name: 'Testimonials', href: '#testimonials' }] : []),
    { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState('');
    const [hasApps, setHasApps] = useState(
        () => staticHasApps || sessionStorage.getItem('hasOdooApps') === '1'
    );
    const [hasTestimonials, setHasTestimonials] = useState(
        () => sessionStorage.getItem('hasTestimonials') === '1'
    );
    const navLinks = buildNavLinks(hasApps, hasTestimonials);

    // Sections announce how many items they loaded from the backend
    useEffect(() => {
        const onApps = (e) => {
            const loaded = e.detail > 0;
            setHasApps(loaded || staticHasApps);
            sessionStorage.setItem('hasOdooApps', loaded ? '1' : '0');
        };
        const onTestimonials = (e) => {
            const loaded = e.detail > 0;
            setHasTestimonials(loaded);
            sessionStorage.setItem('hasTestimonials', loaded ? '1' : '0');
        };
        window.addEventListener('odoo-apps-loaded', onApps);
        window.addEventListener('testimonials-loaded', onTestimonials);
        return () => {
            window.removeEventListener('odoo-apps-loaded', onApps);
            window.removeEventListener('testimonials-loaded', onTestimonials);
        };
    }, []);
    const location = useLocation();
    const isTerminal = location.pathname === '/terminal';

    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Highlight the section currently in view (home page only)
    useEffect(() => {
        if (isTerminal) {
            setActive('');
            return;
        }

        const sections = navLinks
            .map((link) => document.querySelector(link.href))
            .filter(Boolean);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(`#${entry.target.id}`);
                });
            },
            { rootMargin: '-40% 0px -55% 0px' }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [isTerminal, hasApps, hasTestimonials]);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || isTerminal ? 'glass shadow-lg shadow-night-950/50 py-3' : 'bg-transparent py-5'}`}>
            {/* Scroll progress bar */}
            <motion.div
                style={{ scaleX: progress }}
                className="absolute top-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-accent-500 to-cyanic-400"
            />

            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/#hero" className="flex flex-col group">
                    <span className="font-display text-xl font-bold text-white tracking-tight group-hover:text-gradient transition-colors">
                        {personalDetails.name}
                    </span>
                    <span className="text-xs text-night-400 font-medium tracking-wider uppercase">Portfolio</span>
                </Link>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={`/${link.href}`}
                            className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                                active === link.href
                                    ? 'text-white bg-white/5'
                                    : 'text-night-300 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {link.name}
                            {active === link.href && (
                                <motion.span
                                    layoutId="nav-active"
                                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-accent-400 to-cyanic-400"
                                />
                            )}
                        </Link>
                    ))}

                    {/* Terminal link */}
                    <Link
                        to="/terminal"
                        className={`ml-3 inline-flex items-center gap-2 text-sm font-mono font-semibold px-4 py-2 rounded-lg border transition-all duration-300 ${
                            isTerminal
                                ? 'text-emerald-300 border-emerald-500/50 bg-emerald-500/10 shadow-glow-sm'
                                : 'text-emerald-400/80 border-emerald-500/25 hover:text-emerald-300 hover:border-emerald-500/50 hover:bg-emerald-500/10'
                        }`}
                    >
                        <TerminalSquare size={16} /> ~/terminal
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-night-200 hover:text-white focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden absolute top-full left-0 w-full glass border-t border-white/5 shadow-xl py-4 flex flex-col items-center space-y-2"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={`/${link.href}`}
                            className={`font-medium px-6 py-2 rounded-lg w-4/5 text-center transition-colors ${
                                active === link.href ? 'text-white bg-white/10' : 'text-night-300 hover:text-white'
                            }`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="/terminal"
                        className="inline-flex items-center justify-center gap-2 font-mono font-semibold px-6 py-2 rounded-lg w-4/5 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <TerminalSquare size={16} /> ~/terminal
                    </Link>
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
