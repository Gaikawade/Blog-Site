import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { like, deleteArticle } from './../script';

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";

export default function FullPost() {
    const { post_id } = useParams();
    const [article, setArticle] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState("");
    // const likedByCurrentUser = ;

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decodedToken = jwt_decode(token);
        // console.log(decodedToken);
        setCurrentUser(decodedToken);
        // console.log(currentUser);
        axios
            .get(`/post/${post_id}`)
            .then((res) => {
                // console.log(res.data);
                setArticle(res.data.post);
                setIsLoading(false);
                // console.log(article);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    function handleCommentChange(e) {
        setComment(e.target.value);
    }

    function showCommentInput() {
        const commentField = document.querySelector("#comment-input");
        if (commentField.style.display == "block") {
            commentField.style.display = "none";
        } else {
            commentField.style.display = "block";
        }
    }

    function showComments() {
        const allComments = document.querySelector("#show-comments");
        if (allComments.style.display == "block") {
            allComments.style.display = "none";
        } else {
            allComments.style.display = "block";
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!comment) {
            setCommentError("Please enter your comment");
        }

        axios
            .post(`/add_comment/${article.post.id}`, {
                text: comment,
                commented_by: currentUser.userId,
            })
            .then((response) => {
                // console.log(response.data);
                alert(response.data.message);
                window.location.reload();
                setComment("");
            })
            .catch((error) => {
                alert("Something went wrong");
            });
    }

    function handleDeleteComment(commentId) {
        axios
            .delete(`/delete_comment/${commentId}`)
            .then((response) => {
                // console.log(response);
                alert("Comment deleted successfully");
                window.location.reload();
            })
            .catch((error) => {
                if (!error.response.data.status) {
                    alert(error.response.data.message);
                }
                console.log(error.response);
            });
    }

    if (isLoading) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <div>
            <Container className="my-3">
                <Card key={article.post.id} className="my-3">
                    <Card.Header>
                        <Row>
                            <Col className="text-start h6">
                                {article.post.title}
                            </Col>
                            <Col className="text-end">
                                {currentUser.userId === article.author.id ? (
                                    <Link to={`/post/update/${article.post.id}`}>
                                        <i className="fa fa-pen-to-square"></i>
                                    </Link>
                                ) : null}
                                &nbsp;
                                {currentUser.userId === article.author.id ||
                                currentUser.isAdmin === true ? (
                                    <Link onClick={()=>deleteArticle(article.post.id)}>
                                        <i className="fa fa-trash text-danger"></i>
                                    </Link>
                                ) : null}
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Text className="text-center p-3">
                        {article.post.content}
                    </Card.Text>
                    <Card.Footer>
                        <Row>
                            <Col className="text-start">
                                <Link
                                    to={`/user/${article.author.id}/posts`}
                                    className="text-decoration-none"
                                >
                                    {article.author.name}
                                </Link>
                            </Col>
                            <Col className="text-end">
                                Posted on: {article.post.created_at}
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>

                {/* Show Likes and Comments icons with no of likes and no of comments */}
                <div className="h6">
                    {/* <i className="fas fa-thumbs-up"></i> */}
                    {article.likes.map((like) => like.liked_by).includes(currentUser.userId) ? (
                        <i
                            className="fas fa-thumbs-up"
                            id={`like-button-${article.post.id}`}
                            onClick={() => like(article.post.id)}
                        ></i>
                    ) : (
                        <i
                            className="far fa-thumbs-up"
                            id={`like-button-${article.post.id}`}
                            onClick={() => like(article.post.id)}
                        ></i>
                    )}
                    &nbsp;
                    <span id={`likes-count-${article.post.id}`}>{article.likes.length || 0}</span>
                    &nbsp; &nbsp;
                    <i
                        className="far fa-comment"
                        onClick={showCommentInput}
                    ></i>
                    &nbsp;
                    {article.comments.length}
                </div>
                {article.comments.length === 0 ? (
                    <>No Comments</>
                ) : (
                    <div
                        className="small"
                        id="expand-comments"
                        onClick={showComments}
                    >
                        View all {article.comments.length} comments
                    </div>
                )}

                {/* Posting a Comment (Comment Input field) */}
                <Card id="comment-input" style={{ display: "none" }}>
                    <Card.Header className="text-center h6">
                        {" "}
                        Post your Comment{" "}
                    </Card.Header>
                    <Card.Body className="mb-3">
                        <input
                            type="text"
                            className="border-bottom border-0"
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Write your comment"
                        />
                        {commentError && (
                            <div className="text-danger">{commentError}</div>
                        )}
                        <Button
                            className="btn btn-primary"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            {" "}
                            Comment{" "}
                        </Button>
                    </Card.Body>
                </Card>

                {/* Displaying Comments (Showing all comments) */}
                <Card style={{ display: "none" }} id="show-comments">
                    <Card.Header className="h6">All Comments</Card.Header>
                    {article.comments.map((comment) => (
                        <Card.Body key={comment.id} className="px-3">
                            <Row>
                                <Col className="col-sm-6 text-start small">
                                    <Link
                                        to={`/user/${comment.commented_by.id}/posts`}
                                        className="text-decoration-none"
                                    >
                                        {comment.commented_by.name}
                                    </Link>
                                </Col>
                                <Col className="col-sm-6 text-end small">
                                    {comment.created_at}
                                    &nbsp;
                                    {currentUser.userId ===
                                        comment.commented_by.id ||
                                    currentUser.isAdmin ||
                                    currentUser.userId === article.post.id ? (
                                        <i
                                            className="fa fa-trash text-danger"
                                            onClick={() =>
                                                handleDeleteComment(comment.id)
                                            }
                                        ></i>
                                    ) : null}
                                </Col>
                            </Row>
                            {comment.text}
                        </Card.Body>
                    ))}
                </Card>
            </Container>
        </div>
    );
}
