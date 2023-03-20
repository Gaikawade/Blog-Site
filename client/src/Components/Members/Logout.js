import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { check_token } from "../../utils";
import LoginForm from "./LoginForm";

export default function Logout() {
    const navigate = useNavigate();
    const { config, error } = check_token();

    useEffect(() => {
        axios
            .post("/logout", {}, config)
            .then((response) => {
                localStorage.clear();
                navigate("/");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    });

    return <>{error ? <LoginForm warn={error} /> : null}</>;
}
