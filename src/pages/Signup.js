import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

export default function Signup () {
  const [dirty, setDirty] = useState(false);
  const history = useHistory();

  function onSubmit (values) {
    axios.post('/api/auth/register', {
      name: values.name,
      email: values.email,
      password: values.password
    })
      .then(res => {
        message.success('Sign up success.');
        history.push('/login');
      })
      .catch(err => {
        if (err.response.status === 406) {
          message.error('Sign up failed: user already exist.');
        } else {
          message.error('Sign up failed');
        }
      });
  }

  function onFailed (err) {
    console.log('Failed:', err);
  }

  function validateToNextPassword ({ getFieldValue }) {
    return ({
      validator (rule, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject('Passwords do not match!');
      }
    });
  }

  function onConformBlur (e) {
    const value = e.target.value;
    setDirty(dirty || !!value);
  }

  return (
    <Form
      onFinish={onSubmit}
      onFinishFailed={onFailed}
      className="login-form"
      layout={'vertical'}
    >
      <h1>Sign up</h1>
      <Form.Item
        name={'name'}
        label="Name"
        rules={[
          { required: true, message: 'Please input your name!' }
        ]}
      >
        <Input
          prefix={<UserOutlined/>}
          placeholder="Name"
        />
      </Form.Item>
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
      <Form.Item
        label="Confirm password"
        name={'confirm'}
        rules={[
          { required: true, message: 'Please confirm your password!' },
          validateToNextPassword
        ]}
      >
        <Input
          prefix={<LockOutlined/>}
          type="password"
          placeholder="Confirm password"
          onBlur={onConformBlur}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Sign up!
        </Button>
      </Form.Item>
    </Form>
  );
}
