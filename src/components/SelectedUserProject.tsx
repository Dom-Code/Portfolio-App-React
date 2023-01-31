import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import NotFound from './NotFound';
import UserProject from './UserProject';

const SelectedUserProject = () => {
  const location = useLocation();
  const profileId = location.pathname.split('/')[2];
  const projectName = location.pathname.split('/')[3];
  const [project, setProject] = useState({});
  const [err, setErr] = useState(false);

  const getPublicProject = () => {
    axios({
      method: 'get',
      url: 'http://localhost:5000/user/getPublicProject',
      headers: {
        profile_id: profileId,
        project_name: projectName,
      },
    })
      .then((res) => {
        setProject(res.data.project);
      })
      .catch((err) => {
        setErr(true);
        console.log(err);
      });
  };

  useEffect(() => {
    getPublicProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{err ? <NotFound /> : <>{<UserProject proj={project} />}</>}</>;
};

export default SelectedUserProject;
