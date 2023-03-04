import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import NavLink from "react-bootstrap/esm/NavLink";

function Home() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/home")
            .then((res) => {
                // console.log(res.data);
                setPosts(res.data.posts);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    if(isLoading) {
        return <p className="text-center">Loading...</p>;
    }

    return (
        <Container className="my-3">
            {posts.map((post) => (
                <Card key={post.post.id} className="my-3">
                    <Card.Header className="text-center">
                        <strong>{post.post.title}</strong>
                    </Card.Header>
                    <Card.Body></Card.Body>
                    <Card.Text className="text-center">
                        {post.post.content.slice(0, 120)}...
                        <Link to={`/post/${post.post.id}`} className="text-decoration-none">
                            Read More
                        </Link>
                    </Card.Text>
                    <Card.Footer>
                        <Row>
                            <Col className="text-start">
                                <NavLink href={`/user/${post.author.id}/posts`}>{post.author.name}</NavLink>
                            </Col>
                            <Col className="text-end"> {post.post.created_at} </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            ))}
        </Container>
    );
}

export default Home;
