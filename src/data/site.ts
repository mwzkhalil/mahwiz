/**
 * Site identity and global copy.
 * Everything that describes who the site belongs to lives here so that
 * layouts, SEO metadata and pages share a single source of truth.
 */

export const site = {
    url: "https://mahwiz.me",
    domain: "mahwiz.me",
    name: "Muhammad Mahwiz Khalil",
    shortName: "Mahwiz",
    fullName: "Muhammad Mahwiz Khalil",
    role: "Python Engineer and NLP/ML Researcher",
    title: "Muhammad Mahwiz Khalil | NLP and Speech AI Engineer",
    description:
        "Portfolio of Muhammad Mahwiz Khalil, a Python engineer and NLP/ML researcher building Urdu speech, language, and production AI systems.",
    intro:
        "I build Urdu speech and language systems, from training data and model architecture to live inference and open-source releases.",
    avatar: "/photos/mahwiz-portrait.jpeg",
    defaultOgImage: "/photos/mahwiz-portrait.jpeg",
    links: {
        email: "khalilmahwiz@gmail.com",
        github: "https://github.com/mwzkhalil",
        huggingFace: "https://huggingface.co/mahwizzzz",
        linkedin: "https://www.linkedin.com/in/mahwiz-khalil",
        x: "https://x.com/mwzkhalil"
    },
    sections: {
        projects:
            "Live demos, released models, source code, and evaluation evidence.",
        skills:
            "Tools and methods I use to train, serve, and deploy machine learning systems.",
        experience:
            "Engineering, research, and teaching roles across applied AI.",
        posts:
            "Technical writing on Urdu NLP and speech systems.",
        education:
            "Computer science studies and technical training in Karachi.",
        certifications:
            "Professional training in machine learning, cloud, and data science."
    }
} as const;

export type Site = typeof site;
