import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { like, deleteArticle, check_token, deleteComment } from "../../script";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import Modal from "react-bootstrap/Modal";

export default function FullPost() {
    const { post_id } = useParams();
    const [article, setArticle] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [commentError, setCommentError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [postToDelete, setPostToDelete] = useState(null);

    useEffect(() => {
        const token = check_token();
        const decodedToken = jwt_decode(localStorage.getItem("token"));
        setCurrentUser(decodedToken);
        axios
            .get(`/post/${post_id}`, token)
            .then((res) => {
                setArticle(res.data.post);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    function handleCommentChange(e) {
        setComment(e.target.value);
    }

    function handleShowModal(source) {
        if ("author" in source) {
            setPostToDelete(source);
        } else {
            setCommentToDelete(source);
        }
        setShowModal(true);
    }

    function handleCloseModal() {
        setPostToDelete(null);
        setCommentToDelete(null);
        setShowModal(false);
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
        const token = check_token();

        if (!comment) {
            setCommentError("Please enter your comment");
        }

        axios
            .post(
                `/add_comment/${article.post.id}`,
                {
                    text: comment,
                    commented_by: currentUser.userId,
                },
                token
            )
            .then((response) => {
                // console.log(response.data);
                alert(response.data.message);
                window.location.reload();
                setComment("");
            })
            .catch((error) => {
                // console.log(error);
                alert("Something went wrong");
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
                                    <Link
                                        to={`/post/update/${article.post.id}`}
                                    >
                                        <i className="fa fa-pen-to-square"></i>
                                    </Link>
                                ) : null}
                                &nbsp;
                                {currentUser.userId === article.author.id ||
                                currentUser.isAdmin ? (
                                    <Link
                                        onClick={() => handleShowModal(article)}
                                    >
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
                    {article.likes
                        .map((like) => like.liked_by)
                        .includes(currentUser.userId) ? (
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
                    <span id={`likes-count-${article.post.id}`}>
                        {article.likes.length || 0}
                    </span>
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
                                    currentUser.userId === article.author.id ? (
                                        <i
                                            className="fa fa-trash text-danger"
                                            onClick={() =>
                                                handleShowModal(comment)
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

            {/* Delete Modal for Comment and Post */}
            <Modal centered={true} show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {commentToDelete ? "Delete Comment" : "Delete Post"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete{" "}
                    {commentToDelete ? (
                        <>
                            <strong>{commentToDelete.commented_by.name}</strong>'s
                            comment?
                        </>
                    ) : postToDelete ? (
                        <>
                            <strong>{postToDelete.post.title}</strong> article?
                        </>
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    {commentToDelete ? (
                        <Button variant="danger" onClick={() => deleteComment(commentToDelete.id)}>
                            Delete
                        </Button>
                    ) : postToDelete ? (
                        <Button variant="danger" onClick={() => deleteArticle(postToDelete.post.id)}>
                            Delete
                        </Button>
                    ) : null}
                </Modal.Footer>
            </Modal>
        </div>
    );
}
