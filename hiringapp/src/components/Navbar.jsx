import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar({ isAuthenticated, onSearch }) {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">HiringSite</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/' ? ' active' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/jobs' ? ' active' : ''}`} to="/jobs">Jobs</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${location.pathname === '/games' ? ' active' : ''}`} to="/games">Games</Link>
            </li>
          </ul>
          <form className="d-flex me-3" onSubmit={e => { e.preventDefault(); onSearch && onSearch(e.target.search.value); }}>
            <input
              className="form-control me-2"
              type="search"
              name="search"
              placeholder="Search jobs..."
              aria-label="Search"
            />
            <button className="btn btn-outline-primary" type="submit">Search</button>
          </form>
          <ul className="navbar-nav mb-2 mb-lg-0">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link${location.pathname === '/profile' ? ' active' : ''}`} to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" style={{padding:0}} onClick={() => window.location.reload()}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link${location.pathname === '/login' ? ' active' : ''}`} to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link${location.pathname === '/signup' ? ' active' : ''}`} to="/signup">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
