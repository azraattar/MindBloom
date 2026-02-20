import { useState } from "react";
import "../styles/AddChild.css";

export default function AddChild() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    age: "",
    gender: "",
    isEnglishNative: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/add-child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if using JWT
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          parent_identifier: localStorage.getItem('parent_email') ,
          name: formData.firstName,
          age: parseInt(formData.age),
          gender: formData.gender,
          language: formData.isEnglishNative === true ? 'english' : 'other'
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Child added successfully!');
        setIsModalOpen(false);
        setFormData({ firstName: "", age: "", gender: "", isEnglishNative: null });
      } else {
        throw new Error(result.error || 'Failed to add child');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Rest of your JSX stays EXACTLY the same...
  return (
    <div className="add-child-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon"></div>
            <span className="brand-name">MindBloom</span>
          </div>
          <button
            className="dashboard-link"
            onClick={() => (window.location.href = "/parent-dashboard")}
          >
            Parent Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <div className="welcome-section">
            <span className="status-badge">● ACTIVE SCREENING</span>
            <h1 className="page-title">Manage Your Children</h1>
            <p className="page-subtitle">
              Add and monitor your children's learning progress and development
              milestones.
            </p>
          </div>

          {/* Add Child Button */}
          <button className="add-child-btn" onClick={() => setIsModalOpen(true)}>
            <span className="btn-icon">+</span>
            <span className="btn-text">Add Child</span>
          </button>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            <div className="modal-header">
              <h2 className="modal-title">Add New Child</h2>
              <p className="modal-subtitle">
                Enter your child's information to begin their learning journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="child-form">
              {/* First Name */}
              <div className="form-group">
                <label className="form-label">Child's First Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Age */}
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter age (e.g., 5)"
                  min="3"
                  max="12"
                  value={formData.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Gender */}
              <div className="form-group">
                <label className="form-label">Gender</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-label">Male</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      disabled={isLoading}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-label">Female</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      checked={formData.gender === "other"}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      disabled={isLoading}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-label">Other</span>
                  </label>
                </div>
              </div>

              {/* English Native Language */}
              <div className="form-group">
                <label className="form-label">
                  Is English their native language?
                </label>
                <div className="toggle-group">
                  <button
                    type="button"
                    className={`toggle-btn ${
                      formData.isEnglishNative === true ? "active" : ""
                    }`}
                    onClick={() => handleChange("isEnglishNative", true)}
                    disabled={isLoading}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${
                      formData.isEnglishNative === false ? "active" : ""
                    }`}
                    onClick={() => handleChange("isEnglishNative", false)}
                    disabled={isLoading}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Child'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
