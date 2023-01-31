import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { FormDataProps } from './AccountRoutes';
import { AppProps } from '../App';
import './Login.css';
import axios from 'axios';

interface AccountRoutesProps extends FormDataProps {
  setAccountStatus: AppProps['setAccountStatus'];
}

const Login = ({
  formData,
  setFormData,
  setAccountStatus,
}: AccountRoutesProps) => {
  const navigate = useNavigate();

  const submitForm = async () => {
    try {
      return await axios({
        method: 'post',
        url: 'http://localhost:5000/user/login',
        withCredentials: false,
        data: formData,
      })
        .then((response) => {
          console.log('User Logged in');
          sessionStorage.setItem('collabyToken', response.data.accessToken);
          sessionStorage.setItem(
            'collabyRefreshToken',
            response.data.refreshToken
          );
          setAccountStatus(true);
          navigate('/');
        })
        .catch((err) => {
          let status = err.response.status;
          if (status == 401) {
            console.log('Not able to authenticate');
          } else {
            console.log('Something went wrong');
          }
          throw err;
        });
    } catch (err) {
      console.log('Something went wrong with the network.');
    }
  };

  // const goHome = () => {
  //   navigate('/');
  // };
  return (
    <>
      {/* <button onClick={() => goHome()}>Send me to home</button> */}
      <div>
        <h2 id='title'>Log in</h2>
        <Form className='login-form'>
          <Form.Group className='mb-3' controlId='loginform.email'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type='email'
              placeholder='Enter Email Address'
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='loginform.pw'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type='password'
              placeholder='Enter Password'
            />
          </Form.Group>
          <div>
            <Button
              className='change-button'
              style={{ marginBottom: '15px' }}
              onClick={() => submitForm()}
            >
              Submit
            </Button>
          </div>
          <p className='change-link'>
            <NavLink to='/account/register' className='change-button'>
              Create Account
            </NavLink>
          </p>
        </Form>
      </div>
    </>
  );
};

export default Login;
