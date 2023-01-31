import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FormDataProps } from './AccountRoutes';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const Register = ({ formData, setFormData }: FormDataProps) => {
  const [emailUnique, setEmailUnique] = useState(true);
  const submitForm = () => {
    try {
      return axios({
        method: 'post',
        url: 'http://localhost:5000/user/register',
        withCredentials: false,
        data: formData,
      })
        .then((data) => {
          console.log('Account created.');
        })
        .catch((err) => {
          if (err.response.status === 409) {
            console.log('Email already used');
            setEmailUnique(false);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const checkValidity = () => {
    return isValidfirst() && isValidlast() && isValidEmail() && isValidPw();
  };

  const isValidfirst = () => {
    if (
      formData.first.length >= 2 &&
      formData.first.trim().match(/^[A-Za-z]{2,}$/)
    ) {
      return true;
    }
  };

  const isInvalidfirst = () => {
    if (
      formData.first.length >= 2 &&
      !formData.first.trim().match(/^[A-Za-z]{2,}$/)
    ) {
      return true;
    }
  };

  const isValidlast = () => {
    if (
      formData.last.length >= 2 &&
      formData.last.trim().match(/^[A-Za-z]{2,}$/)
    ) {
      return true;
    }
  };

  const isInvalidlast = () => {
    if (
      formData.last.length >= 2 &&
      !formData.last.trim().match(/^[A-Za-z]{2,}$/)
    ) {
      return true;
    }
  };

  const isValidEmail = () => {
    if (
      formData.email.length >= 5 &&
      formData.email.trim().match(/^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
    ) {
      return true;
    }
  };

  const isInvalidEmail = () => {
    if (
      formData.email.length >= 5 &&
      !formData.email.trim().match(/^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
    ) {
      return true;
    }
  };
  const isValidPw = () => {
    if (
      formData.password.length >= 8 &&
      formData.password
        .trim()
        .match('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
    ) {
      return true;
    }
  };

  const isInvalidPw = () => {
    if (
      formData.password.length >= 8 &&
      !formData.password
        .trim()
        .match('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
    ) {
      return true;
    }
  };

  return (
    <div>
      <h2 id='title'>Register view</h2>
      <Form className='form'>
        <Form.Group className='mb-2' controlId='registerform.first'>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            onChange={(e) => {
              setFormData({ ...formData, first: e.target.value });
            }}
            value={formData.first}
            type='first'
            placeholder='Enter First Name'
            isValid={isValidfirst()}
            isInvalid={isInvalidfirst()}
          />
          <div className='err-msg'>
            {isInvalidfirst() ? <p>Invalid First Name</p> : ''}
          </div>
        </Form.Group>
        <Form.Group className='mb-2' controlId='registerform.last'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            onChange={(e) => {
              setFormData({ ...formData, last: e.target.value });
            }}
            value={formData.last}
            type='last'
            placeholder='Enter Last Name'
            isValid={isValidlast()}
            isInvalid={isInvalidlast()}
          />
          <div className='err-msg'>
            {isInvalidlast() ? <p>Invalid Last Name</p> : ''}
          </div>
        </Form.Group>
        <Form.Group className='mb-2' controlId='registerform.email'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
            value={formData.email}
            type='email'
            placeholder='Enter Email Address'
            isValid={isValidEmail() && emailUnique}
            isInvalid={isInvalidEmail() || !emailUnique}
          />
          <div className='err-msg'>
            {isInvalidEmail() ? <p>Invalid Email</p> : ''}
          </div>
        </Form.Group>
        <Form.Group className='mb-2' id='pw' controlId='registerform.pw'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
            type='password'
            placeholder='Enter Password'
            isValid={isValidPw()}
            isInvalid={isInvalidPw()}
          />

          <div className='err-msg'>
            {isInvalidPw() ? (
              <p>
                Password must have 8 characters
                <br />
                Must have at least 1 special character
                <br />
                Must have at least 1 number
              </p>
            ) : (
              ''
            )}
          </div>
        </Form.Group>
        <Button
          className='change-button'
          style={{ marginBottom: '15px' }}
          onClick={() => submitForm()}
          disabled={!checkValidity()}
        >
          Submit
        </Button>
        <p className='change-link'>Already have an account?</p>
        <NavLink to='/account/login' className='change-button'>
          Login
        </NavLink>
      </Form>
    </div>
  );
};

export default Register;
