import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        axios.post('/logout')
        .then((response) => {
            localStorage.removeItem('jwtToken');
            navigate('/');
            window.location.reload();
        })
        .catch((err) => {
            console.log(err);
        })
    })

}
