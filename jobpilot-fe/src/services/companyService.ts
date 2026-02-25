const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface CompanyData {
    companyName: string;
    orgType: string;
    industryType: string;
    teamSize: string;
    yearEstablished: string;
    aboutUs: string;
    location: string;
    phone: string;
    email: string;
    logo?: string;
}

const companyService = {
    setup: async (data: FormData, token: string) => {
        const res = await fetch(`${BASE_URL}/api/company/setup`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: data,
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Failed to save company profile.");
        return result;
    },

    getProfile: async (token: string) => {
        const res = await fetch(`${BASE_URL}/api/company/my-company`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await res.json();
        if (!res.ok) return null;
        return result;
    }
};

export default companyService;
