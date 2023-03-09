import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom';
import { check_token } from '../../script';


export default function AddPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [currentUser, setCurrentUser]= useState('');
    const navigate = useNavigate();

    useEffect(() => {
            axios.get('/check_login')
            .then((response) => {
                console.log(response)
                if(response.data.status == false ){
                    navigate('/login');
                }
                // console.log(response.data);
                setCurrentUser(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [])

    function handleTitleChange(e) {
        setTitle(e.target.value);
    }

    function handleContentChange(e) {
        setContent(e.target.value);
    }

    function handleSubmit(e){
        e.preventDefault();
        const token = check_token()
        axios.post('/add_post', {
            title: title,
            content: content,
            userId: currentUser.userId,
        }, token)
        .then((response) => {
            if(response.data.status) {
                // console.log(response);
                alert(response.data.message);
                navigate(`/post/${response.data.postId}`)
            } else {
                alert(response.data.message);
            }
        })
        .catch((error) => {
            console.log(error);
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
