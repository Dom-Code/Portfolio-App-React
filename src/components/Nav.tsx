import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Nav.css';
import { AppProps } from '../App';

const NavComponent = ({ accountStatus, profileId }: AppProps) => {
  return (
    <>
      <nav id='nav-box'>
        <div id='nav-title-box'>
          <NavLink className='link' id='nav-title' to='/'>
            Portfolio
          </NavLink>
        </div>
        <div id='nav-links-box'>
          <ul id='nav-list'>
            <li>
              <NavLink
                className='link'
                to='/'
                style={({ isActive }) => {
                  return isActive ? { color: '#C56D86' } : {};
                }}
              >
                Home
              </NavLink>
            </li>

            {accountStatus ? (
              <>
                <li>
                  <NavLink
                    className='link'
                    to={`/public/${profileId}`}
                    style={({ isActive }) => {
                      return isActive ? { color: '#C56D86' } : {};
                    }}
                  >
                    Public
                  </NavLink>
                </li>{' '}
                <li>
                  <NavLink
                    className='link'
                    to='/projects'
                    style={({ isActive }) => {
                      return isActive ? { color: '#C56D86' } : {};
                    }}
                  >
                    Projects
                  </NavLink>
                </li>
              </>
            ) : (
              ''
            )}
            <li>
              {accountStatus ? (
                <NavLink
                  className='link'
                  to='/account'
                  style={({ isActive }) => {
                    return isActive ? { color: '#C56D86' } : {};
                  }}
                >
                  Account
                </NavLink>
              ) : (
                <NavLink
                  className='link'
                  to='/account/login'
                  style={({ isActive }) => {
                    return isActive ? { color: '#C56D86' } : {};
                  }}
                >
                  Login/Register
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </nav>
      {/* <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <div className=''>
          <ul className='list-group'>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/home'>
                Home
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/public'>
                Public
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/account'>
                Account
              </NavLink>
            </li>
          </ul>
        </div>
      </nav> */}
      <Outlet />
    </>
  );
};

export default NavComponent;
