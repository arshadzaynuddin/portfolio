import { Github, Linkedin, Mail, FileText } from 'lucide-react';

export const careerStart = new Date('2022-11-28');

export const getYearsOfExperience = () => {
    const now = new Date();
    let years = now.getFullYear() - careerStart.getFullYear();
    const monthDiff = now.getMonth() - careerStart.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < careerStart.getDate())) {
        years--;
    }
    return years;
};

export const personalDetails = {
    name: "Arshad K",
    title: "Odoo Developer & Implementor | Django Backend Engineer",
    tagline: "Building scalable enterprise solutions and robust backend architectures.",
    location: "Abu Dhabi, UAE",
    email: "arshadzaynuddin@gmail.com", // Placeholder
    linkedin: "https://linkedin.com/in/arshadzaynuddin", // Placeholder
    github: "https://github.com/arshadzaynuddin", // Placeholder
    resume: "/resume.pdf", // Placeholder path
    img: "/images/profile_image.png",
};

export const expertise = {
    odoo: [
        "Odoo versions 11 to 19",
        "Custom module development (Sales, Purchase, Inventory, HR, Accounting, Logistics)",
        "Large-scale data migration (Odoo 11 → Odoo 18)",
        "REST & XML-RPC integrations",
        "QWeb PDF reporting",
        "ZATCA Phase I & II e-Invoicing (Saudi Arabia)",
        "Production deployment and performance optimization"
    ],
    backend: [
        "Python, Django, Django REST Framework",
        "Secure and scalable REST APIs",
        "Role-based access systems",
        "ERP ↔ Mobile ↔ Web app integrations",
        "Financial systems (cash flow, expense tracking)"
    ],
    devops: [
        "VPS server handling",
        "Nginx configuration",
        "Linux server management"
    ]
};

export const experience = [
    {
        company: "Vista Systems For Partitions",
        location: "Abu Dhabi, UAE",
        role: "Odoo Developer & Backend Engineer",
        duration: "Jan 2026 – Present",
        description: "Leading Odoo ERP implementation and backend architecture for enterprise-scale glass manufacturing operations, optimizing manufacturing, inventory, and financial workflows.",
        responsibilities: [
            "Leading end-to-end Odoo ERP implementation including requirement gathering, GAP analysis, and solution design.",
            "Customizing and developing Odoo modules for manufacturing, inventory, sales, and accounting workflows.",
            "Project planning, task breakdown, and effort estimation for ERP implementations and internal tools.",
            "Designing technical architecture and database structures for scalable Odoo deployments.",
            "Developing secure backend APIs and internal service integrations.",
            "Managing server infrastructure, deployment pipelines, and production environments.",
            "Handling performance optimization, debugging, and system monitoring.",
            "Coordinating with functional teams to translate business requirements into technical solutions."
        ]
    },
    {
        company: "Odox Softhub LLP",
        location: "India",
        role: "Odoo Developer",
        duration: "Nov 2022 – Jan 2026",
        description: " Delivered end-to-end ERP solutions and backend systems for diverse clients. Worked As Resource Developer For techbot ERP UAE and Baytonia.com Saudi Arabia.",
        responsibilities: [
            "Developed custom Odoo modules for Sales, HR, and Accounting.",
            "Handled database migrations from legacy systems to Odoo 18.",
            "Integrated third-party APIs and payment gateways.",
            "Mentored junior developers and conducted code reviews."
        ]
    }
];

export const projects = [
    {
        title: "Biebite App Backend",
        category: "Backend Engineering",
        description: "Award-winning application backend recognized by H.H. Sheikh Hamdan bin Rashid Al Maktoum.",
        tech: ["Django", "DRF", "PostgreSQL"],
        highlights: ["Scalable API architecture", "Real-time data processing", "High availability setup"],
        img: "/images/project_placeholder.svg"
    },
    {
        title: "Large-scale Odoo Migration",
        category: "Odoo ERP",
        description: "Complex migration project upgrading an enterprise system from Odoo 11 to Odoo 18.",
        tech: ["Odoo", "Python", "PostgreSQL"],
        highlights: ["Data integrity preservation", "Custom module porting", "Downtime minimization"],
        img: "/images/project_placeholder.svg"
    },
    {
        title: "Cash Flow Management System",
        category: "FinTech",
        description: "A tailored financial system for tracking cash flow and expenses.",
        tech: ["Django", "React", "Docker"],
        highlights: ["Automated reporting", "Role-based access control", "Dashboard analytics"],
        img: "/images/project_placeholder.svg"
    }
];

// ---- Odoo Apps Gallery ----
// Apps are loaded dynamically. Two sources, merged in this order:
//   1. `apiUrl` — your backend endpoint returning JSON:
//        [{ "name": "...", "image": "https://...", "link": "https://...",
//           "description": "...", "version": "17.0", "price": "Free" }]
//      (only `name`, `image`, `link` are required)
//   2. `apps` — a local list you can hardcode below.
// If both are empty / the fetch fails, the whole section stays hidden.
export const odooAppsConfig = {
    apiUrl: import.meta.env.VITE_ODOO_APPS_API || null,
    apps: [
        // Example:
        // {
        //     name: "ZATCA E-Invoicing Phase II",
        //     image: "/images/apps/zatca.png",
        //     link: "https://apps.odoo.com/apps/modules/...",
        //     description: "Saudi Arabia ZATCA Phase I & II compliance for Odoo.",
        //     version: "17.0",
        //     price: "Paid",
        // },
    ],
};
