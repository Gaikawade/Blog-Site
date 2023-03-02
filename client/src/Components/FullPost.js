import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import NavLink from "react-bootstrap/esm/NavLink";

export default function FullPost() {
	const { post_id } = useParams()
	const [post, setPost] = useState([]);
	const [currentUser, setCurrentUser] = useState({});
	
	useEffect(() => {
		const token = localStorage.getItem('jwtToken');
		const decodedToken = jwt_decode(token);
		setCurrentUser(decodedToken);
		// console.log(currentUser);
        axios
            .get(`/post/${post_id}`)
            .then((res) => {
                // console.log(res.data);
                setPost(res.data.post);
				// console.log(post);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);
	
	return (
		<div>
			<Container className="my-3">
				<Card key={post.id} className="my-3">
					<Card.Header >
						<Row>
						<Col className="text-start h6">{post.title}</Col>
						<Col className='text-end'>
							{currentUser.userId === post.authorId &&
								<Link to={`/update_post/${post.id}`}>
									<i className="fa fa-pen-to-square"></i>
								</Link>
							}
							&nbsp;
							{currentUser.userId === post.authorId &&
								<Link to={`/delete_post/${post.id}`}>
									<i class="fa fa-trash text-danger"></i>
								</Link>
							}
						</Col>
						</Row>
					</Card.Header>
					<Card.Body></Card.Body>
					<Card.Text className="text-center">
						{post.content}
					</Card.Text>
					<Card.Footer>
						<Row>
							<Col className="text-start">
								<NavLink href="author">{post.author}</NavLink>
							</Col>
							<Col className="text-end"> {post.createdAt} </Col>
						</Row>
					</Card.Footer>
				</Card>
			</Container>

			
		</div>
		)
	}
	