import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function NavigationBar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      const token = localStorage.getItem("token");

      if (!token) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token");
          }

          if (active) setUser(null);
          return;
        }

        const data = await response.json();

        if (active) setUser(data.user);
      } catch (error) {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    function updateAuthState() {
      setLoading(true);
      checkAuth();
    }

    checkAuth();

    window.addEventListener("auth-change", updateAuthState);
    window.addEventListener("storage", updateAuthState);

    return () => {
      active = false;
      window.removeEventListener("auth-change", updateAuthState);
      window.removeEventListener("storage", updateAuthState);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  }

  const firstName = user?.name?.trim().split(/\s+/)[0];

  return (
    <div className="navigation_bar">
      <nav className="navbar">
        <ul className="nav_menu">
          <li className="nav_brand">
            <Link to="/">DEV@Deakin</Link>
          </li>

          <li className="nav_search">
            <FaSearch className="search_icon" />
            <input type="text" placeholder="Search..." />
          </li>

          <li>
            <Link to="/post">Post</Link>
          </li>

          <li>
            <Link to="/pricing">Pricing</Link>
          </li>

          <li className="nav_auth">
            {!loading && user ? (
              <>
                <Link to="/my-profile" className="nav_greeting">
                  Hi, {firstName}
                </Link>

                <button
                  type="button"
                  className="nav_logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : !loading ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign up</Link>
              </>
            ) : null}
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavigationBar;
