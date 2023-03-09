import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { check_token } from "../../script";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = check_token()
        axios
            .post("/logout", {}, token)
            .then((response) => {
                localStorage.clear();
                navigate("/");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    });
}
