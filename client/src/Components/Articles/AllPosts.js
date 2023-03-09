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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        axios
            .get(`/user/${userId}/posts`, config)
            .then((response) => {
                // console.log(response.data);
                setPosts(response.data.posts);
                setIsLoading(false);
            })
            .catch((error) => {
                navigate("/");
                alert(error.response.data.message);
                // console.error(error);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return <ShowAllPosts posts={posts} />;
}
