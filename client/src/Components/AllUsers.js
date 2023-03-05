import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Container from "react-bootstrap/esm/Container";
import Table from "react-bootstrap/esm/Table";

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser.status) {
            axios
                .get("/admin/all_users")
                .then((response) => {
                    // console.log(response.data);
                    setUsers(response.data.users);
                    setIsLoading(false);
                })
                .catch((error) => {
                    navigate('/')
                    alert(error.response.data.message);
                    // console.error(error);
                });
        } else {
            navigate("/admin/login");
        }
    }, []);

    if (isLoading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <Container>
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
					{users.map((user, i=1) => (
						<tr key={user.id}>
							<td>{i}</td>
							<td>
								<Link to={`/user/${user.id}/posts`} className='text-decoration-none'>
									{user.name}
								</Link>
							</td>
							<td>{user.email}</td>
							<td>{user.created_at}</td>
							<td>
								<Link to='#' className='text-decoration-none'>
									Block
								</Link>
							</td>
						</tr>
					))}
                </tbody>
            </Table>
        </Container>
    );
}
