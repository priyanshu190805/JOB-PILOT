import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import jobService, { JobData } from "@/services/jobService";
import { RootState } from "@/store/store";

interface JobState {
    jobs: any[];
    currentJob: any | null;
    pagination: {
        totalJobs: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    } | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: JobState = {
    jobs: [],
    currentJob: null,
    pagination: null,
    loading: false,
    error: null,
    success: false,
};

export const postJob = createAsyncThunk(
    "jobs/postJob",
    async ({ jobData, token }: { jobData: JobData; token: string }, { rejectWithValue }) => {
        try {
            return await jobService.postJob(jobData, token);
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to post job.");
        }
    }
);

export const getJobs = createAsyncThunk(
    "jobs/getJobs",
    async (params: any, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;

            if (!token) {
                return rejectWithValue("No authentication token found.");
            }

            return await jobService.getJobs({ ...params, token });
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to fetch jobs.");
        }
    }
);

export const getJobById = createAsyncThunk(
    "jobs/getJobById",
    async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
        try {
            return await jobService.getJobById(id, token);
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to fetch job details.");
        }
    }
);

export const deleteJob = createAsyncThunk(
    "jobs/deleteJob",
    async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
        try {
            return await jobService.deleteJob(id, token);
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to delete job.");
        }
    }
);

export const updateJob = createAsyncThunk(
    "jobs/updateJob",
    async ({ id, jobData, token }: { id: string; jobData: JobData; token: string }, { rejectWithValue }) => {
        try {
            return await jobService.updateJob(id, jobData, token);
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to update job.");
        }
    }
);

const jobSlice = createSlice({
    name: "jobs",
    initialState,
    reducers: {
        clearJobStatus: (state) => {
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Post Job
            .addCase(postJob.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(postJob.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = true;
                state.jobs.unshift(action.payload);
            })
            .addCase(postJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get Jobs
            .addCase(getJobs.pending, (state) => {
                state.loading = true;
            })
            .addCase(getJobs.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.jobs = action.payload.jobs;
                state.pagination = action.payload.pagination;
            })
            .addCase(getJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get Job By ID
            .addCase(getJobById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobById.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.currentJob = action.payload;
            })
            .addCase(getJobById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete Job
            .addCase(deleteJob.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.loading = false;
                // action.meta.arg contains { id, token }
                const deletedId = (action.meta.arg as any).id;
                state.jobs = state.jobs.filter(job => job._id !== deletedId);
                if (state.currentJob && state.currentJob._id === deletedId) {
                    state.currentJob = null;
                }
            })
            .addCase(deleteJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Job
            .addCase(updateJob.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateJob.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.success = true;
                state.currentJob = action.payload;
                const index = state.jobs.findIndex(j => (j._id || j.id) === action.payload._id);
                if (index !== -1) {
                    state.jobs[index] = action.payload;
                }
            })
            .addCase(updateJob.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearJobStatus } = jobSlice.actions;
export default jobSlice.reducer;
