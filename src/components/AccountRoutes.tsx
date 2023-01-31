import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Account from './Account';
import './AccountRoutes.css';
import { AppProps } from '../App';

export interface FormProps {
  formData: {
    first: string;
    last: string;
    email: string;
    password: string;
  };
}

export interface CompleteFormState {
  first: string;
  last: string;
  email: string;
  password: string;
}

export interface FormDataProps extends FormProps {
  setFormData: React.Dispatch<React.SetStateAction<CompleteFormState>>;
}

const AccountRoutes = ({
  accountStatus,
  setAccountStatus,
  profileId,
}: AppProps) => {
  const [formData, setFormData] = useState({
    first: '',
    last: '',
    email: '',
    password: '',
  });

  return (
    <>
      <div id='account-box'>
        <div id='account-items'>
          <Routes>
            <Route
              index
              element={
                <Account
                  accountStatus={accountStatus}
                  setAccountStatus={setAccountStatus}
                  profileId={profileId}
                />
              }
            />
            <Route
              path='/register'
              element={
                <Register formData={formData} setFormData={setFormData} />
              }
            />
            <Route
              path='/login'
              element={
                <Login
                  formData={formData}
                  setFormData={setFormData}
                  setAccountStatus={setAccountStatus}
                />
              }
            />
          </Routes>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AccountRoutes;
