import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../utlis/baseUrl";

// Redirect Actions
const updateCommentRedirect = createAction('comment/updateCommentRedirect');

// Create Comment Action
export const createCommentAction = createAsyncThunk('comment/create', async(comment, { rejectWithValue, getState, dispatch }) => {
    // Get the user from state
    const user = getState()?.users;
    const { userAuth } = user;

    // Setup configurations
    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    };

    try {
        // http call
        const { data } = await axios.post(`${baseUrl}/api/comments/`, comment, config);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Delete Comment Action
export const deleteCommentAction = createAsyncThunk('comment/delete', async (commentId, { rejectWithValue, getState}) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    };

    try {
        const { data } = await axios.delete(`${baseUrl}/api/comments/${commentId}`, config);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Fetch Comment Action
export const fetchCommentDetailsAction = createAsyncThunk('comment/details', async (commentId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    };

    try {
        const { data } = await axios.get(`${baseUrl}/api/comments/${commentId}`, config);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});


// Update Comment Action
export const updateCommentAction = createAsyncThunk('comment/update', async (comment, { rejectWithValue, getState, dispatch })=> {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    };

    try {
        const { data } = await axios.put(`${baseUrl}/api/comments/${comment?.id}`, comment, config);

        // dispatch an action for redirection
        dispatch(updateCommentRedirect());
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});


// Create Slice
const commentSlices = createSlice({
    name: 'comment',
    initialState: {},
    extraReducers: (builder) => {
        // Create Comment Starts
            builder.addCase(createCommentAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(createCommentAction.fulfilled, (state, action) =>{
                state.loading = false;
                state.commentCreated = action?.payload;
                state.appErr = state.serverErr = undefined;
            });

            builder.addCase(createCommentAction.rejected, (state, action) => {
                state.loading = false;
                state.commentCreated = undefined;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Create Slice Ends

        // Fetch Comment Starts
            builder.addCase(fetchCommentDetailsAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(fetchCommentDetailsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.commentDetails = action?.payload;
                state.appErr = state.serverErr = undefined;
            });

            builder.addCase(fetchCommentDetailsAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Fetch Comment Ends

        // Update Comment Starts
            builder.addCase(updateCommentAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(updateCommentRedirect, (state, action) => {
                state.isUpdateCommentRedirection = true;
            });

            builder.addCase(updateCommentAction.fulfilled, (state, action) => {
                state.loading = false;
                state.isUpdateCommentRedirection = false;
                state.commentUpdated = action?.payload;
                state.appErr = state.serverErr = undefined;
            });

            builder.addCase(updateCommentAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Update Comment Ends

        // Delete Comment Starts
            builder.addCase(deleteCommentAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(deleteCommentAction.fulfilled, (state, action) => {
                state.loading = false;
                state.commentDeleted = action?.payload;
                state.appErr = state.serverErr = undefined;
            });

            builder.addCase(deleteCommentAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Delete Comment Ends
    }
});

export default commentSlices.reducer;