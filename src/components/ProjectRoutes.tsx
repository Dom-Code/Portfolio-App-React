import React, { useEffect, useState } from 'react';
import { Dropdown, Button, Stack, Modal, Form } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';
import { ProjectProps } from '../App';
import ProjectWindow1 from './ProjectWindow';

export interface GeneralObject {
  [key: string]: any;
}

const ProjectRoutes = ({
  currentProject,
  setCurrentProject,
  allProjects,
  setAllProjects,
}: ProjectProps) => {
  const [projectName, setProjectname] = useState('');
  const [show, setShow] = useState(false);
  const [allProjectsLoaded, setAllProjectsLoaded] = useState<boolean>(false);
  const [project, setProject] = useState<GeneralObject>({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
    if (allProjects) {
      return allProjects.map((proj: any, i) => {
        return (
          <Dropdown.Item
            as={Link}
            to={`/environments/${proj.name.replace(' ', '')}`}
            key={i}
            onClick={() => {
              setCurrentProject(proj);
              // setProjectCode(proj.code);
            }}
          >
            {proj.name}
          </Dropdown.Item>
        );
      });
    }
  };

  // const loadProject = (code: string) => {

  // axios({
  //   method: 'get',
  //   url: 'http://localhost:5000/user/loadProject',
  //   headers: {
  //     Authorization: `Bearer ${sessionStorage.getItem('collabyToken')}`,
  //     project_id: projectId,
  //   },
  // })
  //   .then((response) => {
  //     console.log(response.data.code);
  //     setProjectCode(response.data.code);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // };

  const getAllProjects = () => {
    axios({
      method: 'get',
      url: 'http://localhost:5000/user/allProjects',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('collabyToken')}`,
      },
    })
      .then((response) => {
        setAllProjects(response.data.projects);
        setAllProjectsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllProjects();
  }, []);

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
          <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
            Projects
          </Dropdown.Toggle>

          {allProjectsLoaded ? (
            <Dropdown.Menu>{filledDropDown()}</Dropdown.Menu>
          ) : null}
        </Dropdown>
        <Button variant='success' onClick={handleShow}>
          New Project
        </Button>
      </Stack>

      <div
        className='modal show'
        style={{ display: 'block', position: 'initial' }}
      >
        <Modal centered show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label htmlFor='inputPassword5'>
              What would you like to name your new project?
            </Form.Label>
            <Form.Control
              defaultValue={projectName}
              type='text'
              id='project_name'
              // aria-describedby='passwordHelpBlock'
              onChange={(e) => {
                setProjectname(e.target.value);
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            <Button variant='primary' onClick={newProject}>
              Create New Project
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Outlet />
      {/* <ProjectWindow1 project={project} allProjects={allProjects} /> */}
    </div>
  );
};

export default ProjectRoutes;
