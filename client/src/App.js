import { BrowserRouter, Routes, Route } from "react-router-dom";

import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Navigation from "./Components/Navigation";
import LoginForm from "./Components/LoginForm";
import FullPost from "./Components/FullPost";
import RegisterForm from "./Components/RegisterForm";
import Logout from "./Components/Logout";
import AddPost from "./Components/AddPost";
import UpdatePost from "./Components/UpdatePost";
import AllUsers from "./Components/AllUsers";
import AllPosts from "./Components/AllPosts";
import AllAdmins from "./Components/AllAdmins";
import Search from "./Components/Search";
import Account from "./Components/Account";

function App() {
    return (
        <BrowserRouter>
            {/* <div className=""> */}
                <Navigation />
                <Routes>
                    {/* Home Page */}
                    <Route path="/" element={ <Home /> } />
                    <Route path="/home" element={ <Home /> } />
                    {/* User Routes */}
                    <Route path="/register" element={ <RegisterForm /> } />
                    <Route path="/login" element={ <LoginForm /> } />
                    <Route path='/logout' element={ <Logout /> } />
                    <Route path='/account/:user_id' element={ <Account /> } />
                    {/* specific user's posts */}
                    <Route path='/user/:userId/posts' element={ < AllPosts /> } />
                    {/* Admin Routes */}
                    <Route path="/admin/register" element={ <RegisterForm /> } />
                    <Route path="/admin/login" element={ <LoginForm /> } />
                    <Route path='/admin/all_users' element={ <AllUsers />} />
                    <Route path='/admin/all_posts' element={ < AllPosts />} />
                    <Route path='/admin/all_admins' element={ < AllAdmins />} />
                    {/* Post Routes */}
                    <Route path='/add_post' element={ <AddPost /> } />
                    <Route path='/post/:post_id' element={ <FullPost />} />
                    <Route path='/post/update/:postId' element={ <UpdatePost />} />
                    {/* Search */}
                    <Route path='/search' element={ <Search /> } />
                </Routes>
                <Footer />
            {/* </div> */}
        </BrowserRouter>
    );
}

export default App;
