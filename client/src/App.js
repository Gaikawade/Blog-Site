import "./App.css";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Navigation from "./Components/Navigation";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./Components/LoginForm";
import FullPost from "./Components/FullPost";
import RegisterForm from "./Components/RegisterForm";
import Logout from "./Components/Logout";
import AddPost from "./Components/AddPost";
import UpdatePost from "./Components/UpdatePost";
import UsersPostsAdmin from "./Components/UsersPostsAdmin";

function App() {
    return (
        <BrowserRouter>
            <div className="">
                <Navigation />
                <Routes>
                    <Route path="/" element={ <Home /> } />
                    <Route path="/home" element={ <Home /> } />
                    <Route path="/register" element={ <RegisterForm /> } />
                    <Route path="/admin/register" element={ <RegisterForm /> } />
                    <Route path="/login" element={ <LoginForm /> } />
                    <Route path="/admin/login" element={ <LoginForm /> } />
                    <Route path='/logout' element={ <Logout /> } />
                    <Route path='/add_post' element={ <AddPost /> } />
                    <Route path='/post/:post_id' element={ <FullPost />} />
                    <Route path='/post/update/:post_id' element={ <UpdatePost />} />
                    <Route path='/admin/all_users' element={ <UsersPostsAdmin />} />
                    <Route path='/admin/all_posts' element={ <UsersPostsAdmin />} />
                    <Route path='/admin/all_admins' element={ <UsersPostsAdmin />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
        // <div>
        //   <Navigation />
        //   <LoginForm />
        // </div>
    );
}

export default App;
