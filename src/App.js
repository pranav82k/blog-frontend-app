import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AddNewCategory from './components/Categories/AddNewCategory';
import CategoryList from './components/Categories/CategoryList';
import UpdateCategory from './components/Categories/UpdateCategory';
import UpdateComment from './components/Comments/UpdateComment';
import HomePage from './components/HomePage/HomePage';
import Navbar from './components/Navigation/Navbar';
import AdminRoute from './components/Navigation/ProtectedRoutes/AdminRoute';
import PrivateProtectRoute from './components/Navigation/ProtectedRoutes/PrivateProtectRoute';
import CreatePost from './components/Posts/CreatePost';
import PostDetails from './components/Posts/PostDetails';
import PostsList from './components/Posts/PostsList';
import UpdatePost from './components/Posts/UpdatePost';
import AccountVerified from './components/Users/AccountVerification/AccountVerified';
import Login from './components/Users/Login/Login';
import ResetPassword from './components/Users/Password/ResetPassword';
import ResetPasswordForm from './components/Users/Password/ResetPasswordForm';
import UpdatePassword from './components/Users/Password/UpdatePassword';
import Profile from './components/Users/Profile/Profile';
import UpdateProfileForm from './components/Users/Profile/UpdateProfileForm';
import UploadProfilePhoto from './components/Users/Profile/UploadProfilePhoto';
import Register from './components/Users/Register/Register';
import SendEmail from './components/Users/SendEmail/SendEmail';
import UsersList from './components/Users/UsersList/UsersList';

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Switch>
        <Route path="/" exact component={HomePage} />
        
        {/* User Authentication */}
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/password-reset-token" component={ResetPasswordForm} />
        <Route exact path="/reset-password/:token" component={ResetPassword} />
        
        {/* User Profile Routes */}
        <PrivateProtectRoute exact path="/profile/:id" component={Profile} />
        <PrivateProtectRoute exact path="/upload-profile-photo" component={UploadProfilePhoto} />
        <PrivateProtectRoute exact path="/update-profile" component={UpdateProfileForm} />

        {/* Post Routes */}
        <PrivateProtectRoute exact path="/create-post" component={CreatePost} />
        <Route exact path="/posts" component={PostsList} />
        <Route exact path="/posts/:id" component={PostDetails} />
        <PrivateProtectRoute exact path="/update-post/:id" component={UpdatePost} />
        
        {/* Comment Routes */}
        <PrivateProtectRoute exact path="/update-comment/:id" component={UpdateComment} />

        {/* Account Verification Routes */}
        <PrivateProtectRoute exact path="/verify-account/:token" component={AccountVerified} />

        {/* Password Management */}
        <PrivateProtectRoute exact path="/update-password" component={UpdatePassword} />

        {/* Admin Routes */}
        {/* Category Management */}
        <AdminRoute exact path="/add-category" component={AddNewCategory} />
        <AdminRoute exact path="/update-category/:id" component={UpdateCategory} />
        <AdminRoute exact path="/category-list" component={CategoryList} />

        {/* Send Email Management */}
        <AdminRoute exact path="/send-email" component={SendEmail} />

        {/* Users List */}
        <AdminRoute exact path="/users" component={UsersList} />

        {/* 404 Route */}
        <Route path="*" exact component={HomePage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
