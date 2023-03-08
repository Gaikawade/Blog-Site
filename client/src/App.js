import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
// Header and Footer Component
import Footer from "./Components/Footer";
import Header from "./Components/Header";
// Home Page Component
import Home from "./Components/Home";
// User's and Admin's Components
import RegisterForm from "./Components/Members/RegisterForm";
import LoginForm from "./Components/Members/LoginForm";
import Logout from "./Components/Members/Logout";
import Account from "./Components/Members/Account";
import Admin from "./Components/Members/Admin";
// Posts's Component
import AddPost from "./Components/Articles/AddPost";
import FullPost from "./Components/Articles/FullPost";
import UpdatePost from "./Components/Articles/UpdatePost";
import AllPosts from "./Components/Articles/AllPosts";
// Search Component
import Search from "./Components/Search";


function App() {
    const [url, setUrl] = useState("all_users");

    function updateUrl(source) {
        setUrl(source);
    }

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                {/* Home Page */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                {/* User Routes */}
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/account/:user_id" element={<Account />} />
                {/* specific user's posts */}
                <Route path="/user/:userId/posts" element={<AllPosts />} />
                {/* Admin Routes */}
                <Route path="/admin/register" element={<RegisterForm />} />
                <Route path="/admin/login" element={<LoginForm />} />
                <Route path="/admin/all_users" element={<Admin url={url} />} />
                <Route path="/admin/all_posts" element={<Admin url={url} />} />
                <Route path="/admin/all_admins" element={<Admin url={url} />} />
                {/* Post Routes */}
                <Route path="/add_post" element={<AddPost />} />
                <Route path="/post/:post_id" element={<FullPost />} />
                <Route path="/post/update/:postId" element={<UpdatePost />} />
                {/* Search */}
                <Route path="/search" element={<Search />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;
