import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Link } from "react-router-dom";

const nameRegex = /^[a-zA-Z]+ ?[a-zA-Z ]*$/;

export default function Account() {
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [submitError, setSubmitError] = useState("");
    let userId = null;

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decodedToken = jwt_decode(token);
        userId = decodedToken.userId;
        axios
            .get(`/account`, { params: { userId } })
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
        if (!name) {
            setNameError("Please enter your name");
        } else if (name.length < 2 || !nameRegex.test(name)) {
            setNameError(
                "Name should be alpha characters only & minimum 2 characters should be expected"
            );
        }

        if (!email) {
            setEmailError("Please enter your email");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Please enter a valid email");
        }

        if (user.name == name && user.email == email) {
            setSubmitError(`You haven't update details`);
            return null;
        }
        // const token = jwt_decode(localStorage.getItem("token"));
        // userId = token.userId;
        console.log(userId);
        axios.put('/account', {params: {userId: userId }}, {
            name : name,
            email : email
        })
        .then((res) => {
            if (res.data.status){
                alert('Your account details have been updated');
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }
    if (isLoading) {
        return <div className="text-center">Loading...</div>;
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
                        <>
                            {" "}
                            Id: <strong>{user.id}</strong>{" "}
                        </>
                        <>
                            {" "}
                            Name: <strong>{user.name}</strong>{" "}
                        </>
                        <>
                            {" "}
                            Email: <strong>{user.email}</strong>{" "}
                        </>
                    </Card.Text>
                </Card.Body>
            </Card>

            <Button id={"update-button"}>Update your details</Button>

            <Form
                className="col-md-4"
                id="update-form"
                style={{ display: "block" }}
            >
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
        </Container>
    );
}
