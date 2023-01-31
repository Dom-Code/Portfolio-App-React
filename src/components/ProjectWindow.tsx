import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from '../plugins/unpackage-path-plugin';
import { fetchPlugin } from '../plugins/fetch-plugin';
import CodeEditor from './code-editor';
// import prettierFormat from '../plugins/prettier';
import { ProjectWindowProps } from './Projects';
import axios from 'axios';
import './ProjectWindow.css';

const ProjectWindow = ({ currentProject, profileId }: ProjectWindowProps) => {
  const [input, setInput] = useState<string | undefined>(currentProject.code);
  const [projectName, setProjectName] = useState<string>(currentProject.name);
  const [publicProject, setPublicProject] = useState<boolean>(
    currentProject.public
  );

  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [publicLink, setPublicLink] = useState('');

  // const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const initialVal = `
  import React, {useState} from 'react';
  import ReactDOM from 'react-dom/client';
  import 'bootstrap/dist/css/bootstrap.min.css';
  
  const Nav = ({changeWindow}) => {
    const onClick = (e) => {
      e.preventDefault();
      changeWindow(e.target.id)
    }
    return (
      <>
      <nav class="navbar sticky-top navbar-expand-lg navbar-light bg-light col-md-6" style={{minWidth:"100vw"}}>
      <div class="w-100 d-flex flex-row justify-content-center align-items-center">
        <a id='home' class="navbar-brand p-3" href="#" onClick={onClick}>React App</a>
      <div style={{textAlign:"right"}} class="container justify-content-end">
        <a id='projects' class="navbar-brand" href="#"onClick={onClick}>Projects</a>
        <a id='aboutme' class="navbar-brand" href="#"  onClick={onClick}>About Me</a>
      </div>
      </div>
    </nav>
      </>
    )
  }

  const Projects = () => {
    return (
      <div class="container">
        <div class="text-center pt-2">
          <h1>Projects</h1>
          <h3>Coming soon...</h3>
        </div>
    </div>
    )
  }

  const AboutMe = () => {
    return (
      <div class="container">
        <div class="text-center pt-2">
          <h1>About Me</h1>
          <h3>I create react applications!</h3>
        </div>
    </div>
    )
  }

  const Home = () => {
    return (
      <div class="container">
        <div class="text-center pt-2">
          <h1>My Home Page</h1>
          <h3></h3>
        </div>
    </div>
    )
  }


  const App = () => {
    const [window, changeWindow] = useState('home')

    const setWindow = (w = window) => {
      switch(window) {
        case 'home':
          return <Home/>;
        case 'projects':
          return <Projects/>;
        case 'aboutme':
          return <AboutMe/>
        default:
      }
    }
    return (
      <>
        <Nav changeWindow={changeWindow}/>
        {setWindow()}
      </>
    );
  };
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(<App />);`;

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  const format = async () => {
    if (!ref.current) {
      return;
    }
    iframe.current.srcDoc = html;

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };

  const save = () => {
    axios({
      method: 'put',
      url: 'http://localhost:5000/user/saveProject',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('collabyToken')}`,
      },
      data: {
        code: input,
        projectId: currentProject._id,
        projectName: projectName,
        projectPublic: publicProject,
      },
    })
      .then((response) => {
        console.log(response.data.message);
        handleShow();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteProject = () => {
    axios({
      method: 'delete',
      url: 'http://localhost:5000/user/deleteProject',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('collabyToken')}`,
      },
      data: {
        projectId: currentProject._id,
      },
    })
      .then((response) => {
        console.log(response.data.message);
        handleCloseDelete();
        refresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const refresh = () => {
    navigate(0);
  };

  const html = `
    <html>
      <body>
        <div id='root'></div>
        <script>
          window.addEventListener('message', (event) => {
            try{
              eval(event.data)
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
              console.err(err)
            }
          }, false);
        </script>
      </body> 
    </html>
  `;

  useEffect(() => {
    if (!projectName) {
      navigate('/projects');
    } else {
      startService();
      const modifiedProjectName = projectName.replace(/\s/g, '').toLowerCase();
      setPublicLink(`/public/${profileId}/${modifiedProjectName}`);
    }
  }, [profileId, projectName, navigate]);

  return (
    <div id='window'>
      <Modal
        show={show}
        onHide={refresh}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className='text-center'>Project was saved!</Modal.Body>
        <Modal.Footer />
      </Modal>
      <Modal
        show={showDelete}
        onHide={handleCloseDelete}
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className='text-center'>
          Are you sure you want to delete this project?
          <div id='modal-buttons'>
            <Button variant='outline-primary' onClick={handleCloseDelete}>
              Cancel
            </Button>
            <Button variant='outline-primary' onClick={deleteProject}>
              Delete Project
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>

      <div>
        <h1>{currentProject.name}</h1>

        <Form id='project-info'>
          <Form.Group as={Row} className='mb-3' controlId='editForm'>
            <Form.Label column sm={2}>
              Project Name
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                className={''}
                type='text'
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                }}
              />
            </Col>
          </Form.Group>
          <fieldset>
            <Form.Group id='public-switch-container' as={Row} className='mb-3'>
              {/* <Form.Label as='legend' column sm={2}>
                Public Project
              </Form.Label> */}
              <Col sm={10}>
                <Form.Check
                  style={{ paddingTop: '7px', width: '80%' }}
                  type='switch'
                  id='public-switch'
                  checked={publicProject ? true : false}
                  label={
                    publicProject
                      ? 'Project will be public'
                      : 'Project will be private'
                  }
                  onChange={(e) => {
                    setPublicProject(e.target.checked);
                  }}
                />
              </Col>
            </Form.Group>
          </fieldset>

          <div id='project-buttons'>
            <Button variant='outline-primary' id='save' onClick={save}>
              Save Project
            </Button>
            <Button variant='outline-primary' onClick={handleShowDelete}>
              Delete Project
            </Button>
            <Button variant='outline-primary' href={publicLink}>
              Public View
            </Button>
          </div>
        </Form>

        <CodeEditor
          initialValue={currentProject.code}
          onChange={(value) => setInput(value)}
          save={format}
        />
      </div>
      <div id='results'>
        <iframe
          id='iframe'
          title='preview'
          ref={iframe}
          sandbox='allow-scripts'
          srcDoc={html}
        ></iframe>
      </div>
    </div>
  );
};

export default ProjectWindow;
