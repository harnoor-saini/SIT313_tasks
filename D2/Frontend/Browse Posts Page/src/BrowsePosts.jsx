import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/BrowsePosts.css";

const API_URL = "http://localhost:3000";

function getPreview(post) {
  const text = post.type === "question" ? post.description : post.abstract;

  if (text.length > 120) {
    return text.slice(0, 120) + "...";
  }

  return text;
}

function formatDate(dateString) {
  if (!dateString) {
    return "Unknown date";
  }

  return new Date(dateString).toLocaleDateString();
}

function BrowsePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const [typeFilter, setTypeFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [hiddenIds, setHiddenIds] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const token = localStorage.getItem("token");
      const headers = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      try {
        const response = await fetch(`${API_URL}/posts`, { headers });
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to load posts.");
          return;
        }

        setPosts(data.posts);

        if (token) {
          const meResponse = await fetch(`${API_URL}/me`, { headers });

          if (meResponse.ok) {
            const meData = await meResponse.json();

            setLoggedIn(true);

            if (meData.user.plan === "paid") {
              setIsPaid(true);
            }
          }
        }
      } catch (err) {
        setError("Cannot connect to the server. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  function toggleExpand(id) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  }

  function handleHide(e, id) {
    e.stopPropagation();
    setHiddenIds([...hiddenIds, id]);
  }

  function handleReset() {
    setTypeFilter("all");
    setPlanFilter("all");
    setTagFilter("");
    setDateFilter("");
    setHiddenIds([]);
    setExpandedId(null);
  }

  const visiblePosts = posts.filter((post) => {
    if (hiddenIds.includes(post.id)) {
      return false;
    }

    if (typeFilter !== "all" && post.type !== typeFilter) {
      return false;
    }

    if (planFilter !== "all" && post.plan !== planFilter) {
      return false;
    }

    if (tagFilter.trim() !== "") {
      const search = tagFilter.trim().toLowerCase();
      const hasTag = post.tags.some((tag) => tag.toLowerCase().includes(search));

      if (!hasTag) {
        return false;
      }
    }

    if (dateFilter !== "") {
      if (!post.createdAt) {
        return false;
      }

      if (new Date(post.createdAt) < new Date(dateFilter + "T00:00:00")) {
        return false;
      }
    }

    return true;
  });

  if (loading) {
    return <p className="browse_message">Loading posts...</p>;
  }

  if (error) {
    return <p className="auth_error">{error}</p>;
  }

  return (
    <div className="browse_page">
      <div className="post_bar">Browse Posts</div>

      {!isPaid && (
        <div className="browse_notice">
          {loggedIn
            ? "You are on the Free plan, so paid posts are hidden. "
            : "You are not logged in, so paid posts are hidden. "}
          <Link to="/pricing">Upgrade to a Paid plan</Link> to see all posts.
        </div>
      )}

      <div className="browse_filters">
        <div className="browse_filter">
          <label>Type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="question">Question</option>
            <option value="article">Article</option>
          </select>
        </div>

        <div className="browse_filter">
          <label>Plan</label>
          <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="browse_filter">
          <label>Tag</label>
          <input
            type="text"
            placeholder="e.g. Java"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </div>

        <div className="browse_filter">
          <label>Posted on or after</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <button className="browse_reset_btn" onClick={handleReset}>
          Reset
        </button>
      </div>

      <p className="browse_count">
        Showing {visiblePosts.length} of {posts.length} posts
        {hiddenIds.length > 0 && ` (${hiddenIds.length} hidden)`}
      </p>

      {visiblePosts.length === 0 && (
        <p className="browse_message">No posts match your filters.</p>
      )}

      {visiblePosts.map((post) => (
        <div
          key={post.id}
          className="browse_card"
          onClick={() => toggleExpand(post.id)}
        >
          <div className="browse_card_top">
            <div className="browse_badges">
              <span className="browse_badge browse_type">{post.type}</span>
              <span className={post.plan === "paid" ? "browse_badge browse_paid" : "browse_badge browse_free"}>
                {post.plan}
              </span>
            </div>

            <button
              className="browse_hide_btn"
              onClick={(e) => handleHide(e, post.id)}
            >
              Hide
            </button>
          </div>

          <h3 className="browse_title">{post.title}</h3>

          <p className="browse_meta">
            By {post.authorName} on {formatDate(post.createdAt)}
          </p>

          {expandedId !== post.id && (
            <p className="browse_preview">{getPreview(post)}</p>
          )}

          {expandedId === post.id && (
            <div className="browse_full">
              {post.type === "question" && (
                <p className="browse_text">{post.description}</p>
              )}

              {post.type === "article" && (
                <div>
                  <p className="browse_label">Abstract</p>
                  <p className="browse_text">{post.abstract}</p>
                  <p className="browse_label">Article</p>
                  <p className="browse_text">{post.articleText}</p>
                </div>
              )}
            </div>
          )}

          <p className="browse_tags">Tags: {post.tags.join(", ")}</p>

          <p className="browse_hint">
            {expandedId === post.id ? "Click to collapse" : "Click to read more"}
          </p>
        </div>
      ))}
    </div>
  );
}

export default BrowsePosts;