import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const config = {
            headers: { 'Authorization': `Bearer ${token}` },
        }
        // 2nd parameter in axiox call is for data, as we are not sending any data we pass an empty object
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
