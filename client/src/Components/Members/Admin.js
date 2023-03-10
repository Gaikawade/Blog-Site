import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import { useNavigate } from "react-router-dom";
import ShowAllMembers from "./ShowAllMembers";
import ShowAllPosts from "../Articles/ShowAllPosts";
import { check_token } from "../../utils";

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const URI = document.URL;
    let api = null;
    let source = null;

    if (URI.includes("all_admins")) {
        api = `/admin/all_admins`;
        source = "admin";
    } else if (URI.includes("all_users")) {
        api = `/admin/all_users`;
        source = "user";
    } else if (URI.includes("all_posts")) {
        api = `/admin/all_posts`;
        source = "post";
    }

    useEffect(() => {
        const token = check_token();
        axios
            .get(api, token)
            .then((response) => {
                if (source == "admin") {
                    setAdmins(response.data.admins);
                } else if (source == "user") {
                    setUsers(response.data.users);
                } else if (source == "post") {
                    setPosts(response.data.posts);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                navigate("/");
                alert(error.response.data.message);
                console.error(error);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div>
            {users.length ? (
                <ShowAllMembers users={users} />
            ) : admins.length ? (
                <ShowAllMembers admins={admins} />
            ) : posts.length ? (
                <ShowAllPosts posts={posts} />
            ) : null}
        </div>
    );
}
