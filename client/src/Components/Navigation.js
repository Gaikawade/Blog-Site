import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";

function NavScrollExample() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        axios
            .get("/check_login")
            .then((response) => {
                setIsLoggedIn(true);
                setCurrentUser(response.data);
                localStorage.setItem("currentUser", JSON.stringify(response.data));
                // console.log(response.data);
                // console.log(isLoggedIn);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <Navbar bg="light" expand="lg" className="mb-3">
            <Container fluid>
                <Navbar.Brand href="/">Home</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: "100px" }}
                        navbarScroll
                    >
                        {currentUser.status ? (
                            <>
                                {!currentUser.isAdmin && (
                                    <>
                                        <Link
                                            className="nav-link"
                                            to="add_post"
                                        >
                                            Add Post
                                        </Link>
                                        <Link className="nav-link" to="/user/all_posts">
                                            My Posts
                                        </Link>
                                    </>
                                )}
                                {currentUser.isAdmin && (
                                    <>
                                        <Link className="nav-link" to="/admin/all_users">
                                            Users
                                        </Link>
                                        <Link className="nav-link" to="/admin/all_posts">
                                            Posts
                                        </Link>
                                        <Link className="nav-link" to="/admin/all_admins">
                                            Admins
                                        </Link>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Link className="nav-link" to="/register">
                                    Register
                                </Link>
                                <Link className="nav-link" to="/login">
                                    Login
                                </Link>
                            </>
                        )}
                    </Nav>
                    <Form className="d-flex">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                    &nbsp; &nbsp;
                    <Dropdown drop="start">
                        <Dropdown.Toggle>More</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {!currentUser.status ? (
                                <Dropdown.Item href="admin/login">
                                    Admin Login
                                </Dropdown.Item>
                            ) : (
                                <>
                                    {currentUser.is_admin == true && (
                                        <Dropdown.Item href="admin/register">
                                            Admin Register
                                        </Dropdown.Item>
                                    )}
                                    <Dropdown.Item href="/logout">
                                        Logout
                                    </Dropdown.Item>
                                </>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavScrollExample;
