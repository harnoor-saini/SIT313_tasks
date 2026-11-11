import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          setError("Unable to load your profile.");
          return;
        }

        setUser(data.user);
      } catch (err) {
        setError("Cannot connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login", { replace: true });
  }

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p className="auth_error">{error}</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="auth_page">
      <div className="auth_box">
        <h2>My Profile</h2>

        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Plan:</strong> {user.plan}
        </p>

        <button type="button" className="auth_btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default MyProfile;
