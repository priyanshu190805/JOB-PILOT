import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import companyService, { CompanyData } from "@/services/companyService";
import { RootState } from "@/store/store";

interface CompanyState {
    company: any | null;
    loading: boolean;
    error: string | null;
    setupSuccess: boolean;
}

const initialState: CompanyState = {
    company: null,
    loading: false,
    error: null,
    setupSuccess: false,
};

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const setupCompany = createAsyncThunk(
    "company/setup",
    async (data: any, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                return rejectWithValue("Authentication token missing. Please log in again.");
            }

            return await companyService.setup(data, token);
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to save company profile.");
        }
    }
);

export const getCompany = createAsyncThunk(
    "company/getCompany",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;
            if (!token) return rejectWithValue("No token found");
            return await companyService.getProfile(token);
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to fetch company profile.");
        }
    }
);

const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {
        resetSetupStatus(state) {
            state.setupSuccess = false;
            state.error = null;
        },
        clearCompanyError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(setupCompany.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.setupSuccess = false;
            })
            .addCase(setupCompany.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.company = action.payload.company;
                state.setupSuccess = true;
                state.error = null;
            })
            .addCase(setupCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.setupSuccess = false;
            })
            .addCase(getCompany.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCompany.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.company = action.payload;
                state.error = null;
            })
            .addCase(getCompany.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export const { resetSetupStatus, clearCompanyError } = companySlice.actions;
export default companySlice.reducer;
