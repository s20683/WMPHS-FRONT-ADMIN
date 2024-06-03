import React from 'react';
import {Outlet} from "react-router-dom";
import TopBar from "../top/TopBar";

const MainLayout = () => {

    return (
        <>
            <TopBar />
            <Outlet />
        </>
    )
};

export default MainLayout;

