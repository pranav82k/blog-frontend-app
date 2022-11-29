import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import baseUrl from '../../../utlis/baseUrl';

// Action to Redirect
const redirectToCategoryList = createAction('category/redirect');

// Create Category Action
export const createCategoryAction = createAsyncThunk('category/create', async (category, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    }
    try {
        const { data } = await axios.post(`${baseUrl}/api/category`, {
            title: category?.title
        }, config);

        // dispatch an action for redirection
        dispatch(redirectToCategoryList());

        return data;
    } catch (error) {
        if(!error?.response) {
            throw error;
        }
        return rejectWithValue(error?.response?.data);
    }
});

// Category List Action
export const fetchCategoriesAction = createAsyncThunk('category/fetch', async(payload, {rejectWithValue, getState, dispatch}) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    }

    try {
        const { data } = await axios.get(`${baseUrl}/api/category`, config);
        return data;
    } catch (error) {
        if(!error?.response) {
            throw error;
        }
        return rejectWithValue(error?.response?.data);
    }
});

// Category Update Action
export const updateCategoryAction = createAsyncThunk('category/update', async(category, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    }

    try {
        const { data } = await axios.put(`${baseUrl}/api/category/${category?.id}`, {
            title: category?.title
        }, config);

        // dispatch an action for redirection
        dispatch(redirectToCategoryList());
        
        return data;
    } catch (error) {
        if(!error?.response) {
            throw error;
        }
        return rejectWithValue(error?.response?.data);
    }
});

// Category Delete Action
export const deleteCategoryAction = createAsyncThunk('category/delete', async(id, {rejectWithValue, getState, dispatch}) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    }

    try {
        const { data } = await axios.delete(`${baseUrl}/api/category/${id}`, config);
        
        // dispatch an action for redirection
        dispatch(redirectToCategoryList());

        return data;
    } catch (error) {
        if(!error?.response) {
            throw error;
        }
        return rejectWithValue(error?.response?.data);
    }
});

// Cateogory Details Action
export const fetchCategoryAction = createAsyncThunk('category/details', async(id, { rejectWithValue, getState, dispatch }) => {
    const user = getState()?.users;
    const { userAuth } = user;

    const config = {
        headers: {
            Authorization: `Bearer ${userAuth?.token}`
        }
    }

    try {
        const { data } = await axios.get(`${baseUrl}/api/category/${id}`, config);
        return data;
    } catch (error) {
        if(!error?.response) {
            throw error;
        }
        return rejectWithValue(error?.response?.data);
    }
});

// Create Category slice
const categorySlices = createSlice({
    name: 'category',
    initialState: {},
    extraReducers: (builder) => {
        // Create Action for redirection
            builder.addCase(redirectToCategoryList, (state, action) => {
                state.isRedirectToCategoryList = true;
            });

        // Create Category Starts
            builder.addCase(createCategoryAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(createCategoryAction.fulfilled, (state, action) => {
                state.category = action?.payload;
                state.isRedirectToCategoryList = false;
                state.loading = false;
                state.appErr = undefined;
                state.serverErr = undefined;
            });

            builder.addCase(createCategoryAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Create Category Ends

        // Fetch Cateogry List Starts
            builder.addCase(fetchCategoriesAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
                state.loading = false;
                state.categoryList = action?.payload;
                state.appErr = undefined;
                state.serverErr = undefined;
            });

            builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Fetch Cateogry List Ends

        // Update Cateogry Starts
            builder.addCase(updateCategoryAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(updateCategoryAction.fulfilled, (state, action) => {
                state.loading = false;
                state.isRedirectToCategoryList = false;
                state.updatedCategory = action?.payload;
                state.appErr = undefined;
                state.serverErr = undefined;
            });

            builder.addCase(updateCategoryAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Update Cateogry Ends

        // Delete Cateogry Starts
            builder.addCase(deleteCategoryAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(deleteCategoryAction.fulfilled, (state, action) => {
                state.loading = false;
                state.isRedirectToCategoryList = false;
                state.deletedCategory = action?.payload;
                state.appErr = undefined;
                state.serverErr = undefined;
            });

            builder.addCase(deleteCategoryAction.rejected, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Delete Cateogry Ends

        // Cateogry Details Starts
            builder.addCase(fetchCategoryAction.pending, (state, action) => {
                state.loading = true;
            });

            builder.addCase(fetchCategoryAction.fulfilled, (state, action) => {
                state.loading = false;
                state.category = action?.payload;
                state.appErr = undefined;
                state.serverErr = undefined;
            });

            builder.addCase(fetchCategoryAction, (state, action) => {
                state.loading = false;
                state.appErr = action?.payload?.message;
                state.serverErr = action?.error?.message;
            });
        // Cateogry Details Ends
    }
});

export default categorySlices.reducer;