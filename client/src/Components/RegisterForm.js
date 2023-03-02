import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios
            .post("/register", {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            })
            .then((response) => {
                // console.log(response.data);
                if (response.data.status === false)
                    alert(response.data.message);
                else
                    navigate("/login");
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    return (
        <Form className="container-fluid col-md-4">

            <Form.Floating className="mb-3">
                <Form.Control
                    type="text"
                    name='name'
                    placeholder="name"
                    value={name}
                    onChange={handleNameChange}
                />
                <label htmlFor="floatingInputCustom">Name</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
                <Form.Control
                    type="email"
                    name='email'
                    placeholder="name@example.com"
                    value={email}
                    onChange={handleEmailChange}
                />
                <label htmlFor="floatingInputCustom">Email address</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
                <Form.Control
                    type="password"
                    name='password'
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <label htmlFor="floatingPasswordCustom">Password</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
                <Form.Control
                    type="password"
                    name='confirmPassword'
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                />
                <label htmlFor="floatingPasswordCustom">Confirm Password</label>
            </Form.Floating>

            <Form.Floating>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Submit
                </Button>
            </Form.Floating>

        </Form>
    );
}
