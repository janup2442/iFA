import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start mt-auto shadow-sm">
      <div className="container p-3">
        <span className="text-muted">&copy; {new Date().getFullYear()} HiringSite. All rights reserved.</span>
      </div>
    </footer>
  );
}
