import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { personalDetails } from '../../data/content';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-night-950 border-t border-white/5 py-12 overflow-hidden">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-accent-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="font-display text-2xl font-bold text-white">{personalDetails.name}</h3>
                        <p className="text-night-400 mt-2 text-sm max-w-xs">{personalDetails.tagline}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href={`mailto:${personalDetails.email}`}
                            className="p-3 rounded-xl glass glass-hover text-night-400 hover:text-white"
                            aria-label="Email"
                        >
                            <Mail size={20} />
                        </a>
                        <a
                            href={personalDetails.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl glass glass-hover text-night-400 hover:text-white"
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={20} />
                        </a>
                        <a
                            href={personalDetails.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl glass glass-hover text-night-400 hover:text-white"
                            aria-label="GitHub"
                        >
                            <Github size={20} />
                        </a>
                        <a
                            href="#hero"
                            className="p-3 rounded-xl bg-gradient-to-br from-accent-600 to-cyanic-500 text-white shadow-glow-sm hover:scale-110 transition-transform"
                            aria-label="Back to top"
                        >
                            <ArrowUp size={20} />
                        </a>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-8 pt-8 text-center text-night-500 text-sm">
                    <p>&copy; {currentYear} {personalDetails.name}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
