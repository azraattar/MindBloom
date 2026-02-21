import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddChild.css";
import { getSession } from "../services/session";

export default function AddChild() {
  const navigate = useNavigate();
  const session = getSession();

  /* ─────────────────────────
     AUTH GUARD
  ───────────────────────── */
  useEffect(() => {
    if (!session) {
      console.warn("🚫 No session found. Redirecting to login.");
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session) return null;

  /* ─────────────────────────
     DEBUG: SESSION INFO
  ───────────────────────── */
  console.log("🧠 FULL SESSION OBJECT:", session);
  console.log("🆔 parentId being used:", session.parentId, typeof session.parentId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    age: "",
    gender: "",
    isEnglishNative: null,
  });

  /* ─────────────────────────
     FETCH CHILDREN
  ───────────────────────── */
  const fetchChildren = async () => {
    try {
      console.log("🚀 Fetching children for parentId:", session.parentId);

      setLoadingChildren(true);

      const url = `http://localhost:5000/api/get-children/${session.parentId}`;
      console.log("🌐 Request URL:", url);

      const res = await fetch(url);
      console.log("📡 Response status:", res.status);

      const data = await res.json();
      console.log("📦 Raw children response:", data);

      if (!res.ok) {
        console.error("❌ Backend error:", data);
        setChildren([]);
        return;
      }

      if (!Array.isArray(data)) {
        console.error("❌ Expected array, got:", data);
        setChildren([]);
        return;
      }

      console.log(`✅ ${data.length} child(ren) received`);
      setChildren(data);
    } catch (err) {
      console.error("❌ Fetch children exception:", err);
      setChildren([]);
    } finally {
      setLoadingChildren(false);
    }
  };

  useEffect(() => {
    fetchChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─────────────────────────
     ADD CHILD
  ───────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      parent_id: session.parentId,
      name: formData.firstName,
      age: parseInt(formData.age, 10),
      gender: formData.gender,
      language: formData.isEnglishNative ? "english" : "other",
    };

    console.log("📤 Sending add-child payload:", payload);

    try {
      const response = await fetch("http://localhost:5000/api/add-child", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📡 Add-child status:", response.status);

      const result = await response.json();
      console.log("📦 Add-child response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to add child");
      }

      alert("✅ Child added successfully!");
      setIsModalOpen(false);
      setFormData({
        firstName: "",
        age: "",
        gender: "",
        isEnglishNative: null,
      });

      fetchChildren(); // 🔁 refresh list
    } catch (err) {
      console.error("❌ Add child error:", err);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ─────────────────────────
     UI
  ───────────────────────── */
  return (
    <div className="add-child-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <span className="brand-name">MindBloom</span>
          <button onClick={() => navigate("/parent-dashboard")}>
            Parent Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="main-content">
        <div className="content-container">
          <h1 className="page-title">Your Children</h1>
          <p className="page-subtitle">
            Logged in as <strong>{session.email}</strong>
          </p>

          {/* CHILD LIST */}
          <div className="children-grid">
            {loadingChildren ? (
              <p>Loading children…</p>
            ) : children.length === 0 ? (
              <p>No children added yet.</p>
            ) : (
              children.map((child) => (
                <div key={child.id} className="child-card">
                  <div className="child-info">
                    <h3>{child.name}</h3>
                    <p>Age: {child.age}</p>
                    <p>Gender: {child.gender}</p>
                  </div>

                  <button
                    className="start-playing-btn"
                    onClick={() =>
                      navigate(`/Story-War`)
                    }
                  >
                    Start Playing ▶
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Child Button */}
          <button
            className="add-child-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Child
          </button>
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close">×</button>

            <h2>Add New Child</h2>

            <form onSubmit={handleSubmit} className="child-form">
              <input
                placeholder="Name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />

              <input
                type="number"
                placeholder="Age"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                required
              />

              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                required
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <button type="submit" disabled={isLoading}>
                {isLoading ? "Adding…" : "Add Child"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}