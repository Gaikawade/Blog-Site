import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { check_token } from "../../utils";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const {config} = check_token()
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
}
