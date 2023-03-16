import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function LoginForm({ warn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const URL = document.URL;
    var api = "";

    if (URL.includes("admin")) {
        api = "/admin/login";
    } else {
        api = "/login";
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailError("");
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        setPasswordError("");
    }

    function handleRememberChange(e) {
        setRemember(e.target.checked);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Please enter a valid email");
        }
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
        }

        axios
            .post(api, {
                email: email,
                password: password,
                remember: remember,
            })
            .then((response) => {
                localStorage.clear();
                localStorage.setItem("token", response.data.token);
                navigate("/");
                location.reload();
            })
            .catch((err) => {
                setError(err.response.data.message);
                // alert(error)
            });
    }

    return (
        <Container className="col-md-4">
            {URL.includes("admin") ? (
                <div className="h5 m-3 text-center"> Admin Login </div>
            ) : (
                <div className="h5 m-3 text-center"> User Login </div>
            )}
            {error && <div className="text-danger mb-3">{error}</div>}
            {warn && <div className="text-danger mb-3">{warn}</div>}
            <Form onSubmit={handleSubmit}>
                <Form.Floating className="mb-3">
                    <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={handleEmailChange}
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
                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Remember Me"
                        value={remember}
                        onChange={handleRememberChange}
                    />
                </Form.Group>
                <Form.Floating className="mb-3">
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Form.Floating>
                {warn ? (
                    <>
                        If your are admin please login{" "}
                        <Link to={"/admin/login"}>here</Link>
                    </>
                ) : !URL.includes("admin") || warn ? (
                    <>
                        Dont't have Account?{" "}
                        <Link to={"/register"}>Register</Link>
                    </>
                ) : null}
            </Form>
        </Container>
    );
}

export default LoginForm;
