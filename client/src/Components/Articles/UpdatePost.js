import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import { check_token } from "../../script";

export default function UpdatePost() {
    const [article, setArticle] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const { postId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token){
            navigate('/login');
        }
        const decodedToken = jwt_decode(token);
        setCurrentUser(decodedToken);
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        axios
			.get(`/post/${postId}`, config)
			.then((res) => {
				// console.log(res.data.post);
				setArticle(res.data.post);
                setContent(res.data.post.post.content);
                setTitle(res.data.post.post.title);
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
        if( article.post.title === title && article.post.content === content){
            setError(`You haven't update anything in your article yet`);
            return null;
        }
        const token = check_token();
        axios
            .put(`/post/update/${postId}`, {
                title: title,
                content: content,
                userId: currentUser.userId,
            }, token)
            .then((response) => {
                if (response.data.status) {
                    navigate(`/post/${postId}`);
                    alert(response.data.message);
                } else {
                    // console.log(response.data);
                    alert(response.data.message);
                }
            })
            .catch((error) => {
                // console.log(error.response)
                alert(error.message);
            });
    }

    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
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

            {error ? <Form.Text className="text-danger">{error}</Form.Text> : null}

            <Form.Floating>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Add Post
                </Button>
            </Form.Floating>
        </div>
    );
}
