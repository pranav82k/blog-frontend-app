import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../utlis/baseUrl";

// Redirect Action
const redirectToPostList = createAction('posts/redirectToPostList');
const deletePostRedirect = createAction('posts/deletePostRedirect');

// Create Post Action
export const createPostAction = createAsyncThunk('posts/create', async (post, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    }

    try {
        const formData = new FormData();
        formData.append('title', post?.title);
        formData.append('description', post?.description);
        formData.append('category', post?.category?.label);
        formData.append('image', post?.image);
        // http call to create post
        const { data } = await axios.post(`${baseUrl}/api/posts`, formData, config);

        dispatch(redirectToPostList());

        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Fetch Post List Action
export const fetchPostsAction = createAsyncThunk('posts/list', async(category, { rejectWithValue, getState, dispatch }) => {
    try {
        if(category) {
            const { data } = await axios.get(`${baseUrl}/api/posts?category=${category}`);
            return data;
        } else {
            const { data } = await axios.get(`${baseUrl}/api/posts`);
            return data;
        }
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// AddLikes to post
export const toggleAddLikesToPost = createAsyncThunk('post/like', async (postId, { rejectWithValue, getState, dispatch }) => {
    // Get the token from state
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    }

    try {
        //http call
        const { data } = await axios.put(`${baseUrl}/api/posts/likes`, {postId}, config);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Add DisLikes to post
export const toggleAddDisLikesToPost = createAsyncThunk('post/dislike', async (postId, { rejectWithValue, getState, dispatch }) => {
    // Get the user from the state
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    }

    try {
        // http call
        const { data } = await axios.put(`${baseUrl}/api/posts/dislike`, {postId}, config);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Fetch Post Details Action
export const fetchPostDetailsAction = createAsyncThunk('posts/details', async(postId, { rejectWithValue, getState, dispatch }) => {
    try {
        const { data } = await axios.get(`${baseUrl}/api/posts/${postId}`);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Update Post Action
export const updatePostAction = createAsyncThunk('posts/update', async (post, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    }

    try {
        // http call to create post
        const { data } = await axios.put(`${baseUrl}/api/posts/${post?.id}`, {
            title: post?.title,
            description: post?.description,
            category: post?.category
        }, config);

        dispatch(redirectToPostList());

        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Delete Post Action
export const deletePostAction = createAsyncThunk('post/delete', async (postId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    };

    try {
        const { data } = await axios.delete(`${baseUrl}/api/posts/${postId}`, config);

        // dispatch an action for redirection
        dispatch(deletePostRedirect());
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }

});


// Slice
const postSlice = createSlice({
    name: 'post',
    initialState: {},
    extraReducers: (builder) => {
        // Redirect Action
        builder.addCase(redirectToPostList,(state, action) => {
            state.postRedirect = true;
        });

        builder.addCase(deletePostRedirect, (state, action) => {
            state.isDeletedRedirection = true;
        });

        // Create Post Starts
            builder.addCase(createPostAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(createPostAction.fulfilled, (state, action) => {
                state.loading = false;
                state.postRedirect = false;
                state.postCreated = action?.payload;
                state.appErr = undefined;
                state.serverErr = undefined;
            });

            builder.addCase(createPostAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Create Post Ends

        // Fetch Post List Starts
            builder.addCase(fetchPostsAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(fetchPostsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.postLists = action?.payload;
                state.appErr = undefined;
                state.serverErr = undefined;
            });

            builder.addCase(fetchPostsAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Fetch Post List Ends

        // Post Like Starts
            builder.addCase(toggleAddLikesToPost.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(toggleAddLikesToPost.fulfilled, (state, action) => {
                state.loading = false;
                state.likes = action?.payload;
                state.appErr = undefined;
                state.serverErr = undefined;
            });

            builder.addCase(toggleAddLikesToPost.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Post Like Ends

        // Post DisLike Starts
            builder.addCase(toggleAddDisLikesToPost.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(toggleAddDisLikesToPost.fulfilled, (state, action) => {
                state.loading = false;
                state.dislikes = action?.payload;
                state.appErr = undefined;
                state.serverErr = undefined;
            });

            builder.addCase(toggleAddDisLikesToPost.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Post DisLike Ends

        // Post Details Starts
            builder.addCase(fetchPostDetailsAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(fetchPostDetailsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.postDetails = action?.payload;
                state.appErr = undefined;
                state.serverErr = undefined;
            });

            builder.addCase(fetchPostDetailsAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Post DisLike Ends

        // Update Post Starts
            builder.addCase(updatePostAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(updatePostAction.fulfilled, (state, action) => {
                state.loading = false;
                state.postRedirect = false;
                state.postUpdated = action?.payload;
                state.appErr = undefined;
                state.serverErr = undefined;
            });

            builder.addCase(updatePostAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Update Post Ends

        // Delete Post Starts
            builder.addCase(deletePostAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(deletePostAction.fulfilled, (state, action) => {
                state.loading = false;
                state.postDeleted = action?.payload;
                state.isDeletedRedirection = false;
                state.appErr = state.serverErr = undefined;
            });

            builder.addCase(deletePostAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Delete Post End
    }
});

export default postSlice.reducer;