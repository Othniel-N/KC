import React, { useState, useEffect } from "react";
import "../css/MainDashboard.css"; // CSS file for styling
import Home from "../components/Home";
import DayExpenseForm from "../components/DayExpenseForm";
import ExpenseDashboard from "../components/ExpenseDashboard";
import MaterialForm from "../components/MaterialForms";
import InventoryDisplay from "./InventoryDisplay";
import ReportComponent from "./ReportComponent";
import ProjectManager from "./ProjectManager";

const MainDashboard = () => {
  const [activeComponent, setActiveComponent] = useState("home"); // Default component is 'Home'
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768); // Sidebar toggle state based on screen size

  // Adjust sidebar visibility based on screen width when resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true); // Open sidebar by default on large screens
      } else {
        setIsSidebarOpen(false); // Close sidebar by default on small screens
      }
    };

    // Call the function initially to set the correct sidebar state
    handleResize();

    // Add event listener to handle window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case "home":
        return <Home />;
      case "inventory":
        return <InventoryDisplay />;
      case "add-materials":
        return <MaterialForm />;
      case "day-expenses":
        return <DayExpenseForm />;
      case "expense-dashboard":
        return <ExpenseDashboard />;
      case "report":
        return <ReportComponent />;
      case "project":
        return <ProjectManager />;
      default:
        return <Home />;
    }
  };

  const handleMenuItemClick = (componentName) => {
    setActiveComponent(componentName);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false); // Close the sidebar on mobile after a menu item is clicked
    }
  };

  return (
    <div className="main-dashboard">
      {/* Sidebar Toggle Button */}
      {window.innerWidth <= 768 && (
        <button
          className="sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <nav className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <h2 className="menu-title">Menu</h2>
        <ul className="menu-list">
          <li
            className={`menu-item ${activeComponent === "home" ? "active" : ""}`}
            onClick={() => handleMenuItemClick("home")}
          >
            Home
          </li>
          <li
            className={`menu-item ${
              activeComponent === "inventory" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("inventory")}
          >
            Inventory
          </li>
          <li
            className={`menu-item ${
              activeComponent === "add-materials" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("add-materials")}
          >
            Add Materials
          </li>
          <li
            className={`menu-item ${
              activeComponent === "day-expenses" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("day-expenses")}
          >
            Day Expenses
          </li>
          <li
            className={`menu-item ${
              activeComponent === "expense-dashboard" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("expense-dashboard")}
          >
            Expense Dashboard
          </li>
          <li
            className={`menu-item ${
              activeComponent === "report" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("report")}
          >
            Report
          </li>
          <li
            className={`menu-item ${
              activeComponent === "project" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("project")}
          >
            Project
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="content-area">{renderComponent()}</div>
    </div>
  );
};

export default MainDashboard;
