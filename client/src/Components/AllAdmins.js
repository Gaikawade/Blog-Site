import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Table from "react-bootstrap/esm/Table";
import { Link, useNavigate } from "react-router-dom";

export default function AllAdmins() {
	const [admins, setAdmins] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if(currentUser.status){
		axios
			.get('/admin/all_admins')
			.then((response) => {
				// console.log(response.data);
				setAdmins(response.data.admins);
				setIsLoading(false);
			})
			.catch((error) => {
				alert(error.response.data.message);
				// console.error(error);
			});
		} else {
			navigate('/admin/login')
		}
	}, []);

	if(isLoading){
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
					{admins.map((admin, i=1) => (
						<tr key={admin.id}>
							<td>{i}</td>
							<td>
								<Link to='#' className='text-decoration-none'>
									{admin.name}
								</Link>
							</td>
							<td>{admin.email}</td>
							<td>{admin.created_at}</td>
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
