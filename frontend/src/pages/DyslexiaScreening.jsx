import { useState } from "react";

function DyslexiaScreening() {
  const [formData, setFormData] = useState({
    Age: "",
    Gender: "0",
    Nativelang: "0",
    Otherlang: "0",
    Clicks1: "",
    Hits1: "",
    Misses1: "",
    Score1: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Age: Number(formData.Age),
          Gender: Number(formData.Gender),
          Nativelang: Number(formData.Nativelang),
          Otherlang: Number(formData.Otherlang),
          Clicks1: Number(formData.Clicks1),
          Hits1: Number(formData.Hits1),
          Misses1: Number(formData.Misses1),
          Score1: Number(formData.Score1)
        })
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Dyslexia Risk Screening</h2>
      <p style={{ fontSize: "14px", color: "#555" }}>
        This tool estimates dyslexia risk for screening purposes only.
      </p>

      <form onSubmit={handleSubmit}>
        <input name="Age" placeholder="Age" onChange={handleChange} required />
        
        <select name="Gender" onChange={handleChange}>
          <option value="0">Male</option>
          <option value="1">Female</option>
        </select>

        <select name="Nativelang" onChange={handleChange}>
          <option value="0">Non-native language</option>
          <option value="1">Native language</option>
        </select>

        <select name="Otherlang" onChange={handleChange}>
          <option value="0">No other language</option>
          <option value="1">Speaks other language</option>
        </select>

        <input name="Clicks1" placeholder="Clicks" onChange={handleChange} required />
        <input name="Hits1" placeholder="Hits" onChange={handleChange} required />
        <input name="Misses1" placeholder="Misses" onChange={handleChange} required />
        <input name="Score1" placeholder="Score" onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Check Risk"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ddd" }}>
          <h3>Result</h3>
          <p><strong>Estimated Risk:</strong> {result.dyslexia_risk_percentage}%</p>
          <p><strong>Risk Level:</strong> {result.risk_level}</p>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

export default DyslexiaScreening;
