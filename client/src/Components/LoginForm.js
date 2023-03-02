import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import axios from "axios";
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
                console.log(response.data);
                navigate("/home");
            })
            .catch((err) => {
                setError(err.response.data.message);
                console.log(error)
            });
    }

    return (
        // <form onSubmit={handleSubmit} className='container-fluid col-md-4'>
        //     <div className="form-floating">
        //         <label className="floatingInput">Email:</label>
        //         <input
        //             className="form-control"
        //             type="email"
        //             value={email}
        //             onChange={handleEmailChange}
        //         />
        //     </div>
        //     <div className="form-floating">
        //         <label className="floatingInput">Password:</label>
        //         <input
        //             className="form-control"
        //             type="password"
        //             value={password}
        //             onChange={handlePasswordChange}
        //         />
        //     </div>
        //     <div>
        //         <input
        //             type="checkbox"
        //             checked={remember}
        //             onChange={handleRememberChange}
        //         />
        //         <label>Remember Me</label>
        //     </div>
        //     <div>
        //         <button type="submit">Log In</button>
        //     </div>
        //     {error && <div>{error}</div>}
        // </form>

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
