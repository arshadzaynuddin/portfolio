import { useState, useRef, useEffect, useCallback } from 'react';
import { personalDetails, expertise, experience, projects, getYearsOfExperience } from '../../data/content';

// ---- helpers ----------------------------------------------------------------

const pad = (str, len) => String(str).padEnd(len, ' ');

const table = (headers, rows) => {
    const widths = headers.map((h, i) =>
        Math.max(String(h).length, ...rows.map((r) => String(r[i]).length)) + 3
    );
    return [
        { color: 'text-yellow-400', text: headers.map((h, i) => pad(h, widths[i])).join('') },
        ...rows.map((r) => ({
            color: 'text-emerald-400',
            text: r.map((c, i) => pad(c, widths[i])).join(''),
        })),
    ];
};

const PROMPT = 'odoo-wizard@arshadOS:~$';

// ---- command registry -------------------------------------------------------

const RESOURCES = {
    'skills': () =>
        table(['NAME', 'STATUS'], [
            ['odoo-development', 'Running'],
            ['python-django', 'Running'],
            ['rest-apis', 'Running'],
            ['postgresql', 'Running'],
            ['data-migration', 'Running'],
            ['zatca-e-invoicing', 'Running'],
            ['nginx-linux-devops', 'Running'],
        ]),
    'odoo-versions': () =>
        table(['NAME', 'STATUS', 'AGE'], [
            ...[11, 12, 13, 14, 15, 16, 17, 18, 19].map((v) => [
                `odoo-v${v}`, 'Ready', `${Math.max(1, 2026 - 2017 - (v - 11))}y`,
            ]),
        ]),
    'experience': () =>
        table(['COMPANY', 'ROLE', 'DURATION'], experience.map((job) => [
            job.company, job.role, job.duration,
        ])),
    'projects': () =>
        table(['NAME', 'CATEGORY', 'STATUS'], projects.map((p) => [
            p.title, p.category, 'Deployed',
        ])),
    'favorite-stack': () =>
        table(['NAME', 'STATUS', 'ORIGIN'], [
            ['odoo', 'Ready', 'Belgium 🐘'],
            ['django', 'Ready', 'Python-land 🐍'],
            ['postgresql', 'Ready', 'Berkeley 🐘'],
        ]),
    'arshad': () => [
        { color: 'text-emerald-400', text: `${personalDetails.name} — ${personalDetails.title}` },
        { color: 'text-slate-300', text: `${getYearsOfExperience()}+ years building ERP & backend systems from ${personalDetails.location}.` },
        { color: 'text-slate-400', text: `Run 'contact' to reach me.` },
    ],
};

const buildCommands = () => ({
    help: () => [
        { color: 'text-yellow-400', text: 'Available commands:' },
        { color: 'text-emerald-400', text: '  kubectl get <resource>   inspect the cluster (this portfolio)' },
        { color: 'text-emerald-400', text: '  whoami                   who is this guy anyway' },
        { color: 'text-emerald-400', text: '  contact                  ways to reach me' },
        { color: 'text-emerald-400', text: '  sudo hire-arshad         you know you want to' },
        { color: 'text-emerald-400', text: '  clear                    wipe the screen' },
        { color: 'text-slate-400', text: "tip: arrow keys ↑↓ cycle command history." },
    ],
    whoami: () => RESOURCES['arshad'](),
    contact: () => [
        { color: 'text-yellow-400', text: 'CHANNEL      ADDRESS' },
        { color: 'text-emerald-400', text: 'email        ', link: { href: `mailto:${personalDetails.email}`, label: personalDetails.email } },
        { color: 'text-emerald-400', text: 'linkedin     ', link: { href: personalDetails.linkedin, label: personalDetails.linkedin, external: true } },
        { color: 'text-emerald-400', text: 'github       ', link: { href: personalDetails.github, label: personalDetails.github, external: true } },
    ],
    ls: () => [
        { color: 'text-cyan-300', text: 'expertise/  experience/  projects/  odoo-apps/  contact.txt' },
    ],
});

const runCommand = (raw) => {
    const input = raw.trim();
    if (!input) return [];

    const commands = buildCommands();
    const [cmd, sub, ...rest] = input.split(/\s+/);

    if (cmd === 'clear') return 'CLEAR';

    if (cmd === 'kubectl') {
        if (sub === 'get' && rest.length) {
            const resource = rest.join(' ');
            const handler = RESOURCES[resource];
            if (handler) return handler();
            return [
                { color: 'text-red-400', text: `Error from server (NotFound): resource "${resource}" not found` },
                { color: 'text-slate-400', text: `Available resources: ${Object.keys(RESOURCES).join(', ')}` },
            ];
        }
        return [
            { color: 'text-yellow-400', text: 'kubectl controls the arshad cluster. Usage:' },
            { color: 'text-emerald-400', text: '  kubectl get <resource>' },
            { color: 'text-slate-400', text: `Resources: ${Object.keys(RESOURCES).join(', ')}` },
        ];
    }

    if (cmd === 'sudo') {
        if (sub === 'hire-arshad') {
            return [
                { color: 'text-emerald-400', text: '✅ Permission granted. Excellent decision.' },
                { color: 'text-slate-300', text: 'Opening a channel → ', link: { href: `mailto:${personalDetails.email}`, label: personalDetails.email } },
            ];
        }
        return [{ color: 'text-red-400', text: 'odoo-wizard is not in the sudoers file. This incident will be reported. 🚨' }];
    }

    const handler = commands[cmd];
    if (handler) return handler();

    return [
        { color: 'text-red-400', text: `zsh: command not found: ${cmd}` },
        { color: 'text-slate-400', text: "type 'help' to see what works around here." },
    ];
};

// ---- component --------------------------------------------------------------

const BOOT_LINES = [
    { color: 'text-slate-500', text: '## arshad-prod-odoo-me-central-1' },
    { color: 'text-slate-300', text: "type `kubectl` to see what I'm hiding in here — or just click a command below." },
    { color: 'text-slate-300', text: 'tab autocompletes, arrow keys ↑↓ replay history. no cluster required, promise.' },
    { color: 'text-slate-500', text: '' },
];

// Everything a visitor can run — powers the quick-click chips and tab completion
const QUICK_COMMANDS = [
    'help',
    'whoami',
    'kubectl get skills',
    'kubectl get odoo-versions',
    'kubectl get experience',
    'kubectl get projects',
    'kubectl get favorite-stack',
    'contact',
    'sudo hire-arshad',
    'clear',
];

const COMPLETIONS = [
    ...QUICK_COMMANDS,
    'ls',
    'kubectl',
    ...Object.keys(RESOURCES).map((r) => `kubectl get ${r}`),
];

const Terminal = () => {
    const [lines, setLines] = useState(BOOT_LINES);
    const [value, setValue] = useState('');
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, [lines]);

    const focusInput = useCallback(() => inputRef.current?.focus({ preventScroll: true }), []);
    useEffect(() => { focusInput(); }, [focusInput]);

    // Refocus the input on click — but not while the user is selecting/copying text
    const handleTerminalClick = useCallback(() => {
        if (window.getSelection()?.toString()) return;
        focusInput();
    }, [focusInput]);

    const execute = (command) => {
        const output = runCommand(command);
        if (output === 'CLEAR') {
            setLines([]);
        } else {
            setLines((prev) => [
                ...prev,
                { prompt: true, text: command },
                ...output,
                ...(command.trim() ? [{ color: 'text-slate-500', text: '' }] : []),
            ]);
        }
        if (command.trim()) {
            setHistory((prev) => [command, ...prev]);
        }
        setHistoryIndex(-1);
        setValue('');
        focusInput();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            execute(value);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const query = value.trimStart().toLowerCase();
            if (!query) return;
            const match = COMPLETIONS.find((c) => c.startsWith(query) && c !== query);
            if (match) setValue(match);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const next = Math.min(historyIndex + 1, history.length - 1);
            if (history[next] !== undefined) {
                setHistoryIndex(next);
                setValue(history[next]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = historyIndex - 1;
            setHistoryIndex(next);
            setValue(next >= 0 ? history[next] : '');
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            setLines([]);
        }
    };

    return (
        <div
            className="glass rounded-2xl overflow-hidden shadow-glow cursor-text w-full max-w-4xl mx-auto select-text"
            onClick={handleTerminalClick}
        >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-night-900/90 border-b border-white/10">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="ml-3 text-sm text-night-400 font-medium">zsh — arshadOS v3.0 ⚡</span>
            </div>

            {/* Output */}
            <div
                ref={scrollRef}
                className="h-[60vh] min-h-[320px] overflow-y-auto p-5 font-mono text-sm leading-relaxed bg-night-950/80"
            >
                {lines.map((line, i) =>
                    line.prompt ? (
                        <div key={i} className="whitespace-pre-wrap break-words">
                            <span className="text-emerald-400 font-semibold">{PROMPT}</span>{' '}
                            <span className="text-cyan-300">{line.text}</span>
                        </div>
                    ) : (
                        <pre key={i} className={`whitespace-pre-wrap break-words ${line.color || 'text-slate-300'}`}>
                            {line.text || (line.link ? '' : ' ')}
                            {line.link && (
                                <a
                                    href={line.link.href}
                                    {...(line.link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-cyan-300 underline underline-offset-4 decoration-cyan-500/50 hover:text-white hover:decoration-cyan-300 transition-colors"
                                >
                                    {line.link.label}
                                </a>
                            )}
                        </pre>
                    )
                )}

                {/* Input line */}
                <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold flex-shrink-0">{PROMPT}</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent outline-none text-cyan-300 caret-cyan-300 font-mono"
                        spellCheck={false}
                        autoComplete="off"
                        autoCapitalize="off"
                        aria-label="Terminal input"
                    />
                </div>
            </div>

            {/* Quick commands — click to run, no typing needed */}
            <div className="flex flex-wrap gap-2 px-4 py-3 bg-night-900/90 border-t border-white/10">
                {QUICK_COMMANDS.map((cmd) => (
                    <button
                        key={cmd}
                        onClick={(e) => {
                            e.stopPropagation();
                            execute(cmd);
                        }}
                        className="font-mono text-xs px-3 py-1.5 rounded-lg border border-emerald-500/25 text-emerald-400/90 hover:text-emerald-300 hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-all duration-200"
                    >
                        {cmd}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Terminal;
