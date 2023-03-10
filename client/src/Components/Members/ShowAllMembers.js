import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Container from "react-bootstrap/esm/Container";
import Table from "react-bootstrap/esm/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import { blockUser } from "../../utils";

export default function ShowAllMembers(props) {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    let users = {};
    if (!token) {
        navigate("/login");
    }
    const currentUser = jwt_decode(token);

    if (props.users) {
        users = props.users;
    } else {
        users = props.admins;
    }

    const handleShowModal = (user) => {
        setUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setUser(null);
        setShowModal(false);
    };

    const handleConfirm = (id) => {
        blockUser(id);
        handleCloseModal();
    };

    return (
        <Container>
            {!users.length ? (
                <div>
                    No member found with name <strong>{props.keyword}</strong>
                </div>
            ) : (
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Joined On</th>
                            {currentUser.isAdmin ? (
                                <th>Block/Unblock</th>
                            ) : null}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, i = 1) => (
                            <tr key={user.id}>
                                <td>{i}</td>
                                <td>
                                    <Link
                                        to={`/user/${user.id}/posts`}
                                        className="text-decoration-none"
                                    >
                                        {user.name}
                                    </Link>
                                </td>
                                <td>{user.email}</td>
                                <td>{user.created_at}</td>
                                {currentUser.isAdmin ? (
                                    <td>
                                        <Link className="text-decoration-none">
                                            <div
                                                className="text-danger"
                                                id={`block-option-${user.id}`}
                                                onClick={() =>
                                                    handleShowModal(user)
                                                }
                                            >
                                                {user.is_blocked ? (
                                                    <>Unblock</>
                                                ) : (
                                                    <>Block</>
                                                )}
                                            </div>
                                        </Link>
                                    </td>
                                ) : null}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {user ? (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Block</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to{" "}
                        {user.is_blocked ? "Un-block" : "Block"}
                        &nbsp;
                        <strong>{user.name}</strong>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => handleConfirm(user.id)}
                        >
                            {user.is_blocked ? "Unblock" : "Block"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : null}
        </Container>
    );
}
