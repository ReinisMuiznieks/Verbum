import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import categoryService from './categoryService'

const initialState = {
    categories: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// Create new category
export const createCategory = createAsyncThunk('/categories/create', async (categoryData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await categoryService.createCategory(categoryData, token)
    } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


// Update category
export const updateCategory = createAsyncThunk('/categories/update', async (updatedCategoryData,id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await categoryService.updateCategory(updatedCategoryData, id, token)
    } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Get user category
export const getCategories = createAsyncThunk('categories/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await categoryService.getCategories(token)
    } catch(error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// Delete category
export const deleteCategory = createAsyncThunk('/categories/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await categoryService.deleteCategory(id, token)
    } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCategory.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.categories.push(action.payload)
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getCategories.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.categories = action.payload
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteCategory.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.categories = state.categories.filter((category) => category._id !== action.payload.id) // removes from UI without needing to refresh
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updateCategory.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.categories = action.payload
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { reset } = categorySlice.actions
export default categorySlice.reducer