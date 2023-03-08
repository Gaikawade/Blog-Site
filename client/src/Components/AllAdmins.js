import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowAllUsers from "./ShowAllUsers";

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
				navigate('/')
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
		< ShowAllUsers admins={admins}/>
    );
}
