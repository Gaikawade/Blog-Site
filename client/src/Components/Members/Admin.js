import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Spinner from "react-bootstrap/esm/Spinner";

import ShowAllMembers from "./ShowAllMembers";
import ShowAllPosts from "../Articles/ShowAllPosts";
import { check_token } from "../../utils";
import LoginForm from "./LoginForm";

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageCount, setPageCount] = useState(20);
    const perPage = 10;
    const navigate = useNavigate();
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
        axios
            .get(api, config)
            .then((response) => {
                if (source == "admin") {
                    setAdmins(response.data.admins);
                } else if (source == "user") {
                    setUsers(response.data.users);
                } else if (source == "post") {
                    setPosts(response.data.posts);
                    setPageCount(
                        Math.ceil(response.data.total_posts / perPage)
                    );
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error.code);
            });
    }, [currentPage]);

    function changePage(data) {
        console.log(data);
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
            {users.length ? (
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
