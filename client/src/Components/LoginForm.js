import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleRememberChange(e) {
        setRemember(e.target.checked);
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios
            .post("/login", {
                email: email,
                password: password,
                remember: remember,
            })
            .then((response) => {
                // console.log(response);
                // console.log(response.data.status);
                navigate("/home");
            })
            .catch((err) => {
                setError(err.response.data.message);
                alert(error)
            });
    }

    return (
        <div className="container-fluid col-md-4">
            <Form.Floating className="mb-3">
                <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={handleEmailChange}
                />
                <label htmlFor="floatingInputCustom">Email address</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <label htmlFor="floatingPasswordCustom">Password</label>
            </Form.Floating>
            <Form.Group className="mb-3">
                <Form.Check
                    type="checkbox"
                    label="Remember Me"
                    value={remember}
                    onChange={handleRememberChange}
                />
            </Form.Group>
            <Form.Floating>
              <Button variant="primary" type="submit" onClick={handleSubmit}>Submit</Button>
            </Form.Floating>
        </div>
    );
}

export default LoginForm;
