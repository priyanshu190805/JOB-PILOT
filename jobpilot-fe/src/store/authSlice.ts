import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService, { AuthResponse, User } from "@/services/authService";

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const login = createAsyncThunk(
    "auth/login",
    async (credentials: { email?: string; username?: string; password: string }, { rejectWithValue }) => {
        try {
            return await authService.login(credentials);
        } catch (err: any) {
            return rejectWithValue(err.message || "Server connection failed.");
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (
        userData: { fullName: string; username: string; email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            return await authService.register(userData);
        } catch (err: any) {
            return rejectWithValue(err.message || "Server connection failed.");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem("token");
        },
        clearError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
