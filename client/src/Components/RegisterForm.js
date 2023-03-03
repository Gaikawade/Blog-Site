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
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const navigate = useNavigate();
    const URL = document.URL;
    const nameRegex = /^[a-zA-Z]+ ?[a-zA-Z ]*$/;
    var api = '';
    var navigateUrl = ''

    if (URL.includes('admin')){
        api = '/admin/register';
        navigateUrl = '/';
    } else {
        api = '/register';
        navigateUrl = '/login';
    }

    function handleNameChange(e) {
        setName(e.target.value);
        setNameError('')
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailError('');
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        setPasswordError('');
    }

    function handleConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError('');
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Validate form inputs
        if (!name) {
            setNameError('Please enter your name');
        } else if (name.length < 2 || !nameRegex.test(name)) {
            setNameError('Name should be alpha characters only & minimum 2 characters should be expected');
        }
    
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
    
        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
        } else if (confirmPassword !== password) {
            setConfirmPasswordError('Passwords do not match');
        }

        axios
            .post(api, {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            })
            .then((response) => {
                // console.log(response.data);
                if (response.data.status === false){
                    console.log(response.data.message);
                    alert(response.data.message);
                } else {
                    alert('Registration successful')
                    navigate(navigateUrl);
                }
            })
            .catch((err) => {
                console.log(err)
                alert(err.message);
            });
    }

    return (
        <Form className="container-fluid col-md-4">
            {URL.includes('admin') ? (
                <div className="h5 m-3 text-center"> Admin Registration Form </div>
            ) : ( <div className="h5 m-3 text-center"> User Registration Form </div> )
            }
            <Form.Floating className="mb-3">
                <Form.Control
                    type="text"
                    name='name'
                    placeholder="name"
                    value={name}
                    onChange={handleNameChange}
                />
                <label htmlFor="floatingInputCustom">Name</label>
                {nameError && <Form.Text className="text-danger">{nameError}</Form.Text>}
            </Form.Floating>

            <Form.Floating className="mb-3">
                <Form.Control
                    type="email"
                    name='email'
                    placeholder="Email address"
                    value={email}
                    onChange={handleEmailChange}
                />
                <label htmlFor="floatingInputCustom">Email address</label>
                {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
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
                {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
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
                {confirmPasswordError && <Form.Text className="text-danger">{confirmPasswordError}</Form.Text>}
            </Form.Floating>

            <Form.Floating>
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Submit
                </Button>
            </Form.Floating>

        </Form>
    );
}
