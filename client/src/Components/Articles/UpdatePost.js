import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import { check_token } from "../../utils";
import LoginForm from "../Members/LoginForm";

export default function UpdatePost() {
    const [article, setArticle] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { postId } = useParams();
    const navigate = useNavigate();
    const { config, error } = check_token();

    useEffect(() => {
        if (error) {
            setIsLoggedIn(true);
        } else {
            const token = jwt_decode(localStorage.getItem("token"));
            setCurrentUser(token.sub);
            const fetchPost = async () => {
                try {
                    const res = await axios.get(`/post/${postId}`, config);
                    setArticle(res.data.post);
                    setContent(res.data.post.post.content);
                    setTitle(res.data.post.post.title);
                    setIsLoading(false);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchPost();
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
        if (article.post.title === title && article.post.content === content) {
            setSubmitError(`You haven't update anything in your article yet`);
            return null;
        }
        const submitPost = async () => {
            try {
                const response = await axios.put(
                    `/post/update/${postId}`,
                    {
                        title: title,
                        content: content,
                        userId: currentUser.userId,
                    },
                    config
                );
                if (response.data.status) {
                    navigate(`/post/${postId}`);
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                alert(error.message);
            }
        };
        submitPost();
    }

    return (
        <>
            {isLoggedIn ? (
                <LoginForm warn={error} />
            ) : isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="container">
                    <h3>UpdatePost</h3>
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
                    </Form.Floating>

                    {submitError ? (
                        <Form.Text className="text-danger">
                            {submitError}
                        </Form.Text>
                    ) : null}

                    <Form.Floating>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Add Post
                        </Button>
                    </Form.Floating>
                </div>
            )}
        </>
    );
}
