import React from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';

export default function Login () {
  const location = useLocation()

  const handleSubmit = (values) => {
    axios.post('/api/auth/login', {
      email: values.email,
      password: values.password
    })
      .then(res => {
        if (location.search) {
          // console.log(decodeURIComponent(location.search.replace('?back=', '')))
          window.location.href = decodeURIComponent(location.search.replace('?back=', ''));
        } else {
          window.location.href = '/';
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          message.error('Login failed: user not exist or password incorrect.');
        } else {
          message.error('Login failed');
        }
      });
  };

  return (
    <Form
      onFinish={handleSubmit}
      className="login-form"
      layout={'vertical'}
    >
      <h1>Login</h1>
      <Form.Item
        label="Email"
        name={'email'}
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'The input is not valid E-mail!' }
        ]}
      >
        <Input
          prefix={<MailOutlined/>}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        label="Password"
        name={'password'}
        rules={[
          { required: true, message: 'Please input your Password!' }
        ]}
      >
        <Input
          prefix={<LockOutlined/>}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <Link to={'/signup'}>sign up now!</Link>
      </Form.Item>
    </Form>
  );
}

