import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function FullPost() {
	const { post_id } = useParams()
	// const {post, setPost } = useState([])
	const [posts, setPosts] = useState([]);
	
	useEffect(() => {
        axios
            .get(`/post/${post_id}`)
            .then((res) => {
                // console.log(res.data);
                setPosts(res.data.post);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);
	
	return (
		<div>

		</div>
		)
	}
	