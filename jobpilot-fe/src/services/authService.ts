const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

const authService = {
    login: async (credentials: { email?: string; username?: string; password: string }): Promise<AuthResponse> => {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed.");
        return data as AuthResponse;
    },

    register: async (userData: {
        fullName: string;
        username: string;
        email: string;
        password: string;
    }): Promise<AuthResponse> => {
        const res = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed.");
        return data as AuthResponse;
    },
};

export default authService;
