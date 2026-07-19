import { useState, useEffect } from 'react';
import SectionTitle from '../UI/SectionTitle';
import TiltCard from '../UI/TiltCard';
import Reveal from '../UI/Reveal';
import { odooAppsConfig } from '../../data/content';
import { fetchOdooApps } from '../../lib/firebase';
import { ExternalLink, Package, Tag } from 'lucide-react';

const useOdooApps = () => {
    const [apps, setApps] = useState(odooAppsConfig.apps);

    useEffect(() => {
        let cancelled = false;
        const controller = new AbortController();

        const loadCustomApi = async () => {
            if (!odooAppsConfig.apiUrl) return [];
            try {
                const res = await fetch(odooAppsConfig.apiUrl, { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const remote = Array.isArray(data) ? data : data?.apps;
                return Array.isArray(remote) ? remote : [];
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.warn('Odoo apps API fetch failed:', err.message);
                }
                return [];
            }
        };

        // Merge: Firestore + custom API + local hardcoded list
        Promise.all([fetchOdooApps(), loadCustomApi()]).then(([firestoreApps, apiApps]) => {
            if (!cancelled) {
                const merged = [...firestoreApps, ...apiApps, ...odooAppsConfig.apps];
                setApps(merged);
                // Let the navbar know whether the "Odoo Apps" link should be shown
                window.dispatchEvent(new CustomEvent('odoo-apps-loaded', { detail: merged.length }));
            }
        });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, []);

    return apps;
};

const OdooApps = () => {
    const apps = useOdooApps();

    // No apps from backend or local config — hide the whole section
    if (!apps.length) return null;

    return (
        <section id="odoo-apps" className="section-shell bg-night-900/40">
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <SectionTitle title="Odoo Apps Gallery" subtitle="Published Modules" center />

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
                    {apps.map((app, index) => (
                        <Reveal key={app.link || index} delay={(index % 4) * 0.1} className="h-full">
                            <TiltCard className="flex flex-col h-full overflow-hidden group">
                                <div className="relative h-40 overflow-hidden bg-night-800 rounded-t-2xl flex items-center justify-center">
                                    {app.image ? (
                                        <img
                                            src={app.image}
                                            alt={app.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <Package size={48} className="text-night-600" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-night-950/80 via-transparent to-transparent"></div>
                                    {app.version && (
                                        <span className="absolute top-3 right-3 text-xs font-bold glass text-accent-300 px-2.5 py-1 rounded-lg">
                                            v{app.version}
                                        </span>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-gradient transition-colors">
                                        {app.name}
                                    </h3>

                                    {app.description && (
                                        <p className="text-night-400 text-sm leading-relaxed mb-4 flex-grow">
                                            {app.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                                        {app.price ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cyanic-300">
                                                <Tag size={13} /> {app.price}
                                            </span>
                                        ) : <span />}
                                        <a
                                            href={app.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-300 hover:text-white transition-colors"
                                        >
                                            View App <ExternalLink size={14} />
                                        </a>
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

export default OdooApps;
