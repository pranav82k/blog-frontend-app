import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../utlis/baseUrl";

// send account verification token action
export const accVerificationSendTokenAction = createAsyncThunk('account/sendToken', async (payload, { rejectWithValue, getState, dispatch }) => {
    
    // get the user from state
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    };

    try {
        // http call
        const { data } = await axios.post(`${baseUrl}/api/users/generate-verify-email-token`, {}, config);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Account Verification Action
export const verifyAccountAction = createAsyncThunk('account/verify-account', async (token, { rejectWithValue, getState, dispatch }) => {
    // get the data from state
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    };

    try {
        // http call
        const { data } = await axios.put(`${baseUrl}/api/users/verify-account`, { token }, config);

        // Update data in local storage
        localStorage.setItem("userInfo", JSON.stringify({ ...userAuth, isAccountVerified: true }));
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Slice
const accountVerificationSlices = createSlice({
    name: 'accountVerification',
    initialState: {},
    extraReducers: (builder) => {
        // Account Verification Send Token Starts
            builder.addCase(accVerificationSendTokenAction.pending, (state, action) => {
                state.verificationLoading = true;
            });
            builder.addCase(accVerificationSendTokenAction.fulfilled, (state, action) => {
                state.verificationLoading = false;
                state.verificationAppErr = state.verificationServerErr = undefined;
                state.token = action?.payload;
            });
            builder.addCase(accVerificationSendTokenAction.rejected, (state, action) => {
                state.verificationLoading = false;
                state.verificationAppErr = action?.payload?.message;
                state.verificationServerErr = action?.error?.message;
            });
        // Account Verification Send Token Ends

        // Account Verify Starts
            builder.addCase(verifyAccountAction.pending, (state, action) => {
                state.loading = true;
            });
            builder.addCase(verifyAccountAction.fulfilled, (state, action) => {
                state.loading = false;
                state.appErr = state.serveErr = undefined;
                state.verified = action?.payload;
            });
            builder.addCase(verifyAccountAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serveErr = action?.error?.message;
            });
        // Account Verify Ends
    }
})

export default accountVerificationSlices.reducer;