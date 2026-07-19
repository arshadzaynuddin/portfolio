import SectionTitle from '../UI/SectionTitle';
import TiltCard from '../UI/TiltCard';
import Reveal from '../UI/Reveal';
import { personalDetails } from '../../data/content';
import { Mail, Linkedin } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="section-shell bg-night-950">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-accent-500/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <SectionTitle title="Get In Touch" subtitle="Contact Information" center />

                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        <Reveal>
                            <TiltCard className="flex flex-col items-center text-center p-10 h-full">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500/25 to-accent-500/5 border border-accent-500/25 flex items-center justify-center text-accent-300 mb-6">
                                    <Mail size={30} />
                                </div>
                                <h3 className="font-display text-xl font-bold text-white mb-2">Email</h3>
                                <p className="text-night-400 mb-6">
                                    Available for freelance opportunities and consulting.
                                </p>
                                <a
                                    href={`mailto:${personalDetails.email}`}
                                    className="text-gradient font-semibold hover:opacity-80 transition-opacity"
                                >
                                    {personalDetails.email}
                                </a>
                            </TiltCard>
                        </Reveal>

                        <Reveal delay={0.15}>
                            <TiltCard className="flex flex-col items-center text-center p-10 h-full">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyanic-500/25 to-cyanic-500/5 border border-cyanic-500/25 flex items-center justify-center text-cyanic-300 mb-6">
                                    <Linkedin size={30} />
                                </div>
                                <h3 className="font-display text-xl font-bold text-white mb-2">LinkedIn</h3>
                                <p className="text-night-400 mb-6">
                                    Connect with me for professional updates.
                                </p>
                                <a
                                    href={personalDetails.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gradient font-semibold hover:opacity-80 transition-opacity"
                                >
                                    View Profile
                                </a>
                            </TiltCard>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
