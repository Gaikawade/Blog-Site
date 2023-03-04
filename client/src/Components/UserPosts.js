// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// import Container from "react-bootstrap/esm/Container";
// import Card from "react-bootstrap/esm/Card";
// import Row from "react-bootstrap/esm/Row";
// import Col from "react-bootstrap/esm/Col";

// export default function UserPosts() {
//     const [posts, setPosts] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [currentUser]
//     const { userId } = useParams();

//     useEffect(() => {
//         axios.get(`/user/${userId}/posts`)
//         .then((response) => {
//             console.log(response.data.posts)
//             setPosts(response.data.posts);
//             setIsLoading(false);
//         })
//         .catch((error) => {
//             alert(error.response.data.message);
//         })
//     }, []);

//     if(isLoading){
//         return <div className='text-center'>Loading...</div>
//     }

//     return (
//         <div>
//             {posts.map((post) => (
//                 <Container key={post.post.id} className="mb-5">
//                     <Card className="my-3">
//                         <Card.Header>
//                             <Row>
//                                 <Col className="text-start h6">
//                                     {post.post.title}
//                                 </Col>
//                                 <Col className="text-end">
//                                     {currentUser.userId === post.author.id || currentUser.isAdmin === true &&
//                                         <Link to={`/delete_post/${post.post.id}`}>
//                                             <i className="fa fa-trash text-danger"></i>
//                                         </Link>
//                                     }
//                                 </Col>
//                             </Row>
//                         </Card.Header>
//                         <Card.Text className="text-center p-3">
//                             {post.post.content.slice(0,120)}...
//                             <Link to={`/post/${post.post.id}`} className='text-decoration-none'>Read More</Link>
//                         </Card.Text>
//                         <Card.Footer>
//                             <Row>
//                                 <Col className="text-start">
//                                     <Link
//                                         href={`/user/${post.author.id}/posts`}
//                                         className="text-decoration-none"
//                                     >
//                                         {post.author.name}
//                                     </Link>
//                                 </Col>
//                                 <Col className="text-end">
//                                     Posted on: {post.post.created_at}
//                                 </Col>
//                             </Row>
//                         </Card.Footer>
//                     </Card>

//                     {/* Show Like and Comment icons with no of likes and no of comments */}
//                     <div className="h6">
//                         <i className="fas fa-thumbs-up"></i>
//                         &nbsp;
//                         {post.likes.length}
//                         &nbsp; &nbsp;
//                         <i className="far fa-comment"></i>
//                         &nbsp;
//                         {post.comments.length}
//                     </div>

//                     {post.comments.length === 0 ? (
//                         <>No Comments</>
//                     ) : (
//                         <> {post.comments.length} comments </>
//                     )}
//                 </Container>
//             ))}
//         </div>
//     );
// }
