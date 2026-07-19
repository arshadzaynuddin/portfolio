import SectionTitle from '../UI/SectionTitle';
import Reveal from '../UI/Reveal';
import { getYearsOfExperience } from '../../data/content';

const yearsOfExperience = getYearsOfExperience();

const stats = [
    { value: `${yearsOfExperience}+`, label: 'Years Experience' },
    { value: '15+', label: 'Projects Delivered' },
    { value: '100%', label: 'Client Satisfaction' },
];

const About = () => {
    return (
        <section id="about" className="section-shell bg-night-900/40">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyanic-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <SectionTitle title="About Me" subtitle="Professional Profile" center />

                <div className="max-w-4xl mx-auto text-center">
                    <Reveal>
                        <div className="space-y-6 text-lg text-night-300 leading-relaxed">
                            <p>
                                I am a results-oriented <strong className="text-white">Odoo Developer and Backend Engineer</strong> with over {yearsOfExperience} years of experience
                                architecting and deploying enterprise-grade solutions. My expertise lies in bridging the gap between
                                complex business requirements and robust technical implementations, specifically within the Odoo ERP ecosystem
                                and Python-based backend architectures.
                            </p>
                            <p>
                                Currently stationed in <strong className="text-white">Abu Dhabi, UAE</strong>, I work with Vista Systems For Partitions, overseeing
                                critical backend operations and Odoo customizations. My background includes a proven track record of
                                managing large-scale data migrations, implementing Saudi ZATCA e-Invoicing compliance, and optimizing
                                system performance for high-availability environments.
                            </p>
                            <p>
                                Beyond technical code, I focus on delivering scalable, secure, and maintainable systems that drive
                                business efficiency. My work has been recognized by industry leaders and government bodies, reflecting
                                my commitment to excellence and innovation in software engineering.
                            </p>
                        </div>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <Reveal key={index} delay={index * 0.1}>
                                <div className="glass glass-hover rounded-2xl p-6">
                                    <div className="font-display text-4xl font-bold text-gradient mb-2">{stat.value}</div>
                                    <div className="text-sm font-medium text-night-400 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default About;
