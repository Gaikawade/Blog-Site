import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {Form, Button ,Container} from "react-bootstrap";

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [submitError, setSubmitError] = useState("");
    const navigate = useNavigate();
    const URL = document.URL;
    const nameRegex = /^[a-zA-Z]+ ?[a-zA-Z ]*$/;
    var api = "";
    var navigateUrl = "";

    if (URL.includes("admin")) {
        api = "/admin/register";
        navigateUrl = "/";
    } else {
        api = "/register";
        navigateUrl = "/login";
    }

    function handleNameChange(e) {
        setName(e.target.value);
        setNameError("");
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailError("");
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        setPasswordError("");
    }

    function handleConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError("");
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Validate form inputs
        if (name.length < 2 || !nameRegex.test(name)) {
            setNameError(
                "Name should be alpha characters only & minimum 2 characters should be expected"
            );
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Please enter a valid email");
        }

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
        }

        if (confirmPassword !== password) {
            setConfirmPasswordError("Passwords do not match");
        }

        axios
            .post(api, {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            })
            .then((response) => {
                if (response.data.status === false) {
                    setSubmitError(response.data.message);
                    alert(response.data.message);
                } else {
                    navigate(navigateUrl);
                    alert("Registration successful");
                }
            })
            .catch((err) => {
                setSubmitError(err.response.data.message);
            });
    }

    return (
        <Container>
            <Form className="container col-md-4">
                {URL.includes("admin") ? (
                    <div className="h5 m-3 text-center">
                        {" "}
                        Admin Registration Form{" "}
                    </div>
                ) : (
                    <div className="h5 m-3 text-center">
                        {" "}
                        User Registration Form{" "}
                    </div>
                )}
                {submitError && (
                    <div className="text-danger">{submitError}</div>
                )}
                <Form.Floating className="mb-3">
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="name"
                        value={name}
                        onChange={handleNameChange}
                        required={true}
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
                        name="email"
                        placeholder="Email address"
                        value={email}
                        onChange={handleEmailChange}
                        required={true}
                    />
                    <label htmlFor="floatingInputCustom">Email address</label>
                    {emailError && (
                        <Form.Text className="text-danger">
                            {emailError}
                        </Form.Text>
                    )}
                </Form.Floating>

                <Form.Floating className="mb-3">
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <label htmlFor="floatingPasswordCustom">Password</label>
                    {passwordError && (
                        <Form.Text className="text-danger">
                            {passwordError}
                        </Form.Text>
                    )}
                </Form.Floating>

                <Form.Floating className="mb-3">
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                    />
                    <label htmlFor="floatingPasswordCustom">
                        Confirm Password
                    </label>
                    {confirmPasswordError && (
                        <Form.Text className="text-danger">
                            {confirmPasswordError}
                        </Form.Text>
                    )}
                </Form.Floating>

                <Form.Floating className="mb-3">
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Form.Floating>
                {!URL.includes("admin") ? (
                    <>
                        Already have account? <Link to={"/login"}>Login</Link>{" "}
                    </>
                ) : null}
            </Form>
        </Container>
    );
}
