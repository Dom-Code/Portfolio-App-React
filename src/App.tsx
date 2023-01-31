import React, { useEffect, useState, Dispatch, SetStateAction } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PublicRoutes from './components/PublicRoutes';
import AccountRoutes from './components/AccountRoutes';
import NavComponent from './components/Nav';
import axios from 'axios';
import NotFound from './components/NotFound';
import Projects from './components/Projects';

export interface GeneralObject {
  [key: string]: any;
}
export interface AppProps {
  accountStatus: boolean;
  setAccountStatus: Dispatch<SetStateAction<boolean>>;
  profileId: string;
}

export interface ProjectProps {
  allProjects: Array<GeneralObject>;
  setAllProjects: Dispatch<SetStateAction<Array<GeneralObject>>>;
  currentProject: GeneralObject;
  setCurrentProject: Dispatch<SetStateAction<GeneralObject>>;
}

export interface NewProjectProps {
  allProjects: Array<GeneralObject>;
  // setAllProjects: Dispatch<SetStateAction<Array<GeneralObject>>>;
  setAllProjects: (active: GeneralObject[]) => void;
}

export interface CurrentProjectProps {
  code: string;
  createdAt: string;
  name: string;
  updatedAt: string;
  user_id: string;
  __v: number;
  _id: string;
}

export interface publicProps {
  profileId: String;
}

function App() {
  const [accountStatus, setAccountStatus] = useState(false);
  const [profileId, setProfileId] = useState('');

  const validate = () => {
    axios({
      method: 'get',
      url: 'http://localhost:5000/user/validate',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('collabyToken')}`,
      },
    })
      .then((response) => {
        console.log('User validated');
        setAccountStatus(true);
        setProfileId(response.data.profileId);

        return;
      })
      .catch((err) => {
        console.log('User not validated');
        setAccountStatus(false);
        return;
      });
  };

  useEffect(() => {
    validate();
  }, []);

  return (
    <div className='App'>
      <Routes>
        <Route
          element={
            <NavComponent
              accountStatus={accountStatus}
              setAccountStatus={setAccountStatus}
              profileId={profileId}
            />
          }
        >
          <Route path='/' element={<Home />} />
          <Route
            path='/public/*'
            element={<PublicRoutes profileId={profileId} />}
          ></Route>
          <Route path='/projects/*' element={<Projects />}></Route>
          <Route path='*' element={<NotFound />} />

          <Route
            path='/account/*'
            element={
              <AccountRoutes
                accountStatus={accountStatus}
                setAccountStatus={setAccountStatus}
                profileId={profileId}
              />
            }
          />
          {/* <Route path='*' element={<NotFound />} /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
