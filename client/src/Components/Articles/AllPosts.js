import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { check_token } from "../../script";
import ShowAllPosts from "./ShowAllPosts";

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        const token = check_token();
        axios
            .get(`/user/${userId}/posts`, token)
            .then((response) => {
                // console.log(response.data);
                setPosts(response.data.posts);
                setIsLoading(false);
            })
            .catch((error) => {
                navigate("/");
                console.log(error)
                // alert(error.response.data.message);
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

    return (
    <div>
        {posts ? <>posts[0].author.name</> : null}
        <ShowAllPosts posts={posts} />
    </div>
    );
}
