const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface JobData {
    jobTitle: string;
    tags: string;
    jobRole: string;
    minSalary: string;
    maxSalary: string;
    salaryType: string;
    currency: string;
    educationLevel: string;
    experienceLevel: string;
    jobType: string;
    jobLevel: string;
    expirationDate: string;
    country: string;
    state: string;
    isRemote: boolean;
    description: string;
    requirements: string;
}

const jobService = {
    postJob: async (jobData: JobData, token: string) => {
        const res = await fetch(`${BASE_URL}/api/jobs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(jobData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to post job.");
        return data;
    },

    getJobs: async (params: {
        token: string;
        page?: number;
        limit?: number;
        search?: string;
        filters?: {
            jobType?: string;
            jobLevel?: string;
            educationLevel?: string;
            experienceLevel?: string;
            status?: string;
            isRemote?: boolean;
        }
    }) => {
        const { token, page = 1, limit = 10, search, filters } = params;
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search) queryParams.append("search", search);

        // Append explicit filters if they exist
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== "") {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const res = await fetch(`${BASE_URL}/api/jobs/my-jobs?${queryParams.toString()}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch jobs.");
        return data;
    },

    getJobById: async (id: string, token: string) => {
        const res = await fetch(`${BASE_URL}/api/jobs/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch job details.");
        return data;
    },

    deleteJob: async (id: string, token: string) => {
        const res = await fetch(`${BASE_URL}/api/jobs/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to delete job.");
        return data;
    },

    updateJob: async (id: string, jobData: JobData, token: string) => {
        const res = await fetch(`${BASE_URL}/api/jobs/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(jobData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to update job.");
        return data;
    }
};

export default jobService;
