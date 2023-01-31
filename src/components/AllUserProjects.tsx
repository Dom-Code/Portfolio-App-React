import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import axios from 'axios';
import { GeneralObject } from '../App';
import NotFound from './NotFound';

const AllUserProjects = () => {
  const location = useLocation();
  const [projectNames, setProjectNames] = useState([]);
  const [err, setErr] = useState(false);

  const allProjects = () => {
    axios({
      method: 'get',
      url: 'http://localhost:5000/user/publicProjects',
      headers: {
        id: location.pathname.split('/')[2],
      },
    })
      .then((res) => {
        setProjectNames(res.data.projects);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          console.log('user not found');
          setErr(true);
        }
      });
  };

  const createURL = (name: string) => {
    const noSpaces = name.toLowerCase().replace(/\s/g, '');
    return `/public/${location.pathname.split('/')[2]}/${noSpaces}`;
  };

  const displayProjectLinks = () => {
    return projectNames.map((proj: GeneralObject, i) => {
      return (
        <Nav.Item key={i} as='li'>
          <Nav.Link href={createURL(proj.name)}>{proj.name}</Nav.Link>
        </Nav.Item>
      );
    });
  };

  useEffect(() => {
    allProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {err ? (
        <NotFound />
      ) : (
        <>
          {/* <h1>This is a All User Project</h1> */}
          <Navbar
            bg='dark'
            variant='dark'
            className='d-flex justify-content-center mb-3'
          >
            <Nav as='ul'>{displayProjectLinks()}</Nav>
          </Navbar>
        </>
      )}
      <Outlet />
    </>
  );
};

export default AllUserProjects;
