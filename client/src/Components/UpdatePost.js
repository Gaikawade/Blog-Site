import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";

export default function UpdatePost() {
    const [post, setPost] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { post_id } = useParams();

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        const decodedToken = jwt_decode(token);
        setCurrentUser(decodedToken);
        axios
			.get(`/post/${post_id}`)
			.then((res) => {
				console.log(res.data.post);
				setPost(res.data.post);
                setIsLoading(false)
				// console.log(posts);
			})
			.catch((err) => {
				console.error(err);
			});
    }, []);

    function handleTitleChange(e) {
        setTitle(e.target.value);
    }

    function handleContentChange(e) {
        setContent(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios
            .post(`{/post/update/${post_id}}`, {
                title: title,
                content: content,
                userId: userId,
            })
            .then((response) => {
                if (response.data.status) {
                    alert(response.data.message);
                    navigate("/");
                } else {
                    alert(response.data.message);
                }
            })
            .catch((error) => {
                alert(error.message);
            });
    }

    if (isLoading) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <div className="container">
            {post.post.title}
            <h3>UpdatePost</h3>
            <Form.Floating className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Title of the Article"
                    value={post.post.title}
                    onChange={handleTitleChange}
                />
                <label htmlFor="floatingInputCustom">
                    Title of the Article
                </label>
            </Form.Floating>

            <Form.Floating className="mb-3">
                <Form.Control
                    as="textarea"
                    placeholder="Content of the Article"
                    value={post.post.content} 
                    onChange={handleContentChange}
                />
                <label htmlFor="floatingPasswordCustom">
                    Content of the Article
                </label>
            </Form.Floating>

            <Form.Floating>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Add Post
                </Button>
            </Form.Floating>
        </div>
    );
}
