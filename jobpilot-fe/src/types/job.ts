export interface Job {
    id: string | number;
    title: string;
    type: string;
    remaining: string;
    applicants: number;
    status: "Active" | "Expired" | "Draft";
}
