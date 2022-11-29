import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../utlis/baseUrl";

// Redirect back to profile page
const redirectOnMailSentAction = createAction('mail/redirectOnMailSent');

// Send mail action
export const sendMailAction = createAsyncThunk('mail/sendMail', async(emailData, { rejectWithValue, getState, dispatch }) => {
    // Get the user from state
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`,
        }
    };

    try {
        // http call
        const { data } = await axios.post(`${baseUrl}/api/email`, {
            to: emailData?.recipientEmail,
            subject: emailData?.subject,
            message: emailData?.message
        }, config);

        // dispatch an action for redirection
        dispatch(redirectOnMailSentAction());
        return data;
    } catch (error) {
        if(error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Slice
const emailSlices = createSlice({
    name: 'email',
    initialState: {},
    extraReducers: (builder) => {
        builder.addCase(sendMailAction.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(redirectOnMailSentAction, (state, action) => {
            state.isRedirectOnMailSent = true;
        });
        builder.addCase(sendMailAction.fulfilled, (state, action) => {
            state.loading = false;
            state.isRedirectOnMailSent = false;
            state.mailSent = action?.payload;
            state.appErr = state.serverErr = undefined;
        });
        builder.addCase(sendMailAction.rejected, (state, action) => {
            state.loading = false;
            state.appErr = action?.payload?.message;
            state.serverErr = action?.error?.message;
        });
    }
});

export default emailSlices.reducer;