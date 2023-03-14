import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import ReactPaginate from "react-paginate";
import { useNavigate, useParams } from "react-router-dom";
import { check_token } from "../../utils";
import ShowAllPosts from "./ShowAllPosts";

export default function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(20);
    const perPage = 10;
    const navigate = useNavigate();
    const { userId } = useParams();

    useEffect(() => {
        const token = check_token();
        axios
            .get(`/user/${userId}/posts?page=${currentPage + 1}&per_page=${perPage}`, token)
            .then((response) => {
                // console.log(response.data);
                setPosts(response.data.posts);
                setPageCount(Math.ceil(response.data.total_posts/perPage));
                setIsLoading(false);
            })
            .catch((error) => {
                navigate("/");
                console.log(error);
                // alert(error.response.data.message);
                // console.error(error);
            });
    }, [currentPage]);

    function changePage(data){
        console.log(data)
        setCurrentPage(data.selected)
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
            <ShowAllPosts posts={posts} />
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
