import React from "react";
import Container from "react-bootstrap/esm/Container";
import Table from "react-bootstrap/esm/Table";
import { Link } from "react-router-dom";
import { blockUser } from "../script";

export default function ShowAllMembers(props) {
    let users = {};
    if(props.users){
        users = props.users;
    } else {
        users = props.admins;
    }
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
                            <th>Block/Unblock</th>
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
                                <td>
                                    <Link className="text-decoration-none">
                                        <div
                                            className="text-danger"
                                            id={`block-option-${user.id}`}
                                            onClick={() => blockUser(user.id)}
                                        >
                                            {user.is_blocked ? (
                                                <>Unblock</>
                                            ) : (
                                                <>Block</>
                                            )}
                                        </div>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}
