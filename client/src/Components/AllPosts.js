import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import ShowAllPosts from "./ShowAllPosts";


export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { userId } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const URI = document.URL;
    let api = "";

    if (userId) {
        api = `/user/${userId}/posts`;
    } else if (URI.includes("admin")) {
        api = `/admin/all_posts`;
    } else {
        api = `/user/all_posts`;
    }

    useEffect(() => {
        if (currentUser.status) {
            axios
                .get(api)
                .then((response) => {
                    // console.log(response.data);
                    setPosts(response.data.posts);
                    setIsLoading(false);
                })
                .catch((error) => {
                    navigate('/')
                    alert(error.response.data.message);
                    // console.error(error);
                });
        } else {
            URI.includes("admin")
                ? navigate("/admin/login")
                : navigate("/login");
        }
    }, []);

    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <ShowAllPosts posts={posts}/>
    );
}
