import React, { useEffect, useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import NavLink from "react-bootstrap/esm/NavLink";

export default function FullPost() {
    const { post_id } = useParams();
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useLayoutEffect(() => {
        const token = localStorage.getItem("jwtToken");
        const decodedToken = jwt_decode(token);
        // console.log(decodedToken);
        setCurrentUser(decodedToken);
        // console.log(currentUser);
        axios
            .get(`/post/${post_id}`)
            .then((res) => {
                // console.log(res.data);
                setPosts(res.data.post);
                // console.log(posts);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

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
                                {/* {currentUser.userId === posts.post.authorId && */}
                                <Link to={`/update_post/${posts.post.id}`}>
                                    <i className="fa fa-pen-to-square"></i>
                                </Link>
                                {/* } */}
                                &nbsp;
                                {/* {currentUser.userId === posts.post.authorId && */}
                                <Link to={`/delete_post/${posts.post.id}`}>
                                    <i className="fa fa-trash text-danger"></i>
                                </Link>
                                {/* } */}
                            </Col>
                        </Row>
                    </Card.Header>
                    <Card.Body></Card.Body>
                    <Card.Text className="text-center">
                        {posts.post.content}
                    </Card.Text>
                    <Card.Footer>
                        <Row>
                            <Col className="text-start">
                                <NavLink href="author">
                                    {posts.author.name}
                                </NavLink>
                            </Col>
                            <Col className="text-end">
                                {" "}
                                {posts.post.createdAt}{" "}
                            </Col>
                        </Row>
                    </Card.Footer>
                </Card>

                <div className="h6">
                    <i className="fas fa-thumbs-up"></i>
                    &nbsp;
                    {posts.likes.length}
                    &nbsp; &nbsp;
                    <i className="far fa-comment"></i>
                    &nbsp;
                    {posts.comments.length}
                </div>
                <div className="small" id='expand-comments'>
                    View all {posts.comments.length} comments
                </div>

                <Card style={{'display': 'none'}} id='comments'>
                    <Card.Header className="h6">All Comments</Card.Header>
                    {posts.comments.map((comment) => (
                        <Card.Body key={comment.id} className="px-3">
                            <Row>
                                <Col className="col-sm-6 text-start small">
									<NavLink href="#">
                                    	{comment.commented_by.name}
									</NavLink>
                                </Col>
                                <Col className="col-sm-6 text-end small">
                                    {comment.created_at}
                                    &nbsp;
                                    <i className="fa fa-trash text-danger "></i>
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
