import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import NavLink from "react-bootstrap/esm/NavLink";

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios
            .get("/home")
            .then((res) => {
                // console.log(res.data);
                setPosts(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <Container className="my-3">
            {posts.map((post) => (
                <Card key={post.id} className="my-3">
                    <Card.Header className="text-center">
                        <strong>{post.title}</strong>
                    </Card.Header>
                    <Card.Body></Card.Body>
                    <Card.Text className="text-center">
                        {post.content.slice(0, 120)}...
                        <a href="#" className="text-decoration-none">
                            Read More
                        </a>
                    </Card.Text>
                    <Card.Footer>
                        <Row>
                            <Col className="text-start">
                                <NavLink href="author">{post.author}</NavLink>
                            </Col>
                            <Col className="text-end"> {post.created_at} </Col>
                        </Row>
                    </Card.Footer>
                </Card>
            ))}
        </Container>
    );
}

export default Home;
