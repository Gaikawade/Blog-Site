import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";

export default function FullPost() {
    const { post_id } = useParams();
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        const decodedToken = jwt_decode(token);
        // console.log(decodedToken);
        setCurrentUser(decodedToken);
        // console.log(currentUser);
        axios
            .get(`/post/${post_id}`)
            .then((res) => {
                console.log(res.data);
                setPosts(res.data.post);
                // console.log(posts);
                setIsLoading(false);
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

    if (isLoading) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <div>
            <Container className="my-3">
                <Card key={posts.post.id} className="my-3">
                    <Card.Header>
                        <Row>
                            <Col className="text-start h6">
                                {posts.post.title}
                            </Col>
                            <Col className="text-end">
                                {currentUser.userId === posts.post.authorId && (
                                    <Link to={`/update_post/${posts.post.id}`}>
                                        <i className="fa fa-pen-to-square"></i>
                                    </Link>
                                )}
                                &nbsp;
                                {currentUser.userId === posts.author.id ||
                                currentUser.isAdmin === true ? (
                                    <Link to={`/delete_post/${posts.post.id}`}>
                                        <i className="fa fa-trash text-danger"></i>
                                    </Link>
                                ) : null}
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Text className="text-center p-3">
                        {posts.post.content}
                    </Card.Text>
                    <Card.Footer>
                        <Row>
                            <Col className="text-start">
                                <Link
                                    to={`/user/${posts.author.id}/posts`}
                                    className="text-decoration-none"
                                >
                                    {posts.author.name}
                                </Link>
                            </Col>
                            <Col className="text-end">
                                Posted on: {posts.post.created_at}
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>

                {/* Show Likes and Comments icons with no of likes and no of comments */}
                <div className="h6">
                    <i className="fas fa-thumbs-up"></i>
                    &nbsp;
                    {posts.likes.length}
                    &nbsp; &nbsp;
                    <i
                        className="far fa-comment"
                        onClick={showCommentInput}
                    ></i>
                    &nbsp;
                    {posts.comments.length}
                </div>
                {posts.comments.length === 0 ? (
                    <>No Comments</>
                ) : (
                    <div
                        className="small"
                        id="expand-comments"
                        onClick={showComments}
                    >
                        View all {posts.comments.length} comments
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
                        <Button className="btn btn-primary"> Comment </Button>
                    </Card.Body>
                </Card>

                {/* Displaying Comments (Showing all comments) */}
                <Card style={{ display: "none" }} id="show-comments">
                    <Card.Header className="h6">All Comments</Card.Header>
                    {posts.comments.map((comment) => (
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
                                    {currentUser.userId === comment.commented_by.id ||
                                        currentUser.isAdmin ||
                                        currentUser.userId === posts.post.id ? (
                                            <i className="fa fa-trash text-danger "></i>
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
