import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom';


export default function AddPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [currentUser, setCurrentUser]= useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token){
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            axios.get('/check_login', config)
            .then((response) => {
                // console.log(response.data);
                setCurrentUser(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
        } else {
            navigate('/login');
        }
    }, [])

    function handleTitleChange(e) {
        setTitle(e.target.value);
    }

    function handleContentChange(e) {
        setContent(e.target.value);
    }

    function handleSubmit(e){
        e.preventDefault();
        axios.post('/add_post', {
            title: title,
            content: content,
            userId: currentUser.userId,
        })
        .then((response) => {
            if(response.data.status) {
                alert(response.data.message);
                navigate('/')
            } else {
                alert(response.data.message);
            }
        })
        .catch((error) => {
            alert(error.message);
        })
    }

  return (
    <div className="container">
            <Form.Floating className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Title of the Article"
                    value={title}
                    onChange={handleTitleChange}
                />
                <label htmlFor="floatingInputCustom">Title of the Article</label>
            </Form.Floating>

            <Form.Floating className="mb-3">
                <Form.Control 
                    as='textarea'
                    placeholder="Content of the Article"
                    value={content}
                    onChange={handleContentChange}
                />
                <label htmlFor="floatingPasswordCustom">Content of the Article</label>
            </Form.Floating>

            <Form.Floating>
              <Button variant="primary" type="submit" onClick={handleSubmit}>Add Post</Button>
            </Form.Floating>
        </div>
  )
}
