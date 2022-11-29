import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../utlis/baseUrl';

// Redirect Actions
const profilePhotoRedirectionAction = createAction('user/profilePhoto/redirection');
const profileUpdateRedirectionAction = createAction('user/profileUpdate/redirection');
// const passwordUpdateRedirectionAction = createAction('user/passwordUpdate/redirection');

// Create Register Action
export const registerUserAction = createAsyncThunk('users/register', async (user, { rejectWithValue, getState, dispatch }) => {
    // Configurations
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        // API Call
        const { data } = await axios.post(`${baseUrl}/api/users/register`, user, config);
        return data;
    } catch (error) {
        if(!error?.response) {
            throw error;
        }
        return rejectWithValue(error?.response?.data);
    }
});

// Create Login Action
export const loginUserAction = createAsyncThunk('users/login', async (user, {rejectWithValue, getState, dispatch}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    try {
        const { data } = await axios.post(`${baseUrl}/api/users/login`, user, config);
        localStorage.setItem("userInfo", JSON.stringify(data));
        return data;
    } catch (error) {
        if(!error?.response) {
            throw error;
        }
        return rejectWithValue(error?.response?.data);
    }
})

// Create Logout using Async Action
export const logoutAsyncUserAction = createAsyncThunk('users/logout', async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
        localStorage.removeItem("userInfo");
    } catch (error) {
        if(!error?.response) {
            throw error;
        }
        return rejectWithValue(error?.response?.data);
    }
})

// Logout using createAction Experimental Purpose
export const logoutAction = createAction('users/logout2', async(payload) => {
    try {
        localStorage.removeItem("userInfo");
    } catch (error) {
        if(!error?.response) {
            throw error;
        }
        return error?.response?.data;
    }
})

// Profile Actions

// Fetch Profile Details
export const userProfileAction = createAsyncThunk('user/profile', async (userId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`,
        }
    };

    try {
        //http call
        const { data } = await axios.get(`${baseUrl}/api/users/profile/${userId}`, config);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Upload Profile Photo
export const uploadProfilePhotoAction = createAsyncThunk('user/profilePhoto', async(userData, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    }

    try {
        const formData = new FormData();
        formData.append('image', userData?.image);

        //http call
        const { data } = await axios.put(`${baseUrl}/api/users/upload-profile-photo`, formData, config);
        
        localStorage.setItem("userInfo", JSON.stringify({ ...userAuth, data }));
        // dispatch an action
        dispatch(profilePhotoRedirectionAction());
        
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Update user profile
export const updateUserProfileAction = createAsyncThunk('user/profile/update', async (userData, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`,
        }
    };

    try {
        const { data } = await axios.put(`${baseUrl}/api/users/profile`, userData, config);
        localStorage.setItem("userInfo", JSON.stringify({ ...userAuth, data }));

        // dispatch an action
        dispatch(profileUpdateRedirectionAction());

        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Update Password Action
export const updatePasswordAction = createAsyncThunk('password/update', async (password, {rejectWithValue, getState, dispatch}) => {
    // Get the user from the state
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    };

    try {
        // http call
        const { data } = await axios.put(`${baseUrl}/api/users/password`, password, config);

        // Dispatch an action for redirection
        dispatch(profileUpdateRedirectionAction());
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Forgot password Action
export const passwordResetTokenAction = createAsyncThunk('password/forgot', async (email, {rejectWithValue, getState, dispatch}) => {
    try {
        // http call
        const { data } = await axios.post(`${baseUrl}/api/users/forgot-password-token`, email);

        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Reset password Action
export const passwordResetAction = createAsyncThunk('password/reset', async (userData, {rejectWithValue, getState, dispatch}) => {
    try {
        // http call
        const { data } = await axios.put(`${baseUrl}/api/users/reset-password`, userData);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Fetch user details action
export const fetchUserDetailsAction = createAsyncThunk('user/details',async(id, { rejectWithValue, getState, dispatch }) => {
    try {
        // http call
        const { data } = await axios.get(`${baseUrl}/api/users/${id}`);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});


// Fetch user List action
export const fetchUsersAction = createAsyncThunk('users/list', async (payload, { rejectWithValue, getState, dispatch }) =>{
    // Get the logged in user from state
    const user = getState()?.users;
    const { userAuth } = user;

    // Config
    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    };

    try {
        // http call
        const {data} = await axios.get(`${baseUrl}/api/users`, config);
        return data;
    } catch (error) {
        if(!error.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// User Follow Action
export const userFollowAction = createAsyncThunk('user/follow', async(followId, { rejectWithValue, getState, dispatch }) => {
    // get the user from the state
    const user = getState()?.users;
    const { userAuth } = user;

    // configurations
    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`,
        }
    }

    try {
        // http call
        const { data } = await axios.put(`${baseUrl}/api/users/follow`, { followId }, config);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// User Unfollow Action
export const unFollowUserAction = createAsyncThunk('user/unfollow', async(unFollowId, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    };

    try {
        // http call
        const { data } = await axios.put(`${baseUrl}/api/users/unfollow`, { unFollowId }, config);
        return data;
    } catch (error) {
        if(!error.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
})

// Block User Action
export const blockUserAction = createAsyncThunk('user/block', async(id, { rejectWithValue, getState, dispatch }) => {
    // get the user from the state
    const user = getState()?.users;
    const { userAuth } = user;

    // configurations
    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`,
        }
    }

    try {
        // http call
        const { data } = await axios.put(`${baseUrl}/api/users/block-user/${id}`, {}, config);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// UnBlock User Action
export const unBlockUserAction = createAsyncThunk('user/unblock', async(id, { rejectWithValue, getState, dispatch }) => {
    // get the user from the state
    const user = getState()?.users;
    const { userAuth } = user;

    // configurations
    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`,
        }
    }

    try {
        // http call
        const { data } = await axios.put(`${baseUrl}/api/users/unblock-user/${id}`, {}, config);
        return data;
    } catch (error) {
        if(!error?.response) throw error;
        return rejectWithValue(error?.response?.data);
    }
});

// Get Initial state from localStorage
const getAuthFromLocalStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;

// Create Slice
const usersSlices = createSlice({
    name: 'users',
    initialState: {
        userAuth: getAuthFromLocalStorage
    },
    //Experimental Purpose for checking the process is running in creatAction or not
    reducers: (builder) => {
        builder.addCase(logoutAction, (state, action) => {
            state.loading = false;
            state.userAuth = action?.payload;
            state.appErr = undefined;
            state.serverErr = undefined;
        });
    },
    extraReducers: (builder) => {
        // Profile Photo Upload Redirection
            builder.addCase(profilePhotoRedirectionAction, (state, action) => {
                state.profilePhotoRedirection = true;
            });

        // Profile Photo Updation Redirection
            builder.addCase(profileUpdateRedirectionAction, (state, action) => {
                state.profileUpdateRedirection = true;
            });

        // User Registration Handling Starts
            builder.addCase(registerUserAction.pending, (state, action) => {
                state.loading = true;
                state.appErr = undefined;
                state.serverErr = undefined;
            });
            builder.addCase(registerUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.registered = action?.payload;
                state.appErr = undefined;
                state.serverErr = undefined;
            });
            builder.addCase(registerUserAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // User Registration Handling Ends

        // User Login Handling Starts
            builder.addCase(loginUserAction.pending, (state, action) => {
                state.loading = true;
                state.appErr = undefined;
                state.serverErr = undefined;
            });
            builder.addCase(loginUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.userAuth = action?.payload;
                state.appErr = undefined;
                state.serverErr = undefined;
            });
            builder.addCase(loginUserAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // User Login Handling Ends

        // User Logout Handling Starts
            builder.addCase(logoutAsyncUserAction.pending, (state, action) => {
                state.loading = true;
                state.appErr = undefined;
                state.serverErr = undefined;
            });
            builder.addCase(logoutAsyncUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.userAuth = undefined;
                state.appErr = undefined;
                state.serverErr = undefined;
            });
            builder.addCase(logoutAsyncUserAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // User Logout Handling Ends

        // User Profile Handling Starts
            builder.addCase(userProfileAction.pending, (state, action) => {
                state.profileLoading = true;
            });

            builder.addCase(userProfileAction.fulfilled, (state, action) => {
                state.profileLoading = false;
                state.profile = action?.payload;
                state.profileAppErr = state.profileServerErr = undefined;
            });

            builder.addCase(userProfileAction.rejected, (state, action) => {
                state.profileLoading = false;
                state.profileAppErr = action?.payload?.message;
                state.profileServerErr = action?.error?.message;
            });
        // User Profile Handling Ends

        // User Profile Uploading Photo Handling Starts
            builder.addCase(uploadProfilePhotoAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(uploadProfilePhotoAction.fulfilled, (state, action) => {
                state.loading = false;
                state.profilePhotoRedirection = false;
                state.profilePhoto = action?.payload;
                state.userAuth.profilePhoto = action?.payload?.profilePhoto;
                state.appErr = state.serverErr = undefined;
            });

            builder.addCase(uploadProfilePhotoAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // User Profile Uploading Photo Handling Ends
        
        // User Profile Updatation Handling Starts
            builder.addCase(updateUserProfileAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(updateUserProfileAction.fulfilled, (state, action) => {
                state.loading = false;
                state.profileUpdateRedirection = false;
                state.profileUpdated = action?.payload;
                state.appErr = state.serverErr = undefined;

                state.userAuth.firstName = action?.payload?.firstName;
                state.userAuth.lastName = action?.payload?.lastName;
                state.userAuth.email = action?.payload?.email;
                state.userAuth.bio = action?.payload?.bio;
            });

            builder.addCase(updateUserProfileAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // User Profile Updatation Handling Ends

        // User Password Updatation Handling Starts
            builder.addCase(updatePasswordAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(updatePasswordAction.fulfilled, (state, action) => {
                state.loading = false;
                state.profileUpdateRedirection = false;
                state.passwordUpdated = action?.payload;
                state.appErr = state.serverErr = undefined;
            });

            builder.addCase(updatePasswordAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // User Password Updatation Handling Ends

        // User Forgot Password Token Handling Starts
            builder.addCase(passwordResetTokenAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(passwordResetTokenAction.fulfilled, (state, action) => {
                state.loading = false;
                state.passwordResetToken = action?.payload;
                state.appErr = state.serverErr = undefined;
            });

            builder.addCase(passwordResetTokenAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // User Forgot Password Token Handling Ends

        // User Reset Password Handling Starts
            builder.addCase(passwordResetAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(passwordResetAction.fulfilled, (state, action) => {
                state.loading = false;
                state.passwordReset = action?.payload;
                state.appErr = state.serverErr = undefined;
            });

            builder.addCase(passwordResetAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // User Reset Password Handling Ends

        // User Details Handling Starts
            builder.addCase(fetchUserDetailsAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(fetchUserDetailsAction.fulfilled, (state, action) => {
                state.loading = false;
                state.userDetails = action?.payload;
                state.appErr = state.serverErr = undefined;
            });

            builder.addCase(fetchUserDetailsAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // User Details Handling Ends

        // User List Handling Starts
            builder.addCase(fetchUsersAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(fetchUsersAction.fulfilled, (state, action) => {
                state.loading = false;
                state.usersList = action?.payload;
                state.appErr = state.serverErr = undefined;
            });

            builder.addCase(fetchUsersAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // User Details Handling Ends

        // Follow User Handling Starts
            builder.addCase(userFollowAction.pending, (state, action) => {
                state.loading = true;
            });
            builder.addCase(userFollowAction.fulfilled, (state, action) => {
                state.loading = false;
                state.followed = action?.payload;
                state.unfollowed = state.appErr = state.serverErr = undefined;
            });
            builder.addCase(userFollowAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
                state.unfollowed = undefined;
            });
        // Follow User Handling Ends

        // unFollow User Handling Starts
            builder.addCase(unFollowUserAction.pending, (state, action) => {
                state.loading = true;
            });
            builder.addCase(unFollowUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.unfollowed = action?.payload;
                state.followed = state.appErr = state.serverErr = undefined;
            });
            builder.addCase(unFollowUserAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
                state.followed = undefined;
            });
        // unFollow User Handling Ends

        // Block User Handling Starts
            builder.addCase(blockUserAction.pending, (state, action) => {
                state.loading = true;
            });
            builder.addCase(blockUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.blocked = action?.payload;
                state.followed = state.appErr = state.serverErr = undefined;
            });
            builder.addCase(blockUserAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
                state.followed = undefined;
            });
        // Block User Handling Ends

        // UnBlock User Handling Starts
            builder.addCase(unBlockUserAction.pending, (state, action) => {
                state.loading = true;
            });
            builder.addCase(unBlockUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.unblocked = action?.payload;
                state.followed = state.appErr = state.serverErr = undefined;
            });
            builder.addCase(unBlockUserAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
                state.followed = undefined;
            });
        // UnBlock User Handling Ends
    }
})

export default usersSlices.reducer;