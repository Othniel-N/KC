import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/DayExpense.css"; // Import the CSS file

const DayExpenseForm = () => {
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    siteName: "",
    date: new Date().toISOString().slice(0, 10),
    labourExpenses: "",
    miscExpenses: "",
    transportationCost: "",
    equipmentRentalCost: "",
    governmentFees: "",
    techniciansFees: "",
    fuelCostForMachineries: "",
    tips: "",
    printBillAndPhoneBill: "",
    purchasingExpenses: "",
    otherExpenses: "",
    detail: "",
    materialsUsed: [],
  });

  const [materialEntry, setMaterialEntry] = useState({
    materialType: "",
    subname: "",
    quantityUsed: "",
  });

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/materials");
        setMaterials(response.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    fetchMaterials();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaterialEntryChange = (e) => {
    const { name, value } = e.target;
    setMaterialEntry((prev) => ({ ...prev, [name]: value }));
  };

  const addMaterialEntry = () => {
    if (materialEntry.materialType && materialEntry.subname && materialEntry.quantityUsed) {
      setFormData((prev) => ({
        ...prev,
        materialsUsed: [...prev.materialsUsed, materialEntry],
      }));
      setMaterialEntry({ materialType: "", subname: "", quantityUsed: "" });
    } else {
      alert("Please fill in all material fields before adding.");
    }
  };

  const removeMaterialEntry = (index) => {
    setFormData((prev) => ({
      ...prev,
      materialsUsed: prev.materialsUsed.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.detail) {
      alert("Please fill in the 'Detail' field.");
      return;
    }

    const totalExpenses =
      Number(formData.labourExpenses || 0) +
      Number(formData.miscExpenses || 0) +
      Number(formData.transportationCost || 0) +
      Number(formData.equipmentRentalCost || 0) +
      Number(formData.governmentFees || 0) +
      Number(formData.techniciansFees || 0) +
      Number(formData.fuelCostForMachineries || 0) +
      Number(formData.tips || 0) +
      Number(formData.printBillAndPhoneBill || 0) +
      Number(formData.purchasingExpenses || 0) +
      Number(formData.otherExpenses || 0);

    try {
      await axios.post("http://localhost:5000/api/day-expenses", {
        ...formData,
        totalExpenses,
      });

      alert("Day-to-day expenses logged successfully!");
      setFormData({
        siteName: "",
        date: new Date().toISOString().slice(0, 10),
        labourExpenses: "",
        miscExpenses: "",
        transportationCost: "",
        equipmentRentalCost: "",
        governmentFees: "",
        techniciansFees: "",
        fuelCostForMachineries: "",
        tips: "",
        printBillAndPhoneBill: "",
        purchasingExpenses: "",
        otherExpenses: "",
        detail: "",
        materialsUsed: [],
      });
    } catch (error) {
      console.error("Error logging expenses:", error);
      alert("Failed to log expenses. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="day-expense-form">
      <h2 className="form-title">Day-to-Day Expenses</h2>

      <div className="form-group">
        <label>Site Name:</label>
        <input
          type="text"
          name="siteName"
          value={formData.siteName}
          onChange={handleInputChange}
          placeholder="Enter site name"
        />
      </div>

      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
        />
      </div>

      {/* Expense Fields */}
      <div className="form-section">
        <h3>Expenses</h3>
        {[
          { label: "Labour Expenses", name: "labourExpenses" },
          { label: "Miscellaneous Expenses", name: "miscExpenses" },
          { label: "Transportation Cost", name: "transportationCost" },
          { label: "Equipment Rental Cost", name: "equipmentRentalCost" },
          { label: "Government Fees", name: "governmentFees" },
          { label: "Technicians Fees", name: "techniciansFees" },
          { label: "Fuel Cost for Machineries", name: "fuelCostForMachineries" },
          { label: "Tips", name: "tips" },
          { label: "Print Bill and Phone Bill", name: "printBillAndPhoneBill" },
          { label: "Purchasing Expenses", name: "purchasingExpenses" },
          { label: "Other Expenses", name: "otherExpenses" },
        ].map(({ label, name }) => (
          <div className="form-group" key={name}>
            <label>{label}:</label>
            <input
              type="number"
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Detail (Required):</label>
        <textarea
          name="detail"
          value={formData.detail}
          onChange={handleInputChange}
          placeholder="Enter detail"
          required
        />
      </div>

      {/* Materials Used Section */}
      <div className="form-section">
        <h3>Materials Used</h3>
        <fieldset className="material-entry">
          <div className="form-group">
            <label>Material Type:</label>
            <select
              name="materialType"
              value={materialEntry.materialType}
              onChange={handleMaterialEntryChange}
            >
              <option value="" disabled>
                Select Material Type
              </option>
              {[...new Set(materials.map((material) => material.name))].map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Subname:</label>
            <select
              name="subname"
              value={materialEntry.subname}
              onChange={handleMaterialEntryChange}
            >
              <option value="" disabled>
                Select Subname
              </option>
              {materials
                .filter((m) => m.name === materialEntry.materialType)
                .map((sub) => (
                  <option key={sub.subname} value={sub.subname}>
                    {sub.subname}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity Used:</label>
            <input
              type="number"
              name="quantityUsed"
              value={materialEntry.quantityUsed}
              onChange={handleMaterialEntryChange}
              placeholder="Enter quantity"
            />
          </div>

          <button
            type="button"
            className="add-material-btn"
            onClick={addMaterialEntry}
          >
            Add Material
          </button>
        </fieldset>

        <ul className="materials-list">
          {formData.materialsUsed.map((material, index) => (
            <li key={index} className="materials-item">
              {material.materialType} ({material.subname}): {material.quantityUsed}
              <button
                type="button"
                className="remove-material-btn"
                onClick={() => removeMaterialEntry(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button type="submit" className="submit-btn">
        Submit
      </button>
    </form>
  );
};

export default DayExpenseForm;
