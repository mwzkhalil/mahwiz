export interface Certification {
    title: string;
    issuer: string;
    /** Issue month as shown on LinkedIn, e.g. "Jun 2026". */
    issued: string;
    credentialId?: string;
    credentialUrl?: string;
}

/** Ordered newest first. Source: LinkedIn "Licenses & certifications". */
export const certifications: Certification[] = [
    {
        title: "AI Security & Governance",
        issuer: "Securiti AI",
        issued: "Jun 2026",
        credentialId: "14AE603E3-14AE60252-144C1E68B"
    },
    {
        title: "Fundamentals of LLMs",
        issuer: "Hugging Face",
        issued: "Apr 2025"
    },
    {
        title: "AI Agents Fundamentals",
        issuer: "Hugging Face",
        issued: "Feb 2025",
        credentialId: "mwz"
    },
    {
        title: "Transformer Models and BERT Model",
        issuer: "Google Cloud",
        issued: "Feb 2024",
        credentialId: "NT6SCUZHKXLN"
    },
    {
        title: "Encoder-Decoder Architecture",
        issuer: "Google Cloud",
        issued: "Feb 2024",
        credentialId: "XNQ9FY56VBKH"
    },
    {
        title: "Attention Mechanism",
        issuer: "Google Cloud",
        issued: "Feb 2024",
        credentialId: "ZGAE8GG6UAWW"
    },
    {
        title: "Quantitative Research",
        issuer: "Coursera",
        issued: "May 2023"
    },
    {
        title: "Practical Data Science on the AWS Cloud Specialization",
        issuer: "Coursera",
        issued: "Dec 2021",
        credentialId: "4TBQJNLTAZFM"
    },
    {
        title: "Applied Data Science with Python Specialization",
        issuer: "Coursera",
        issued: "Nov 2021",
        credentialId: "2DPFRJHH7ZWM"
    },
    {
        title: "IBM Data Science Specialization",
        issuer: "Coursera",
        issued: "Nov 2021",
        credentialId: "JW9L5NKT6C5H"
    }
];
