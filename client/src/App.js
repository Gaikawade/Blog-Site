import "./App.css";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Navigation from "./Components/Navigation";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./Components/LoginForm";

function App() {
    return (
        <BrowserRouter>
            <div className="">
                <Navigation />
                <Routes>
                    <Route path="/" element={ <Home /> } />
                    <Route path="/home" element={ <Home /> } />
                    <Route path="/login" element={ <LoginForm /> } />
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
