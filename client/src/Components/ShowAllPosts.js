import React from "react";
import jwt_decode from "jwt-decode";

import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/esm/Card";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/esm/Row";

export default function ShowAllPosts(props) {
    const posts = props.posts;
    // const currentUser = jwt_decode(localStorage.getItem("token"));

    return (
        <Container>
            {posts.length == 0 ? (
                <div>
                    No Posts with <strong>{props.keyword}</strong>
                </div>
            ) : (
                posts.map((post) => (
                    <Card key={post.post.id} className="mb-5 my-3">
                        <Card.Header>
                            <Row>
                                <Col className="text-start h6">
                                    {post.post.title}
                                </Col>
                                {/* <Col className="text-end">
                                    {currentUser.userId == post.author.id && (
                                        <Link
                                            to={`/post/update/${post.post.id}`}
                                        >
                                            <i className="fa fa-pen-to-square"></i>
                                        </Link>
                                    )}
                                    &nbsp;
                                    {currentUser.userId === post.author.id ||
                                    currentUser.isAdmin === true ? (
                                        <Link
                                            to={`/post/delete/${post.post.id}`}
                                        >
                                            <i className="fa fa-trash text-danger"></i>
                                        </Link>
                                    ) : null}
                                </Col> */}
                            </Row>
                        </Card.Header>
                        <Card.Text className="text-center p-3">
                            {post.post.content.slice(0, 120)}...
                            <Link
                                to={`/post/${post.post.id}`}
                                className="text-decoration-none"
                            >
                                Read More
                            </Link>
                        </Card.Text>
                        <Card.Footer>
                            <Row>
                                <Col className="text-start">
                                    <Link
                                        to={`/user/${post.author.id}/posts`}
                                        className="text-decoration-none"
                                    >
                                        {post.author.name}
                                    </Link>
                                </Col>
                                <Col className="text-end">
                                    Posted on: {post.post.created_at}
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                ))
            )}
        </Container>
    );
}
