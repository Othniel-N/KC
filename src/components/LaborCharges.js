import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/LaborCharges.css"

const LaborCharges = () => {
  const [formData, setFormData] = useState({
    siteName: "",
    date: "",
    mason: 0,
    masonHelper: 0,
    electrician: 0,
    electricianHelper: 0,
    plumber: 0,
    plumberHelper: 0,
    barbender: 0,
    barbenderHelper: 0,
    concreteLabour: 0,
    painter: 0,
    painterHelper: 0,
  });

  const [laborCharges, setLaborCharges] = useState([]);

  // Get API URL from .env
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch labor charges from the backend
  useEffect(() => {
    const fetchCharges = async () => {
      try {
        const response = await axios.get(`${API_URL}/labor-charges`);
        setLaborCharges(response.data);
      } catch (error) {
        console.error("Error fetching labor charges:", error);
      }
    };

    fetchCharges();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const charges = { ...formData };
      delete charges.date;
      delete charges.siteName;

      const totalCharges = Object.values(charges).reduce((acc, val) => acc + Number(val), 0);

      const response = await axios.post(`${API_URL}/labor-charges`, {
        siteName: formData.siteName,
        date: formData.date,
        charges,
        totalCharges,
      });

      setLaborCharges((prev) => [...prev, response.data]);
      alert("Labor charges added successfully!");

      setFormData({
        siteName: "",
        date: "",
        mason: 0,
        masonHelper: 0,
        electrician: 0,
        electricianHelper: 0,
        plumber: 0,
        plumberHelper: 0,
        barbender: 0,
        barbenderHelper: 0,
        concreteLabour: 0,
        painter: 0,
        painterHelper: 0,
      });
    } catch (error) {
      console.error("Error adding labor charges:", error);
      alert("Failed to add labor charges.");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Labor Charges</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <label>
            Site Name:
            <input
              type="text"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              required
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </label>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {Object.keys(formData).map(
            (key) =>
              key !== "date" &&
              key !== "siteName" && (
                <div key={key} style={{ display: "flex", flexDirection: "column" }}>
                  <label>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                    <input
                      type="number"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      style={{
                        padding: "0.5rem",
                        fontSize: "1rem",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </label>
                </div>
              )
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            marginTop: "1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Add Labor Charges
        </button>
      </form>

      <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>Saved Labor Charges</h3>

      <ul
        style={{
          listStyle: "none",
          paddingLeft: "0",
          textAlign: "center",
        }}
      >
        {laborCharges.map((charge) => (
          <li
            key={charge._id}
            style={{
              background: "#f8f9fa",
              padding: "0.8rem",
              marginBottom: "1rem",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <strong>Site:</strong> {charge.siteName} |{" "}
            <strong>Date:</strong> {new Date(charge.date).toLocaleDateString()} |{" "}
            <strong>Total Charges:</strong> ₹{charge.totalCharges.toLocaleString("en-IN")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LaborCharges;
