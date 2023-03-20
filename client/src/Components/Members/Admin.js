import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import ShowAllMembers from "./ShowAllMembers";
import ShowAllPosts from "../Articles/ShowAllPosts";
import { check_token } from "../../utils";
import LoginForm from "./LoginForm";
import { toast } from "react-toastify";

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(20);
    const perPage = 10;
    const URI = document.URL;
    let api = null,
        source = null;

    const { config, error } = check_token();

    if (URI.includes("all_admins")) {
        api = `/admin/all_admins`;
        source = "admin";
    } else if (URI.includes("all_users")) {
        api = `/admin/all_users`;
        source = "user";
    } else if (URI.includes("all_posts")) {
        api = `/admin/all_posts`;
        source = "post";
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let res = await axios.get(api, config);
                if (source == "admin") {
                    setAdmins(res.data.admins);
                } else if (source == "user") {
                    setUsers(res.data.users);
                } else if (source == "post") {
                    setPosts(res.data.posts);
                    setPageCount(Math.ceil(res.data.total_posts / perPage));
                }
                setIsLoading(false);
            } catch (err) {
                toast.error(err.message);
            }
            fetchData();
        };
    }, [currentPage]);

    function changePage(data) {
        setCurrentPage(data.selected);
    }

    if (error) {
        return <LoginForm warn={error} />;
    }
    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div>
            <ToastContainer position="top-center" autoClose={5000} />
            {error ? (
                <LoginForm warn={error} />
            ) : isLoading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : users.length ? (
                <ShowAllMembers users={users} />
            ) : admins.length ? (
                <ShowAllMembers admins={admins} />
            ) : posts.length ? (
                <ShowAllPosts posts={posts} />
            ) : null}

            {posts.length ? (
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
            ) : null}
        </div>
    );
}
