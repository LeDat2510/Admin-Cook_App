import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const [activeLink, setActiveLink] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const links = ["/statistics", "/manageuser", "/managefood", "/manageblog", "/managetypeoffood", "/approvefood", "/approveblog"];
    const activeIndex = links.findIndex((link) => location.pathname.startsWith(link));
    setActiveLink(activeIndex);
    localStorage.setItem("activeLink", activeIndex);
  }, [location]);

  return (
    <>
      <div className="sidebar">
        <div className="scrollbar-inner sidebar-wrapper">
          <ul className="nav">
            <li className={`nav-item ${activeLink === 0 ? 'active' : ''}`}>
              <Link to='/statistics'>
                <i className="la la-bar-chart" />
                Thống kê
              </Link>
            </li>
            <li className={`nav-item ${activeLink === 1 ? 'active' : ''}`}>
              <Link to='/manageuser'>
                <i className="la la-users" />
                Quản lý người dùng
              </Link>
            </li>
            <li className={`nav-item ${activeLink === 2 ? 'active' : ''}`}>
              <Link to='/managefood'>
                <i className="la la-apple" />
                <p>Quản lý công thức</p>
              </Link>
            </li>
            <li className={`nav-item ${activeLink === 3 ? 'active' : ''}`}>
              <Link to='/manageblog'>
                <i className="la la-pencil-square" />
                <p>Quản lý bài blog</p>
              </Link>
            </li>
            <li className={`nav-item ${activeLink === 4 ? 'active' : ''}`}>
              <Link to='/managetypeoffood'>
                <i className="la la-list" />
                <p>Quản lý loại món</p>
              </Link>
            </li>
            <li className={`nav-item ${activeLink === 5 ? 'active' : ''}`}>
              <Link to='/approvefood'>
                <i className="la la-check-circle" />
                <p>Duyệt món ăn</p>
              </Link>
            </li>
            <li className={`nav-item ${activeLink === 6 ? 'active' : ''}`} >
              <Link to='/approveblog'>
                <i className="la la-check-square" />
                <p>Duyệt bài blog</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;