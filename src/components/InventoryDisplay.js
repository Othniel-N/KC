import React, { useEffect, useState } from "react";
import axios from "axios";

const InventoryDisplay = () => {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editValues, setEditValues] = useState({ quantity: "", price: "" });

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/materials/${id}`);
      setMaterials((prevMaterials) => prevMaterials.filter((material) => material._id !== id));
      alert("Material deleted successfully!");
    } catch (error) {
      console.error("Error deleting material:", error);
      alert("Failed to delete material.");
    }
  };

  const openEditModal = (material) => {
    setEditingMaterial(material);
    setEditValues({ quantity: material.quantity, price: material.price });
  };

  const closeEditModal = () => {
    setEditingMaterial(null);
    setEditValues({ quantity: "", price: "" });
  };

  const handleUpdate = async () => {
    if (!editValues.quantity || !editValues.price) {
      alert("Please fill in both quantity and price.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/materials/${editingMaterial._id}`, {
        quantity: Number(editValues.quantity),
        price: Number(editValues.price),
      });

      setMaterials((prevMaterials) =>
        prevMaterials.map((material) =>
          material._id === editingMaterial._id ? response.data : material
        )
      );
      alert("Material updated successfully!");
      closeEditModal();
    } catch (error) {
      console.error("Error updating material:", error);
      alert("Failed to update material.");
    }
  };

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.subname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>Inventory</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "100%",
            maxWidth: "400px",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Name", "Subname", "Category", "Quantity", "Units", "Price", "Total Price", "Supplier Name", "Last Purchased", "Actions"].map(
              (header) => (
                <th
                  key={header}
                  style={{
                    border: "1px solid #ddd",
                    padding: "0.75rem",
                    textAlign: "left",
                    backgroundColor: "#f4f4f4",
                  }}
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <tr key={material._id} style={{ borderBottom: "1px solid #ddd" }}>
                {["name", "subname", "category", "quantity", "units", "price", "totalPrice", "supplierName"].map(
                  (key) => (
                    <td key={key} style={{ border: "1px solid #ddd", padding: "0.75rem" }}>
                      {material[key]}
                    </td>
                  )
                )}
                <td style={{ border: "1px solid #ddd", padding: "0.75rem" }}>
                  {new Date(material.lastPurchasedOn).toLocaleDateString()}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "0.75rem" }}>
                  <button
                    onClick={() => openEditModal(material)}
                    style={{
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: "#3498db",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(material._id)}
                    style={{
                      margin: "0 0.5rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", padding: "1rem" }}>
                No materials found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingMaterial && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              minWidth: "300px",
            }}
          >
            <h3>Edit Material</h3>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Quantity:
              <input
                type="number"
                value={editValues.quantity}
                onChange={(e) => setEditValues({ ...editValues, quantity: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  margin: "0.5rem 0",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </label>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Price:
              <input
                type="number"
                value={editValues.price}
                onChange={(e) => setEditValues({ ...editValues, price: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  margin: "0.5rem 0",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </label>
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={handleUpdate}
                style={{
                  margin: "0 0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#3498db",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={closeEditModal}
                style={{
                  margin: "0 0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDisplay;
