import React, { useState } from "react";
import axios from "axios";

const MaterialForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    subname: "",
    category: "",
    quantity: "",
    units: "",
    price: "",
    supplierName: "",
  });

  const names = ["Cement", "Sand", "Stone", "Steel", "Wood", "Electrical"];
  const subnames = {
    Cement: [
      "Normal Cement - Shankar",
      "Normal Cement - Ramco",
      "Normal Cement - Tamilnadu",
      "White Cement",
    ],
    Sand: ["P-Sand", "M-Sand", "A-Sand"],
    Stone: ["Granite", "Marble", "Limestone"],
    Steel: ["TMT Bars", "Mild Steel", "Structural Steel"],
    Wood: ["Teak", "Plywood", "Hardwood"],
    Electrical: ["Wires", "Switches", "Lights"],
  };
  const units = {
    Cement: ["Bags", "Tons"],
    Sand: ["Tons", "Cubic Feet"],
    Stone: ["Cubic Feet", "Tons"],
    Steel: ["Kilograms", "Tons"],
    Wood: ["Cubic Feet", "Pieces"],
    Electrical: ["Meters", "Pieces"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" ? { subname: "", units: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/materials", formData);
      alert("Material added successfully!");
      setFormData({
        name: "",
        subname: "",
        category: "",
        quantity: "",
        units: "",
        price: "",
        supplierName: "",
      });
    } catch (error) {
      console.error("Error adding material:", error);
      alert("Failed to add material. Please try again.");
    }
  };

  const formStyles = {
    maxWidth: "600px",
    margin: "20px auto",
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const labelStyles = {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#555",
  };

  const inputStyles = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    marginBottom: "15px",
  };

  const buttonStyles = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const responsiveStyles = {
    form: {
      ...formStyles,
      padding: window.innerWidth <= 768 ? "15px" : "20px",
    },
    input: {
      ...inputStyles,
      fontSize: window.innerWidth <= 480 ? "14px" : "16px",
    },
    button: {
      ...buttonStyles,
      fontSize: window.innerWidth <= 480 ? "14px" : "16px",
    },
  };

  return (
    <form style={responsiveStyles.form} onSubmit={handleSubmit}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Add New Material</h2>

      <div>
        <label style={labelStyles}>
          Name:
          <select
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={responsiveStyles.input}
            required
          >
            <option value="" disabled>
              Select Name
            </option>
            {names.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {formData.name && (
        <div>
          <label style={labelStyles}>
            Subname:
            <select
              name="subname"
              value={formData.subname}
              onChange={handleChange}
              style={responsiveStyles.input}
              required
            >
              <option value="" disabled>
                Select Subname
              </option>
              {subnames[formData.name]?.map((subname) => (
                <option key={subname} value={subname}>
                  {subname}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div>
        <label style={labelStyles}>
          Category:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={responsiveStyles.input}
            required
          />
        </label>
      </div>

      <div>
        <label style={labelStyles}>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            style={responsiveStyles.input}
            required
          />
        </label>
      </div>

      {formData.name && (
        <div>
          <label style={labelStyles}>
            Units:
            <select
              name="units"
              value={formData.units}
              onChange={handleChange}
              style={responsiveStyles.input}
              required
            >
              <option value="" disabled>
                Select Units
              </option>
              {units[formData.name]?.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div>
        <label style={labelStyles}>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            style={responsiveStyles.input}
            required
          />
        </label>
      </div>

      <div>
        <label style={labelStyles}>
          Supplier Name:
          <input
            type="text"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            style={responsiveStyles.input}
            required
          />
        </label>
      </div>

      <button type="submit" style={responsiveStyles.button}>
        Submit
      </button>
    </form>
  );
};

export default MaterialForm;
