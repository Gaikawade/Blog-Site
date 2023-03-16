import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { check_token } from "../../utils";
import Home from "../Home";

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [isPasswordChanged, setIsPasswordChanged] = useState(false);
    const { config } = check_token();
    const navigate = useNavigate();
    const { user_id } = useParams();

    function handleOldPasswordChange(e) {
        setOldPassword(e.target.value);
        setOldPasswordError("");
    }
    function handleNewPasswordChange(e) {
        setNewPassword(e.target.value);
        setNewPasswordError("");
    }
    function handleConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError("");
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (oldPassword.length < 6) {
            setOldPasswordError("Password must be at least 6 characters long");
        }
        if (newPassword.length < 6) {
            setNewPasswordError("Password must be at least 6 characters long");
        }
        if (confirmPassword.length < 6) {
            setConfirmPasswordError(
                "Password must be at least 6 characters long"
            );
        }
        if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Password mismatch");
        }

        axios
            .post(
                `/change_password/${user_id}`,
                {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                },
                config
            )
            .then((response) => {
                // console.log(response);
                if (response.data.status) {
                    setIsPasswordChanged(true);
                }
            })
            .catch((err) => {
                console.log(err);
                setError(err.response.data.message);
                // alert(error)
            });
    }

    return (
        <>
            {isPasswordChanged ? (
                <Home msg={'Password Changed Successfully'} />
            ) : (
                <Container className="col-md-4">
                    <h5>Update Password</h5>
                    {error && <div className="text-danger mb-3">{error}</div>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Floating className="my-3">
                            <Form.Control
                                type="password"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={handleOldPasswordChange}
                            />
                            <label htmlFor="floatingInputCustom">
                                Old Password
                            </label>
                            {oldPasswordError && (
                                <Form.Text className="text-danger">
                                    {oldPasswordError}
                                </Form.Text>
                            )}
                        </Form.Floating>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                            />
                            <label htmlFor="floatingPasswordCustom">
                                New Password
                            </label>
                            {newPasswordError && (
                                <Form.Text className="text-danger">
                                    {newPasswordError}
                                </Form.Text>
                            )}
                        </Form.Floating>
                        <Form.Floating className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                            <label htmlFor="floatingPasswordCustom">
                                Confirm New Password
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
                    </Form>
                </Container>
            )}
        </>
    );
}

export default ChangePassword;
