import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/esm/Card";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { userId } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const URI = document.URL;
    let api = "";

    if (userId) {
        api = `/user/${userId}/posts`;
    } else if (URI.includes("admin")) {
        api = `/admin/all_posts`;
    } else {
        api = `/user/all_posts`;
    }

    useEffect(() => {
        if (currentUser.status) {
            axios
                .get(api)
                .then((response) => {
                    // console.log(response.data);
                    setPosts(response.data.posts);
                    setIsLoading(false);
                })
                .catch((error) => {
                    alert(error.response.data.message);
                    // console.error(error);
                });
        } else {
            URI.includes("admin")
                ? navigate("/admin/login")
                : navigate("/login");
        }
    }, []);

    if (isLoading) {
        return <div className="text-center">Loading...</div>;
    }
    console.log(currentUser);
    return (
        <div>
            {posts.map((post) => (
                <Container key={post.post.id} className="mb-5">
                    <Card className="my-3">
                        <Card.Header>
                            <Row>
                                <Col className="text-start h6">
                                    {post.post.title}
                                </Col>
                                <Col className="text-end">
                                    {console.log(
                                        currentUser.userId === post.author.id
                                    )}
                                    {currentUser.userId == post.author.id && (
                                        <Link
                                            to={`/update_post/${post.post.id}`}
                                        >
                                            <i className="fa fa-pen-to-square"></i>
                                        </Link>
                                    )}
                                    &nbsp;
                                    {currentUser.userId === post.author.id ||
                                    currentUser.isAdmin === true ? (
                                        <Link
                                            to={`/delete_post/${post.post.id}`}
                                        >
                                            <i className="fa fa-trash text-danger"></i>
                                        </Link>
                                    ) : null}
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
                                        href={`/user/${post.author.id}/posts`}
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

                    {/* Show Like and Comment icons with no of likes and no of comments */}
                    <div className="h6">
                        <i className="fas fa-thumbs-up"></i>
                        &nbsp;
                        {post.likes.length}
                        &nbsp; &nbsp;
                        <i className="far fa-comment"></i>
                        &nbsp;
                        {post.comments.length}
                    </div>

                    {post.comments.length === 0 ? (
                        <>No Comments</>
                    ) : (
                        <> {post.comments.length} comments </>
                    )}
                </Container>
            ))}
        </div>
    );
}
