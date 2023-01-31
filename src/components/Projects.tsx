import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import ProjectMenu from './ProjectMenu';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProjectWindow from './ProjectWindow';

export interface GeneralObject {
  [key: string]: any;
}

export interface ProjectMenuProps {
  allProjects: Array<GeneralObject>;
  setAllProjects: Dispatch<SetStateAction<Array<GeneralObject>>>;
  setCurrentProject: Dispatch<SetStateAction<GeneralObject>>;
}

export interface ProjectWindowProps {
  currentProject: GeneralObject;
  setCurrentProject: Dispatch<SetStateAction<GeneralObject>>;
  profileId: String;
}

const Projects = () => {
  const [allProjects, setAllProjects] = useState<Array<GeneralObject>>([]);
  const [currentProject, setCurrentProject] = useState<GeneralObject>({});
  const [profileId, sertProfileId] = useState<string>('');

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
        sertProfileId(response.data.profile_id);
        console.log('Projects Loaded');
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
      <Routes>
        <Route
          path='/'
          element={
            <ProjectMenu
              allProjects={allProjects}
              setAllProjects={setAllProjects}
              setCurrentProject={setCurrentProject}
            />
          }
        />
        <Route
          path=':id'
          element={
            <ProjectWindow
              currentProject={currentProject}
              setCurrentProject={setCurrentProject}
              profileId={profileId}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default Projects;
