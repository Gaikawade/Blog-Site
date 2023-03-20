import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoginForm from "./LoginForm";
import axios from "axios";
import { check_token } from "../../utils";
import { toast, ToastContainer } from "react-toastify";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";

const nameRegex = /^[a-zA-Z]+ ?[a-zA-Z ]*$/;

export default function Account() {
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const { user_id } = useParams();
    const { config, error } = check_token();

    useEffect(() => {
        if (error) {
            setIsLoggedIn(error);
        } else {
            const fetchDetails = async () => {
                try {
                    let res = await axios.get(`/account/${user_id}`, config);
                    setUser(res.data.member);
                    setName(res.data.member.name);
                    setEmail(res.data.member.email);
                } catch (e) {
                    toast.error("Something went wrong");
                }
            };
            fetchDetails();
        }
        setIsLoading(false);
    }, []);

    function displayForm() {
        showForm ? setShowForm(false) : setShowForm(true);
    }

    function handleNameChange(e) {
        setName(e.target.value);
        setNameError("");
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailError("");
    }

    function handleSubmit(e) {
        e.preventDefault();
        // Validation
        if (name.length < 2 || !nameRegex.test(name)) {
            return setNameError(
                "Name should be alpha characters only & minimum 2 characters should be expected"
            );
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return setEmailError("Please enter a valid email");
        }
        if (user.name == name && user.email == email) {
            return setSubmitError(`You haven't update details`);
        }

        const updateDetails = async () => {
            try {
                let res = await axios.put(
                    `/account/${user_id}`,
                    {
                        name: name,
                        email: email,
                    },
                    config
                );
                if (res.data.status) {
                    toast.success(res.data.message);
                    setUser(res.data.member);
                    setShowForm(false);
                } else {
                    toast.error(res.data.message);
                }
            } catch (err) {
                if (err.response.status === 403) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error("Something went wrong");
                }
            }
        };
        updateDetails();
    }

    return (
        <>
            {isLoggedIn ? (
                <LoginForm warn={isLoggedIn} />
            ) : isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Container>
                    <ToastContainer position="top-center" autoClose={5000} />
                    <Card className="my-3">
                        <Card.Header>Account Details</Card.Header>
                        <Card.Body>
                            <Card.Title className="h5">
                                Hello <strong>{user.name}</strong>
                            </Card.Title>
                            <Card.Text>
                                Id: <strong>{user.id}</strong> <br />
                                Name: <strong>{user.name}</strong> <br />
                                Email: <strong>{user.email}</strong> <br />
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    {user_id[0] === "U" && (
                        <Button onClick={displayForm}>
                            Update your details
                        </Button>
                    )}

                    {showForm && (
                        <Form className="col-md-4">
                            <Form.Floating className="my-3">
                                <Form.Control
                                    type="name"
                                    placeholder="name"
                                    value={name}
                                    onChange={handleNameChange}
                                />
                                <label htmlFor="floatingInputCustom">
                                    Name
                                </label>
                                {nameError && (
                                    <Form.Text className="text-danger">
                                        {nameError}
                                    </Form.Text>
                                )}
                            </Form.Floating>
                            <Form.Floating className="mb-3">
                                <Form.Control
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                <label htmlFor="floatingPasswordCustom">
                                    Email`
                                </label>
                                {emailError && (
                                    <Form.Text className="text-danger">
                                        {emailError}
                                    </Form.Text>
                                )}
                            </Form.Floating>
                            {submitError && (
                                <Form.Text className="text-danger">
                                    {" "}
                                    {submitError}{" "}
                                </Form.Text>
                            )}
                            <Form.Floating>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </Form.Floating>
                        </Form>
                    )}
                </Container>
            )}
        </>
    );
}
