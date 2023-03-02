import "./App.css";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Navigation from "./Components/Navigation";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./Components/LoginForm";
import FullPost from "./Components/FullPost";
import RegisterForm from "./Components/RegisterForm";

function App() {
    return (
        <BrowserRouter>
            <div className="">
                <Navigation />
                <Routes>
                    <Route path="/" element={ <Home /> } />
                    <Route path="/home" element={ <Home /> } />
                    <Route path="/login" element={ <LoginForm /> } />
                    <Route path="/register" element={ <RegisterForm /> } />
                    <Route path='/post/:post_id' element={ <FullPost />} />
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
