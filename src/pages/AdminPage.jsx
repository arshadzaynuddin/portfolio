import { useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import {
    getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged,
} from 'firebase/auth';
import {
    getFirestore, collection, getDocs, query, orderBy,
    doc, addDoc, updateDoc, deleteDoc,
} from 'firebase/firestore';
import { firebaseConfig, ADMIN_EMAILS } from '../lib/firebase';
import {
    LogIn, LogOut, Plus, Pencil, Trash2, Save, X, ShieldAlert, Package,
    Loader2, LayoutGrid, FolderKanban, MessageSquareQuote,
} from 'lucide-react';

// This page is lazy-loaded, so the auth/firestore SDKs stay out of the main bundle
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const splitList = (str, sep) => str.split(sep).map((s) => s.trim()).filter(Boolean);

// Field spec: textarea flag renders bigger input; span2 spans both grid columns
const COLLECTIONS = {
    odoo_apps: {
        label: 'Odoo Apps',
        icon: LayoutGrid,
        empty: { name: '', image: '', link: '', description: '', version: '', price: '', sequence: 1 },
        fields: [
            { key: 'name', placeholder: 'App name *' },
            { key: 'link', placeholder: 'App link (https://apps.odoo.com/...) *' },
            { key: 'image', placeholder: 'Image URL *', span2: true },
            { key: 'description', placeholder: 'Short description (optional)', span2: true },
            { key: 'version', placeholder: 'Odoo version, e.g. 17.0 (optional)' },
            { key: 'price', placeholder: 'Price, e.g. Free (optional)' },
            { key: 'sequence', placeholder: 'Order', type: 'number' },
        ],
        required: ['name', 'image', 'link'],
        toDoc: (f) => ({
            name: f.name.trim(),
            image: f.image.trim(),
            link: f.link.trim(),
            description: f.description.trim(),
            version: f.version.trim(),
            price: f.price.trim(),
            sequence: Number(f.sequence) || 0,
        }),
        fromDoc: (d) => ({ ...d }),
        listTitle: (d) => d.name,
        listSubtitle: (d) => d.link,
        listImage: (d) => d.image,
    },
    projects: {
        label: 'Projects',
        icon: FolderKanban,
        empty: { title: '', category: '', img: '', description: '', content: '', tech: '', highlights: '', link: '', github: '', sequence: 1 },
        fields: [
            { key: 'title', placeholder: 'Project title *' },
            { key: 'category', placeholder: 'Category, e.g. Odoo ERP *' },
            { key: 'img', placeholder: 'Image URL (optional — placeholder used if empty)', span2: true },
            { key: 'description', placeholder: 'Short description (shown on the card) *', textarea: true, span2: true },
            { key: 'content', placeholder: 'Full case study for the project page — blank lines separate paragraphs (optional)', textarea: true, span2: true },
            { key: 'tech', placeholder: 'Tech stack, comma separated: Django, DRF, PostgreSQL', span2: true },
            { key: 'highlights', placeholder: 'Highlights — one per line', textarea: true, span2: true },
            { key: 'link', placeholder: 'Live URL (optional)' },
            { key: 'github', placeholder: 'GitHub URL (optional)' },
            { key: 'sequence', placeholder: 'Order', type: 'number' },
        ],
        required: ['title', 'category', 'description'],
        toDoc: (f) => ({
            title: f.title.trim(),
            category: f.category.trim(),
            img: f.img.trim(),
            description: f.description.trim(),
            content: f.content.trim(),
            tech: splitList(f.tech, ','),
            highlights: splitList(f.highlights, '\n'),
            link: f.link.trim(),
            github: f.github.trim(),
            sequence: Number(f.sequence) || 0,
        }),
        fromDoc: (d) => ({
            ...d,
            tech: (d.tech || []).join(', '),
            highlights: (d.highlights || []).join('\n'),
        }),
        listTitle: (d) => d.title,
        listSubtitle: (d) => d.category,
        listImage: (d) => d.img,
    },
    testimonials: {
        label: 'Testimonials',
        icon: MessageSquareQuote,
        empty: { name: '', role: '', message: '', avatar: '', rating: '', sequence: 1 },
        fields: [
            { key: 'name', placeholder: 'Person name *' },
            { key: 'role', placeholder: 'Role & company, e.g. CEO, Baytonia (optional)' },
            { key: 'message', placeholder: 'Testimonial message *', textarea: true, span2: true },
            { key: 'avatar', placeholder: 'Avatar image URL (optional — initials shown if empty)', span2: true },
            { key: 'rating', placeholder: 'Rating 1–5 (optional)', type: 'number' },
            { key: 'sequence', placeholder: 'Order', type: 'number' },
        ],
        required: ['name', 'message'],
        toDoc: (f) => ({
            name: f.name.trim(),
            role: f.role.trim(),
            message: f.message.trim(),
            avatar: f.avatar.trim(),
            rating: Math.min(5, Math.max(0, Number(f.rating) || 0)),
            sequence: Number(f.sequence) || 0,
        }),
        fromDoc: (d) => ({ ...d, rating: d.rating || '' }),
        listTitle: (d) => d.name,
        listSubtitle: (d) => d.role || d.message,
        listImage: (d) => d.avatar,
    },
};

const inputCls = 'w-full bg-night-900/80 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-night-500 outline-none focus:border-accent-500/60 transition-colors';

const AdminPage = () => {
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(false);
    const [tab, setTab] = useState('odoo_apps');
    const [docs, setDocs] = useState([]);
    const [form, setForm] = useState(COLLECTIONS.odoo_apps.empty);
    const [editingId, setEditingId] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const cfg = COLLECTIONS[tab];
    const isAdmin = user && ADMIN_EMAILS.includes(user.email);

    useEffect(() => onAuthStateChanged(auth, (u) => {
        setUser(u);
        setAuthReady(true);
    }), []);

    const loadDocs = useCallback(async () => {
        const snapshot = await getDocs(query(collection(db, tab), orderBy('sequence', 'asc')));
        setDocs(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, [tab]);

    useEffect(() => {
        if (isAdmin) loadDocs().catch((e) => setError(e.message));
    }, [isAdmin, loadDocs]);

    const switchTab = (name) => {
        setTab(name);
        setForm(COLLECTIONS[name].empty);
        setEditingId(null);
        setError('');
        setDocs([]);
    };

    const handleSignIn = async () => {
        setError('');
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (e) {
            setError(e.message);
        }
    };

    const startEdit = (d) => {
        setEditingId(d.id);
        setForm({ ...cfg.empty, ...cfg.fromDoc(d) });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(cfg.empty);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const missing = cfg.required.filter((k) => !String(form[k]).trim());
        if (missing.length) {
            setError(`Required: ${missing.join(', ')}`);
            return;
        }
        setBusy(true);
        setError('');
        try {
            const data = cfg.toDoc(form);
            if (editingId) {
                await updateDoc(doc(db, tab, editingId), data);
            } else {
                await addDoc(collection(db, tab), data);
            }
            cancelEdit();
            await loadDocs();
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (d) => {
        if (!window.confirm(`Delete "${cfg.listTitle(d)}"? This cannot be undone.`)) return;
        setBusy(true);
        try {
            await deleteDoc(doc(db, tab, d.id));
            if (editingId === d.id) cancelEdit();
            await loadDocs();
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    };

    // ---- render states ----

    if (!authReady) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-night-950 pt-24">
                <Loader2 className="animate-spin text-accent-400" size={32} />
            </main>
        );
    }

    if (!user) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-night-950 pt-24 px-6">
                <div className="glass rounded-2xl p-10 text-center max-w-md w-full">
                    <h1 className="font-display text-2xl font-bold text-white mb-2">Admin Panel</h1>
                    <p className="text-night-400 mb-8">Sign in to manage the portfolio content.</p>
                    <button
                        onClick={handleSignIn}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-600 to-cyanic-500 text-white font-semibold rounded-xl shadow-glow hover:scale-105 transition-transform"
                    >
                        <LogIn size={18} /> Sign in with Google
                    </button>
                    {error && <p className="text-red-400 text-sm mt-6">{error}</p>}
                </div>
            </main>
        );
    }

    if (!isAdmin) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-night-950 pt-24 px-6">
                <div className="glass rounded-2xl p-10 text-center max-w-md w-full">
                    <ShieldAlert className="mx-auto text-red-400 mb-4" size={40} />
                    <h1 className="font-display text-2xl font-bold text-white mb-2">Not authorized</h1>
                    <p className="text-night-400 mb-8">{user.email} does not have admin access.</p>
                    <button
                        onClick={() => signOut(auth)}
                        className="inline-flex items-center gap-2 px-6 py-3 glass glass-hover text-night-200 font-semibold rounded-xl"
                    >
                        <LogOut size={18} /> Sign out
                    </button>
                </div>
            </main>
        );
    }

    const previewUrl = form.image || form.img;

    return (
        <main className="min-h-screen bg-night-950 pt-28 pb-16 px-6">
            <div className="container mx-auto max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-white">Content Admin</h1>
                        <p className="text-night-400 text-sm mt-1">Signed in as {user.email}</p>
                    </div>
                    <button
                        onClick={() => signOut(auth)}
                        className="inline-flex items-center gap-2 px-4 py-2 glass glass-hover text-night-300 hover:text-white text-sm font-medium rounded-lg"
                    >
                        <LogOut size={16} /> Sign out
                    </button>
                </div>

                {/* Collection tabs */}
                <div className="flex gap-2 mb-8">
                    {Object.entries(COLLECTIONS).map(([name, c]) => {
                        const Icon = c.icon;
                        return (
                            <button
                                key={name}
                                onClick={() => switchTab(name)}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    tab === name
                                        ? 'bg-gradient-to-r from-accent-600 to-cyanic-500 text-white shadow-glow-sm'
                                        : 'glass glass-hover text-night-300 hover:text-white'
                                }`}
                            >
                                <Icon size={16} /> {c.label}
                            </button>
                        );
                    })}
                </div>

                {/* Add / edit form */}
                <form onSubmit={handleSave} className="glass rounded-2xl p-6 mb-10">
                    <h2 className="font-display text-lg font-bold text-white mb-5 flex items-center gap-2">
                        {editingId ? <Pencil size={18} className="text-accent-400" /> : <Plus size={18} className="text-accent-400" />}
                        {editingId ? `Edit ${cfg.label.replace(/s$/, '').toLowerCase()}` : `Add new ${cfg.label.replace(/s$/, '').toLowerCase()}`}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {cfg.fields.map((f) => (
                            <div key={f.key} className={f.span2 ? 'md:col-span-2' : ''}>
                                {f.textarea ? (
                                    <textarea
                                        value={form[f.key]}
                                        onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                                        placeholder={f.placeholder}
                                        rows={3}
                                        className={inputCls}
                                    />
                                ) : (
                                    <input
                                        value={form[f.key]}
                                        onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                                        placeholder={f.placeholder}
                                        type={f.type || 'text'}
                                        className={inputCls}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="preview"
                            className="mt-4 h-24 rounded-lg border border-white/10 object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                            onLoad={(e) => { e.target.style.display = ''; }}
                        />
                    )}

                    {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

                    <div className="flex gap-3 mt-6">
                        <button
                            type="submit"
                            disabled={busy}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent-600 to-cyanic-500 text-white font-semibold rounded-xl shadow-glow-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {editingId ? 'Update' : 'Add'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="inline-flex items-center gap-2 px-5 py-2.5 glass glass-hover text-night-300 font-medium rounded-xl"
                            >
                                <X size={16} /> Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* Existing docs */}
                <h2 className="font-display text-lg font-bold text-white mb-4">
                    Published {cfg.label.toLowerCase()} ({docs.length})
                </h2>
                {docs.length === 0 ? (
                    <p className="text-night-500 text-sm">
                        Nothing here yet — add your first one above.
                        {tab === 'projects' && ' Until then, the site shows the hardcoded projects from content.js.'}
                    </p>
                ) : (
                    <div className="space-y-3">
                        {docs.map((d) => (
                            <div key={d.id} className="glass rounded-xl p-4 flex items-center gap-4">
                                {cfg.listImage(d) ? (
                                    <img src={cfg.listImage(d)} alt={cfg.listTitle(d)} className="w-14 h-14 rounded-lg object-cover border border-white/10 flex-shrink-0" />
                                ) : (
                                    <div className="w-14 h-14 rounded-lg bg-night-800 flex items-center justify-center flex-shrink-0">
                                        <Package size={22} className="text-night-600" />
                                    </div>
                                )}
                                <div className="flex-grow min-w-0">
                                    <div className="font-semibold text-white truncate">
                                        {cfg.listTitle(d)}
                                        {d.version && <span className="ml-2 text-xs text-accent-300">v{d.version}</span>}
                                    </div>
                                    <div className="text-xs text-night-400 truncate">{cfg.listSubtitle(d)}</div>
                                </div>
                                <span className="text-xs text-night-500 font-mono flex-shrink-0">#{d.sequence}</span>
                                <button
                                    onClick={() => startEdit(d)}
                                    className="p-2 rounded-lg text-night-400 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
                                    aria-label={`Edit ${cfg.listTitle(d)}`}
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(d)}
                                    className="p-2 rounded-lg text-night-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                                    aria-label={`Delete ${cfg.listTitle(d)}`}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default AdminPage;
