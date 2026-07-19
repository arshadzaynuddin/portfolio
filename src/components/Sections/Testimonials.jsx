import { useState, useEffect } from 'react';
import SectionTitle from '../UI/SectionTitle';
import TiltCard from '../UI/TiltCard';
import Reveal from '../UI/Reveal';
import { fetchTestimonials } from '../../lib/firebase';
import { Quote, Star } from 'lucide-react';

const Stars = ({ rating }) => {
    const n = Math.min(5, Math.max(0, Math.round(rating)));
    if (!n) return null;
    return (
        <div className="flex gap-1 mb-4" aria-label={`${n} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    size={15}
                    className={i < n ? 'text-yellow-400 fill-yellow-400' : 'text-night-700'}
                />
            ))}
        </div>
    );
};

const Avatar = ({ testimonial }) => {
    if (testimonial.avatar) {
        return (
            <img
                src={testimonial.avatar}
                alt={testimonial.name}
                loading="lazy"
                className="w-11 h-11 rounded-full object-cover border border-white/15 flex-shrink-0"
            />
        );
    }
    return (
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-500/40 to-cyanic-500/30 border border-white/15 flex items-center justify-center text-white font-bold flex-shrink-0">
            {(testimonial.name || '?').charAt(0).toUpperCase()}
        </div>
    );
};

const Testimonials = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        let cancelled = false;
        fetchTestimonials().then((docs) => {
            if (!cancelled) {
                setItems(docs);
                // Let the navbar know whether the "Testimonials" link should be shown
                window.dispatchEvent(new CustomEvent('testimonials-loaded', { detail: docs.length }));
            }
        });
        return () => { cancelled = true; };
    }, []);

    // Nothing in the backend yet — hide the whole section
    if (!items.length) return null;

    return (
        <section id="testimonials" className="section-shell bg-night-950">
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyanic-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <SectionTitle title="Testimonials" subtitle="What People Say" center />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {items.map((t, index) => (
                        <Reveal key={t.id} delay={(index % 3) * 0.12} className="h-full">
                            <TiltCard className="flex flex-col h-full p-7">
                                <Quote size={26} className="text-accent-400/60 mb-4" aria-hidden="true" />
                                <Stars rating={t.rating} />
                                <p className="text-night-300 leading-relaxed flex-grow mb-6">
                                    &ldquo;{t.message}&rdquo;
                                </p>
                                <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                                    <Avatar testimonial={t} />
                                    <div className="min-w-0">
                                        <div className="font-semibold text-white truncate">{t.name}</div>
                                        {t.role && <div className="text-sm text-night-400 truncate">{t.role}</div>}
                                    </div>
                                </div>
                            </TiltCard>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
