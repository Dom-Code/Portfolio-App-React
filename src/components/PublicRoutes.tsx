import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AllUserProjects from './AllUserProjects';
import SelectedUserProject from './SelectedUserProject';
import { publicProps } from '../App';
import PublicHome from './PublicHome';

const PublicRoutes = ({ profileId }: publicProps) => {
  return (
    <>
      <Routes>
        <Route path='/' element={<PublicHome profileId={profileId} />}></Route>
        <Route path='/:id' element={<AllUserProjects />}>
          <Route path='/:id/:id' element={<SelectedUserProject />}></Route>
        </Route>
      </Routes>
    </>
  );
};

export default PublicRoutes;
