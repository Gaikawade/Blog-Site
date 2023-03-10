import React, { useState, useEffect } from "react";
import axios from "axios";
import ShowAllPosts from "./Articles/ShowAllPosts";

import Container from "react-bootstrap/esm/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

function Home({ typo }) {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/home")
            .then((res) => {
                // console.log(res.data);
                setPosts(res.data.posts);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
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
        <>
            {typo && (
                <Alert color="info">
                    {typo}
                </Alert>
            )}
            <Container className="my-3">
                {<ShowAllPosts posts={posts} />}
            </Container>
        </>
    );
}

export default Home;
