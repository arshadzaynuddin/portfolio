// Public web-app config (safe to ship to the browser — security lives in Firestore rules)
const firebaseConfig = {
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'arshadk-arz',
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);

// Emails allowed to manage content from /admin.
// Must match the list in firestore.rules — the rules are what actually enforce it.
export const ADMIN_EMAILS = ['arshadzaynuddin@gmail.com', 'muhammedarshadh@gmail.com'];

export { firebaseConfig };

// ---- Public reads via the Firestore REST API ----
// The public site never loads the Firebase SDK (~174 KB gz) — a plain fetch()
// against the REST endpoint keeps the bundle small for slow connections.
// Only /admin (auth + writes) pulls in the real SDK, lazily.

const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

const parseValue = (v) => {
    if ('stringValue' in v) return v.stringValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return v.doubleValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('arrayValue' in v) return (v.arrayValue.values || []).map(parseValue);
    if ('mapValue' in v) return parseFields(v.mapValue.fields);
    if ('timestampValue' in v) return v.timestampValue;
    return null;
};

const parseFields = (fields = {}) =>
    Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, parseValue(v)]));

/**
 * Load all docs from a Firestore collection via REST, sorted by `sequence`.
 * Returns [] when Firebase isn't configured or the fetch fails.
 */
export const fetchCollectionDocs = async (name) => {
    if (!isFirebaseConfigured) return [];
    try {
        const res = await fetch(`${FIRESTORE_URL}/${name}?key=${firebaseConfig.apiKey}&pageSize=300`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return (data.documents || [])
            .map((d) => ({ id: d.name.split('/').pop(), ...parseFields(d.fields) }))
            .sort((a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity));
    } catch (err) {
        console.warn(`Firestore ${name} fetch failed:`, err.message);
        return [];
    }
};

// { name, image, link, description?, version?, price?, sequence }
export const fetchOdooApps = () => fetchCollectionDocs('odoo_apps');

// { title, category, description, img?, tech[], highlights[], sequence, content?, link?, github? }
export const fetchProjects = () => fetchCollectionDocs('projects');

// { name, role?, message, avatar?, rating?, sequence }
export const fetchTestimonials = () => fetchCollectionDocs('testimonials');

/** Fetch a single project document by id via REST; null if missing/unconfigured. */
export const fetchProjectById = async (id) => {
    if (!isFirebaseConfigured) return null;
    try {
        const res = await fetch(`${FIRESTORE_URL}/projects/${encodeURIComponent(id)}?key=${firebaseConfig.apiKey}`);
        if (!res.ok) return null;
        const d = await res.json();
        return { id, ...parseFields(d.fields) };
    } catch (err) {
        console.warn('Firestore project fetch failed:', err.message);
        return null;
    }
};

/** URL-safe slug, used as the route id for hardcoded (non-Firestore) projects. */
export const slugify = (str) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
