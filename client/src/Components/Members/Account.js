import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import { check_token } from "../../script";

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
    const { user_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        axios
            .get(`/account/${user_id}`, config)
            .then((res) => {
                // console.log(res.data);
                setUser(res.data.member);
                setName(res.data.member.name);
                setEmail(res.data.member.email);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function displayForm() {
        if (showForm) {
            setShowForm(false);
        } else {
            setShowForm(true);
        }
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
        const token = check_token();
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

        axios
            .put(`/account/${user_id}`, {
                name: name,
                email: email,
            }, token)
            .then((res) => {
                if (res.data.status) {
                    alert("Your account details have been updated");
                    location.reload();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <Container>
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

            <Button onClick={displayForm}>Update your details</Button>

            {showForm && (
                <Form className="col-md-4">
                    <Form.Floating className="my-3">
                        <Form.Control
                            type="name"
                            placeholder="name"
                            value={name}
                            onChange={handleNameChange}
                        />
                        <label htmlFor="floatingInputCustom">Name</label>
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
                        <label htmlFor="floatingPasswordCustom">Email`</label>
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
    );
}
