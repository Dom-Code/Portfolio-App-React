import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppProps } from '../App';

const Account = ({ accountStatus, setAccountStatus }: AppProps) => {
  const navigate = useNavigate();

  const logout = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    sessionStorage.removeItem('collabyToken');
    sessionStorage.removeItem('collabyRefreshToken');
    setAccountStatus(false);
    console.log('logged out');
    navigate('/home');
  };
  return (
    <>
      <a onClick={(e) => logout(e)} href='/'>
        Logout
      </a>
      {/* <Link to='/account/login'>Logout</Link> */}
      {/* <Outlet /> */}
    </>
  );
};

export default Account;
