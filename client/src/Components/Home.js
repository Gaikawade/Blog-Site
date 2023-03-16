import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import ShowAllPosts from "./Articles/ShowAllPosts";

import Container from "react-bootstrap/esm/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { toast, ToastContainer } from "react-toastify";

function Home({ msg }) {
    const [showAlert, setShowAlert] = useState(true);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(20);
    const perPage = 10;

    useEffect(() => {
        axios
            .get(`/home?page=${currentPage + 1}&per_page=${perPage}`)
            .then((res) => {
                // console.log(res.data);
                setPosts(res.data.posts);
                setPageCount(Math.ceil(res.data.total_posts / perPage));
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [currentPage]);

    function changePage(data) {
        console.log(data);
        setCurrentPage(data.selected);
    }

    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <>
            <Container className="my-3">
                {msg && showAlert && (
                    <Alert
                        color="success"
                        onClose={() => setShowAlert(false)}
                        dismissible
                    >
                        {msg}
                    </Alert>
                )}
                {<ShowAllPosts posts={posts} />}
            </Container>
            {/* Pagination */}
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={"pagination justify-content-center"}
                pageClassName={"page-link"}
                previousLinkClassName={"page-link"}
                nextLinkClassName={"page-link"}
                activeClassName={"active"}
            />
        </>
    );
}

export default Home;
