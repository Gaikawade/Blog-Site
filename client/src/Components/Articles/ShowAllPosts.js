import React from "react";

import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/esm/Card";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/esm/Row";

export default function ShowAllPosts(props) {
    const posts = props.posts;

    return (
        <Container>
            {!posts.length ? (
                <div className="text-center">
                    No Posts <strong>{props.keyword}</strong>
                </div>
            ) : (
                posts.map((post) => (
                    <div key={post.post.id} className="mb-5 my-3">
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col className="text-start h6">
                                        {post.post.title}
                                    </Col>
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
                        Likes: <strong>{post.likes.length}</strong> &nbsp;
                        Comments: <strong>{post.comments.length}</strong>
                    </div>
                ))
            )}
        </Container>
    );
}
