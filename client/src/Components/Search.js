import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/esm/Nav";
import Spinner from "react-bootstrap/esm/Spinner";
import { useLocation } from "react-router-dom";
import { check_token } from "../script";
import ShowAllPosts from "./Articles/ShowAllPosts";
import ShowAllUsers from "./Members/ShowAllMembers";

export default function Search() {
    const location = useLocation();
    const searchTerm = new URLSearchParams(location.search).get("q");

    const [users, setUsers] = useState({});
    const [posts, setPosts] = useState({});
    const [admins, setAdmins] = useState({});
    const [activeTab, setActiveTab] = useState("posts");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = check_token();
        axios
            .get(`/search?q=${searchTerm}`, token)
            .then((response) => {
                // console.log(response.data);
                setUsers(response.data.users);
                setPosts(response.data.posts);
                setAdmins(response.data.admins);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleSelect = (eventKey) => {
        setActiveTab(eventKey);
    };

    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <Container>
            <Nav variant="tabs" activeKey={activeTab} onSelect={handleSelect}>
                <Nav.Item>
                    <Nav.Link eventKey="posts">Posts</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="users">Users</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="admins">Admins</Nav.Link>
                </Nav.Item>
            </Nav>
            <br />
            {activeTab === "users" && (
                <ShowAllUsers users={users} keyword={searchTerm} />
            )}
            {activeTab === "posts" && (
                <ShowAllPosts posts={posts} keyword={searchTerm} />
            )}
            {activeTab === "admins" && (
                <ShowAllUsers admins={admins} keyword={searchTerm} />
            )}
        </Container>
    );
}
