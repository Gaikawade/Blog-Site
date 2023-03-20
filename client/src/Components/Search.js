import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { check_token } from "../utils";
import jwt_decode from "jwt-decode";

import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/esm/Nav";
import Spinner from "react-bootstrap/esm/Spinner";
import ShowAllPosts from "./Articles/ShowAllPosts";
import ShowAllUsers from "./Members/ShowAllMembers";
import LoginForm from "./Members/LoginForm";

export default function Search() {
    const location = useLocation();
    const searchTerm = new URLSearchParams(location.search).get("q");

    const [users, setUsers] = useState({});
    const [posts, setPosts] = useState({});
    const [admins, setAdmins] = useState({});
    const [activeTab, setActiveTab] = useState("posts");
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUSer] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { error, config } = check_token();

    useEffect(() => {
        if (error) {
            setIsLoggedIn(true);
        } else {
            const token = jwt_decode(localStorage.getItem("token"));
            setCurrentUSer(token);
            axios
                .get(`/search?q=${searchTerm}`, config)
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
        }
    }, []);

    const handleSelect = (eventKey) => {
        setActiveTab(eventKey);
    };

    return (
        <>
            {isLoggedIn ? (
                <LoginForm warn={error} />
            ) : isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Container>
                    <Nav
                        variant="tabs"
                        activeKey={activeTab}
                        onSelect={handleSelect}
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="posts">Posts</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="users">Users</Nav.Link>
                        </Nav.Item>
                        {currentUser.isAdmin ? (
                            <Nav.Item>
                                <Nav.Link eventKey="admins">Admins</Nav.Link>
                            </Nav.Item>
                        ) : null}
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
            )}
        </>
    );
}
