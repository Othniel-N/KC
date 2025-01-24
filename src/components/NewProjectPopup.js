import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

const NewProjectPopup = ({ show, onClose, refreshProjects }) => {
  const [name, setName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [type, setType] = useState("single storey");
  const [phases, setPhases] = useState([]);
  const [phaseName, setPhaseName] = useState("");
  const [description, setDescription] = useState("");
  const [timeDays, setTimeDays] = useState("");
  const [status, setStatus] = useState("pending");

  const handleAddPhase = () => {
    if (phaseName && description && timeDays) {
      setPhases([...phases, { phaseName, description, timeDays, status }]);
      setPhaseName("");
      setDescription("");
      setTimeDays("");
    }
  };

  const handleSubmit = async () => {
    try {
      const newProject = {
        name,
        siteName,
        startDate,
        type,
        phases
      };
      await axios.post("http://localhost:5000/api/projects/create", newProject);
      onClose();
      refreshProjects();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  if (!show) return null; // If not showing, don't render

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Create New Project</h2>
        <Form>
          <Form.Group controlId="formProjectName">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
            />
          </Form.Group>

          <Form.Group controlId="formSiteName">
            <Form.Label>Site Name</Form.Label>
            <Form.Control
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Enter site name"
            />
          </Form.Group>

          <Form.Group controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formType">
            <Form.Label>Project Type</Form.Label>
            <Form.Control
              as="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="single storey">Single Storey</option>
              <option value="multi storey">Multi Storey</option>
              <option value="renovation">Renovation</option>
            </Form.Control>
          </Form.Group>

          {type === "custom" && (
            <>
              <h5>Add Phases</h5>
              <Form.Group controlId="formPhaseName">
                <Form.Label>Phase Name</Form.Label>
                <Form.Control
                  type="text"
                  value={phaseName}
                  onChange={(e) => setPhaseName(e.target.value)}
                  placeholder="Enter phase name"
                />
              </Form.Group>

              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter phase description"
                />
              </Form.Group>

              <Form.Group controlId="formTimeDays">
                <Form.Label>Time (Days)</Form.Label>
                <Form.Control
                  type="number"
                  value={timeDays}
                  onChange={(e) => setTimeDays(e.target.value)}
                  placeholder="Enter time in days"
                />
              </Form.Group>

              <Button onClick={handleAddPhase} variant="primary">
                Add Phase
              </Button>
            </>
          )}
        </Form>

        <div className="popup-actions">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectPopup;
