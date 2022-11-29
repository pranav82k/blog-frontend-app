import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slices/users/usersSlices';
import categoriesReducer from '../slices/categories/categorySlices';
import postReducer from '../slices/posts/postSlices';
import commentReducer from '../slices/comments/commentSlices';
import emailReducer from '../slices/emails/emailSlices';
import accountVerificationReducer from '../slices/accountVerification/accountVerificationSlices'

const store = configureStore({
    reducer: {
        users: usersReducer,
        category: categoriesReducer,
        post: postReducer,
        comment: commentReducer,
        mail: emailReducer,
        accountVerification: accountVerificationReducer
    }
});

export default store;