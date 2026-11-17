export interface Education {
    school: string;
    degree: string;
    field: string;
    start: string;
    end: string;
    notes: string[];
}

export const education: Education[] = [
    {
        school: "University of Karachi",
        degree: "Bachelor of Science",
        field: "Computer Science",
        start: "Sep 2024",
        end: "Aug 2027",
        notes: ["Karachi, Pakistan"]
    },
    {
        school: "Aligarh Institute of Technology",
        degree: "Diploma",
        field: "Computer Information Technology",
        start: "Oct 2020",
        end: "Oct 2023",
        notes: ["Pakistan"]
    }
];
