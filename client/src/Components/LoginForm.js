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
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const URL = document.URL
    var api = ''

    if (URL.includes('admin')){
        api = '/admin/login';
    } else {
        api = '/login';
    }


    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailError('');
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        setPasswordError('');
    }

    function handleRememberChange(e) {
        setRemember(e.target.checked);
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!email) {
            setEmailError('Please enter your email');
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email');
        }
    
        if (!password) {
            setPasswordError('Please enter a password');
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
        }

        axios
            .post(api, {
                email: email,
                password: password,
                remember: remember,
            })
            .then((response) => {
                console.log(response);
                console.log(response.data.status);
                localStorage.setItem('jwtToken', response.data.token);
                navigate("/");
                window.location.reload();
            })
            .catch((err) => {
                setError(err.response.data.message);
                alert(error)
            });
    }

    return (
        <div className="container-fluid col-md-4">
            {URL.includes('admin') ? (
                <div className="h5 m-3 text-center"> Admin Login </div>
            ) : ( <div className="h5 m-3 text-center"> User Login </div> )
            }
            <Form.Floating className="mb-3">
                <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={handleEmailChange}
                />
                <label htmlFor="floatingInputCustom">Email address</label>
                {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
            </Form.Floating>
            <Form.Floating className="mb-3">
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <label htmlFor="floatingPasswordCustom">Password</label>
                {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
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
