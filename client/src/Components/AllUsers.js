import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import { useNavigate } from "react-router-dom";
import ShowAllMembers from "./ShowAllMembers";

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser.status) {
            axios
                .get("/admin/all_users")
                .then((response) => {
                    // console.log(response.data);
                    setUsers(response.data.users);
                    setIsLoading(false);
                })
                .catch((error) => {
                    navigate("/");
                    alert(error.response.data.message);
                    // console.error(error);
                });
        } else {
            navigate("/admin/login");
        }
    }, []);

    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return <ShowAllMembers users={users} />;
}
