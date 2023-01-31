import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dropdown,
  Button,
  Stack,
  Modal,
  Form,
  CloseButton,
} from 'react-bootstrap';
import axios from 'axios';
import { ProjectMenuProps } from './Projects';

const ProjectMenu = ({
  allProjects,
  setAllProjects,
  setCurrentProject,
}: ProjectMenuProps) => {
  const [projectName, setProjectname] = useState('');
  const [show, setShow] = useState(false);
  const [newProjectComplete, setNewProjectComplete] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const starter = `
  import React, {useState} from 'react';
  import ReactDOM from 'react-dom/client';
  import 'bootstrap/dist/css/bootstrap.min.css';
  

  const App = () => {

    return (
      <>
        <h3>New project </h3>
      </>
    );
  };
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(<App />);`;

  const filledDropDown = () => {
    return allProjects.map((proj: any, i) => {
      return (
        <Dropdown.Item
          as={Link}
          to={`/projects/${proj.name.toLowerCase().replace(/\s/g, '')}`}
          key={i}
          style={{ color: 'whitesmoke' }}
          onClick={() => {
            setCurrentProject(proj);
          }}
        >
          {proj.name}
        </Dropdown.Item>
      );
    });
  };

  const newProject = () => {
    axios({
      method: 'post',
      url: 'http://localhost:5000/user/newProject',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('collabyToken')}`,
      },
      data: {
        project_name: projectName,
        code: starter,
      },
    })
      .then((response) => {
        console.log(response);
        setNewProjectComplete(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const refresh = () => {
    navigate(0);
  };

  return (
    <div>
      <h3>Project Routes</h3>
      <Stack
        direction='horizontal'
        gap={2}
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Dropdown>
          <Dropdown.Toggle variant='outline-primary' id='dropdown-basic'>
            Projects
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ backgroundColor: '#1f2d3b' }}>
            {filledDropDown()}
          </Dropdown.Menu>
        </Dropdown>
        <Button variant='outline-primary' onClick={handleShow}>
          New Project
        </Button>
      </Stack>

      <div
        className='modal show'
        style={{
          display: 'block',
          position: 'initial',
        }}
      >
        <Modal centered show={show} onHide={handleClose} backdrop='static'>
          {newProjectComplete ? (
            <>
              <Modal.Header>
                <CloseButton onClick={refresh} />
                <Modal.Title></Modal.Title>
              </Modal.Header>
              <Modal.Body>Project Created!</Modal.Body>
              <Modal.Footer></Modal.Footer>
            </>
          ) : (
            <>
              <Modal.Header style={{ backgroundColor: '#1f2d3b' }}>
                <CloseButton onClick={handleClose} />

                <Modal.Title></Modal.Title>
              </Modal.Header>
              <Modal.Body
                style={{ backgroundColor: '#1f2d3b', color: 'whitesmoke' }}
              >
                <Form.Label htmlFor='inputPassword'>
                  What would you like to name your new project?
                </Form.Label>
                <Form.Control
                  defaultValue={projectName}
                  type='text'
                  id='project_name'
                  style={{ backgroundColor: '#1f2d3b', color: 'whitesmoke' }}
                  // aria-describedby='passwordHelpBlock'
                  onChange={(e) => {
                    setProjectname(e.target.value);
                  }}
                />
              </Modal.Body>
              <Modal.Footer style={{ backgroundColor: '#1f2d3b' }}>
                <Button variant='secondary' onClick={handleClose}>
                  Close
                </Button>
                <Button variant='primary' onClick={newProject}>
                  Create New Project
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
        {/* <Modal></Modal> */}
      </div>
      {/* <Outlet /> */}
      {/* <ProjectWindow1 project={project} allProjects={allProjects} /> */}
    </div>
  );
};

export default ProjectMenu;
