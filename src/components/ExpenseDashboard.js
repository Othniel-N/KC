import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/ExpenseDashboard.css"; // Import the CSS file

const ExpenseDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState({});
  const [selectedExpense, setSelectedExpense] = useState(null); // For modal popup

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/day-expenses`);
        setExpenses(response.data);

        // Group expenses by date
        const grouped = response.data.reduce((acc, expense) => {
          const date = new Date(expense.date).toISOString().split("T")[0]; // Format date
          if (!acc[date]) acc[date] = [];
          acc[date].push(expense);
          return acc;
        }, {});
        setGroupedExpenses(grouped);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  const handleBoxClick = (expense) => {
    setSelectedExpense(expense); // Set the selected expense to show in the modal
  };

  const closeModal = () => {
    setSelectedExpense(null); // Close the modal
  };

  return (
    <div className="expense-dashboard">
      <h2 className="dashboard-title">Expense Dashboard</h2>

      {Object.keys(groupedExpenses).length > 0 ? (
        Object.entries(groupedExpenses).map(([date, expenses]) => (
          <div key={date} className="expense-date-group">
            <h3 className="expense-date">{date}</h3>
            <div className="expense-grid">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="expense-box"
                  onClick={() => handleBoxClick(expense)}
                >
                  <h4>Site: {expense.siteName}</h4>
                  <p>Total: ₹{expense.totalExpenses}</p>
                  <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="no-expenses">No expenses found.</p>
      )}

      {/* Modal Popup */}
      {selectedExpense && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={closeModal}>
              ✖
            </button>
            <h3>Expense Details</h3>
            <p>
              <strong>Site Name:</strong> {selectedExpense.siteName}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedExpense.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Total Expenses:</strong> ₹{selectedExpense.totalExpenses}
            </p>
            <p>
              <strong>Detail:</strong> {selectedExpense.detail}
            </p>
            <h4>Breakdown</h4>
            <ul>
              <li>Labour Expenses: ₹{selectedExpense.labourExpenses}</li>
              <li>Misc Expenses: ₹{selectedExpense.miscExpenses}</li>
              <li>Transportation: ₹{selectedExpense.transportationCost}</li>
              <li>Equipment Rental: ₹{selectedExpense.equipmentRentalCost}</li>
              <li>Government Fees: ₹{selectedExpense.governmentFees}</li>
              <li>Technicians Fees: ₹{selectedExpense.techniciansFees}</li>
              <li>Fuel Cost: ₹{selectedExpense.fuelCostForMachineries}</li>
              <li>Tips: ₹{selectedExpense.tips}</li>
              <li>Print & Phone Bills: ₹{selectedExpense.printBillAndPhoneBill}</li>
              <li>Purchasing Expenses: ₹{selectedExpense.purchasingExpenses}</li>
              <li>Other Expenses: ₹{selectedExpense.otherExpenses}</li>
            </ul>
            {selectedExpense.materialsUsed.length > 0 && (
              <>
                <h4>Materials Used</h4>
                <ul>
                  {selectedExpense.materialsUsed.map((material, index) => (
                    <li key={index}>
                      {material.materialType} ({material.subname}):{" "}
                      {material.quantityUsed}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseDashboard;
