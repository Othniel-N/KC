import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Modal, Form, ProgressBar, Row, Col, Table } from "react-bootstrap";
import '../css/Project.css'; // Import the custom CSS
import NewProjectPopup from "./NewProjectPopup";

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [showEditPhaseForm, setShowEditPhaseForm] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleShowPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`);
        console.log("Fetched Projects:", response.data);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const refreshProjects = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`);
    setProjects(response.data);
  };

  // Handle Phase Edit
  const handleEditPhase = (phase, projectId) => {
    setEditingPhase({ ...phase, projectId });
    setShowEditPhaseForm(true);
  };

  const handleStatusChange = async (newStatus, phaseId, projectId) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/projects/update-phase/${projectId}/${phaseId}`, {
        status: newStatus,
      });
      refreshProjects(); // Refresh the projects to reflect the changes
    } catch (error) {
      console.error("Error updating phase status:", error);
    }
  };

  // Handle Delete Project
  const handleDeleteProject = async (projectId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this project?");
    if (isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/projects/delete/${projectId}`);
        refreshProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="text-center flex-grow-1">Project Manager</h1>
      <Button onClick={handleShowPopup} className="btn-primary create-project-btn">Create New Project</Button>
      <NewProjectPopup show={showPopup} onClose={handleClosePopup} />
      {/* Removed Start Project button */}

      {/* Render projects in responsive grid */}
      <Row>
        {projects.length === 0 ? (
          <Col className="text-center">
            <p>No projects found. Please create a new project.</p>
          </Col>
        ) : (
          projects.map((project) => (
            <Col key={project._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="project-card">
                <Card.Body>
                  <Card.Title>Name: {project.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Site: {project.siteName}
                  </Card.Subtitle>
                  <Card.Text>
                    Start Date: {new Date(project.startDate).toLocaleDateString()}
                  </Card.Text>

                  {/* Render Progress */}
                  <div className="progress-container">
                    <h5>Progress: {project.progress}%</h5>
                    {/* <ProgressBar now={project.progress} label={`${project.progress}%`} /> */}
                  </div>

                  {/* Render Phases Table */}
                  <div className="phases-list mt-3">
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Phase</th>
                          <th>Description</th>
                          <th>Time (Days)</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.phases.map((phase, index) => (
                          <tr key={phase._id}>
                            <td>{index + 1}</td>
                            <td>{phase.description}</td>
                            <td>{phase.timeDays}</td>
                            <td>
                              <Form.Select
                                value={phase.status}
                                onChange={(e) => handleStatusChange(e.target.value, phase._id, project._id)}
                                size="sm"
                              >
                                <option value="pending">Pending</option>
                                <option value="paused">Paused</option>
                                <option value="completed">Completed</option>
                              </Form.Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  {/* Delete Button */}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteProject(project._id)}
                    className="delete-btn"
                  >
                    Delete Project
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};

export default ProjectManager;
