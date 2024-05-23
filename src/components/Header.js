import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { auth } from "../config/firestore";
import { Link, Navigate } from "react-router-dom";
import { clearUserDataFromLocalStorage, getUserDataFromLocalStorage } from "../config/localstorage";

function Header() {
  const { user, setUser } = useContext(UserContext);

  const signOut = () => {
    auth.signOut()
      .then(() => {
        console.log('Đăng xuất thành công');
        setIsCollapseOpen(false);
        document.documentElement.classList.remove("nav_open");
        localStorage.removeItem("isLoggedIn");
        clearUserDataFromLocalStorage();
        setUser(null);
        window.location.reload();
      })
      .catch((error) => {
        console.log('Lỗi khi đăng xuất:', error);
      });
  }

  const [isCollapseOpen, setIsCollapseOpen] = useState(false);
  const [isTopbarOpen, setIsTopbarOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapseOpen(!isCollapseOpen);
    document.documentElement.classList.toggle("nav_open");
  }

  const topbarCollapse = () => {
    setIsTopbarOpen(!isTopbarOpen);
    document.documentElement.classList.toggle("topbar_open");
  }

  useEffect(() => {
    const userData = getUserDataFromLocalStorage();
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true' && userData) {
      setUser(userData);
    }
  }, []);


  return (
    <>
      <div className="main-header">
        <div className="logo-header">
          <Link to='/statistics' className="logo" style={{textDecoration: 'none'}}>
            <span>Admin CookApp</span>
          </Link>
          <button
            className={`navbar-toggler sidenav-toggler ml-auto ${isCollapseOpen ? 'toggled' : ''}`}
            type="button"
            onClick={toggleCollapse}
            aria-controls="sidebar"
            aria-expanded={isCollapseOpen ? 'true' : 'false'}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <button className={`topbar-toggler more ${isTopbarOpen ? 'toggled': ''}`}
          onClick={topbarCollapse}>
            <i className="la la-ellipsis-v" />
          </button>
        </div>
        <nav className="navbar navbar-header navbar-expand-lg">
          <div className="container-fluid">
            <ul className="navbar-nav topbar-nav ml-md-auto align-items-center">
              {
                user && (
                  <li className="nav-item dropdown">
                    <a
                      className="dropdown-toggle profile-pic"
                      data-toggle="dropdown"
                      href="#"
                      aria-expanded="false"
                    >
                      <img
                        src={user.user_image}
                        alt="user-img"
                        width={36}
                        className="img-circle"
                      />
                      <span>{user.user_name}</span>{" "}
                    </a>
                    <ul className="dropdown-menu dropdown-user">
                      <li>
                        <div className="user-box">
                          <div className="u-img">
                            <img src={user.user_image} alt="user" />
                          </div>
                          <div className="u-text">
                            <h4>{user.user_name}</h4>
                            <p className="text-muted">{user.email}</p>
                            <a
                              href="#"
                              className="btn btn-rounded btn-danger btn-sm"
                            >
                              View Profile
                            </a>
                          </div>
                        </div>
                      </li>
                      <div className="dropdown-divider" />
                      <Link className="dropdown-item" to='/login' onClick={signOut}>
                        <i className="fa fa-power-off" /> Logout
                      </Link>
                    </ul>
                  </li>
                )
              }
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Header;