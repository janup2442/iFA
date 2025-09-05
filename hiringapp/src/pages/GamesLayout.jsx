import React from "react";
import { Link, Routes, Route, useNavigate, Outlet } from "react-router-dom";

export default function GamesLayout() {
    const navigate = useNavigate();
    return (
        <div className="container py-4">
            <h2 className="mb-4">Games</h2>
            <div className="mb-3 d-flex gap-3">
                <Link to={'minesweepers'} className="btn btn-outline-primary">MineSweepers</Link>
                <Link to={'unlockme'} className="btn btn-outline-primary">Unlock me</Link>
                <Link to={'watercapacity'} className="btn btn-outline-primary">Water Capacity</Link>
            </div>
            <div>
                <Outlet/>
            </div>
        </div>
    );
}
