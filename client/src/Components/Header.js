import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";

function Header(props) {
    const { updateUrl } = props;
    const [currentUser, setCurrentUser] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [searchError, setSearchError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("/check_login")
            .then((response) => {
                setCurrentUser(response.data);
                // console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    function handleClick(source) {
        navigate(`/admin/${source}`);
      }

    function handleChangeSearchKeyword(e) {
        setSearchTerm(e.target.value);
    }

    function handleSearch(e) {
        e.preventDefault();
        if(!searchTerm.trim()){
            return setSearchError('Please enter a search term')
        }
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
    }

    return (
        <>
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
                                        <Link
                                            className="nav-link"
                                            to={`/user/${currentUser.userId}/posts`}
                                        >
                                            My Posts
                                        </Link>
                                    </>
                                )}
                                {currentUser.isAdmin && (
                                    <>
                                        <Link
                                            className="nav-link"
                                            to="/admin/all_users"
                                            onClick={() => updateUrl('users')}
                                        >
                                            Users
                                        </Link>
                                        <Link
                                            className="nav-link"
                                            to="/admin/all_posts"
                                            onClick={() => updateUrl('posts')}
                                        >
                                            Posts
                                        </Link>
                                        <Link
                                            className="nav-link"
                                            to="/admin/all_admins"
                                            onClick={() => updateUrl('admins')}
                                        >
                                            Admins
                                        </Link>
                                    </>
                                )}
                                <Link className="nav-link" to={`/account/${currentUser.userId}`}>
                                    Account
                                </Link>
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
                            onChange={handleChangeSearchKeyword}
                            onSubmit={handleSearch}
                        />
                        <Button
                            variant="outline-success"
                            type="submit"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
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
                                    {currentUser.isAdmin && (
                                        <Dropdown.Item href="/admin/register">
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
        {searchError && <div className="text-danger text-center">{searchError}</div>}
        </>
    );
}

export default Header;
