import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { check_token } from "../../utils";
import LoginForm from "../Members/LoginForm";

import {Container, Button, Form } from "react-bootstrap";

export default function AddPost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [titleError, setTitleError] = useState("");
    const [contentError, setContentError] = useState("");
    const [currentUser, setCurrentUser] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const { error, config } = check_token();

    useEffect(() => {
        if (error) {
            setIsLoggedIn(true);
        } else {
            const getCurrentUser = async () => {
                try {
                    const res = await axios.get("/check_login");
                    if (!res.data.status) {
                        setIsLoggedIn(false);
                    }
                    setCurrentUser(res.data);
                } catch (err) {
                    toast.error("Something went wrong");
                }
            };
            getCurrentUser();
        }
    }, []);

    function handleTitleChange(e) {
        setTitle(e.target.value);
    }

    function handleContentChange(e) {
        setContent(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (title.length < 5) {
            setTitleError("Title should be at least 5 characters long");
            return null;
        }
        if (content.length < 20) {
            setContentError("Content should be at least 20 characters long");
            return null;
        }
        const addPost = async () => {
            try {
                const res = await axios.post(
                    "/add_post",
                    {
                        title: title,
                        content: content,
                        userId: currentUser.userId,
                    },
                    config
                );
                if (res.data.status) {
                    navigate(`/post/${res.data.postId}`);
                } else {
                    toast.error(res.data.message);
                }
            } catch (err) {
                if (err.response.status === 400 || 403) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error("Something went wrong");
                }
            }
        };
        addPost();
    }

    return (
        <>
            {isLoggedIn ? (
                <LoginForm warn={error} />
            ) : (
                <Container>
                    <ToastContainer position="top-center" autoClose={5000} />
                    <Form.Floating className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Title of the Article"
                            value={title}
                            onChange={handleTitleChange}
                        />
                        <label htmlFor="floatingInputCustom">
                            Title of the Article
                        </label>
                        {titleError && (
                            <Form.Text className="text-danger">
                                {titleError}
                            </Form.Text>
                        )}
                    </Form.Floating>

                    <Form.Floating className="mb-3">
                        <Form.Control
                            as="textarea"
                            placeholder="Content of the Article"
                            value={content}
                            onChange={handleContentChange}
                        />
                        <label htmlFor="floatingPasswordCustom">
                            Content of the Article
                        </label>
                        {contentError && (
                            <Form.Text className="text-danger">
                                {contentError}
                            </Form.Text>
                        )}
                    </Form.Floating>

                    <Form.Floating>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Add Post
                        </Button>
                    </Form.Floating>
                </Container>
            )}{" "}
        </>
    );
}
