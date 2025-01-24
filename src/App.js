import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MaterialForms from "./components/MaterialForms";
import InventoryDisplay from "./components/InventoryDisplay";
import DayExpenseForm from "./components/DayExpenseForm";
import ExpenseDashboard from "./components/ExpenseDashboard";
import MainDashboard from "./components/MainDashboard";
import ProjectManager from "./components/ProjectManager";

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Routes */}
        <Routes>
          <Route path="/addmaterial" element={<MaterialForms />} />
          <Route path="/inventory" element={<InventoryDisplay />} />
          <Route path="/dayexpense" element={<DayExpenseForm />} />
          <Route path="/expensedashboard" element={<ExpenseDashboard />} />
          <Route path="/main" element={<MainDashboard />} />
          <Route path="/project" element={<ProjectManager />} />
          <Route
            path="/"
            element={<h1 style={{ textAlign: "center" }}>Welcome to the Inventory Management App!</h1>}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
