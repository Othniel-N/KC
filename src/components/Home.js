import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Home.css"; // Import CSS for styling

export default function Home() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalInventoryCost, setTotalInventoryCost] = useState(0);
  const [weeklyExpenses, setWeeklyExpenses] = useState(0);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [topExpenses, setTopExpenses] = useState([]);
  const [topMaterials, setTopMaterials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch day expenses
        const expensesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/day-expenses`);
        const expenses = expensesResponse.data;

        // Calculate total expenses
        const total = expenses.reduce((acc, expense) => acc + expense.totalExpenses, 0);
        setTotalExpenses(total);

        // Calculate weekly expenses
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const weeklyTotal = expenses
          .filter((expense) => new Date(expense.date) >= weekStart)
          .reduce((acc, expense) => acc + expense.totalExpenses, 0);
        setWeeklyExpenses(weeklyTotal);

        // Fetch total material cost in inventory
        const inventoryResponse = await axios.get(`${process.env.REACT_APP_API_URL}/materials`);
        const inventory = inventoryResponse.data;

        const inventoryCost = inventory.reduce(
          (acc, material) => acc + material.quantity * material.price,
          0
        );
        setTotalInventoryCost(inventoryCost);

        // Get recent expenses (sorted by date descending)
        const recent = expenses
          .map((expense) => ({
            title: expense.siteName,
            date: new Date(expense.date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            total: expense.totalExpenses,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date
          .slice(0, 5); // Limit to the last 5 entries
        setRecentExpenses(recent);

        // Aggregate all expense categories for top expenses
        const expenseSources = expenses.reduce((acc, expense) => {
          acc["Labour"] = (acc["Labour"] || 0) + expense.labourExpenses;
          acc["Miscellaneous"] = (acc["Miscellaneous"] || 0) + expense.miscExpenses;
          acc["Transportation"] =
            (acc["Transportation"] || 0) + expense.transportationCost;
          acc["Equipment Rental"] =
            (acc["Equipment Rental"] || 0) + expense.equipmentRentalCost;
          acc["Government Fees"] =
            (acc["Government Fees"] || 0) + expense.governmentFees;
          acc["Technicians"] =
            (acc["Technicians"] || 0) + expense.techniciansFees;
          acc["Fuel"] = (acc["Fuel"] || 0) + expense.fuelCostForMachineries;
          acc["Tips"] = (acc["Tips"] || 0) + expense.tips;
          acc["Print/Phone Bills"] =
            (acc["Print/Phone Bills"] || 0) + expense.printBillAndPhoneBill;
          acc["Purchasing"] =
            (acc["Purchasing"] || 0) + expense.purchasingExpenses;
          acc["Other"] = (acc["Other"] || 0) + expense.otherExpenses;

          return acc;
        }, {});

        // Sort and get top 5 expense categories
        const sortedTopExpenses = Object.entries(expenseSources)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5); // Limit to the top 5
        setTopExpenses(sortedTopExpenses);

        // Aggregate materials usage
        const materialUsage = expenses.reduce((acc, expense) => {
          expense.materialsUsed.forEach((material) => {
            acc[material.materialType] =
              (acc[material.materialType] || 0) + material.quantityUsed;
          });
          return acc;
        }, {});

        // Sort and get top 3 most used materials
        const sortedTopMaterials = Object.entries(materialUsage)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3); // Limit to the top 3
        setTopMaterials(sortedTopMaterials);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home">
      <div className="summary-boxes">
        <div className="summary-box">
          <h3>Total Expenses</h3>
          <p>₹{totalExpenses.toLocaleString()}</p>
          <small>Until today</small>
        </div>
        <div className="summary-box">
          <h3>Total Inventory Cost</h3>
          <p>₹{totalInventoryCost.toLocaleString()}</p>
          <small>Materials in stock</small>
        </div>
        <div className="summary-box">
          <h3>Weekly Expenses</h3>
          <p>₹{weeklyExpenses.toLocaleString()}</p>
          <small>Last 7 days</small>
        </div>
      </div>

      <div className="bottom-section">
        {/* Recent Expenses on Left */}
        <div className="recent-expenses">
          <h3>Recent Expenses</h3>
          <ul className="expenses-timeline">
            {recentExpenses.map((expense, index) => (
              <li key={index} className="expense-item">
                <div className="expense-dot"></div>
                <div className="expense-details">
                  <h4 className="expense-title">{expense.title}</h4>
                  <p className="expense-date">{expense.date}</p>
                </div>
                <p className="expense-total">₹{expense.total.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Expenses on Right */}
        <div className="top-expenses">
          <h3>Top Expense Categories</h3>
          <ul className="top-expense-list">
            {topExpenses.map(([category, amount], index) => (
              <li key={index} className="top-expense-item">
                <div className="top-expense-name">{category}</div>
                <div className="top-expense-amount">₹{amount.toLocaleString()}</div>
              </li>
            ))}
          </ul>

          <h3>Top 3 Most Used Materials</h3>
          <ul className="top-expense-list">
            {topMaterials.map(([material, amount], index) => (
              <li key={index} className="top-expense-item">
                <div className="top-expense-name">{material}</div>
                <div className="top-expense-amount">{amount.toLocaleString()} units</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
