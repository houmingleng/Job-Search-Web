import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Layout, Menu } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

const SubMenu = Menu.SubMenu;
const { Header } = Layout;

export default function Navbar () {
  const user = useSelector(state => state.user?.user);
  const name = useSelector(state => state.user?.user?.name ?? '');
  const [keys, setKeys] = useState([]);
  const location = useLocation();

  function logout () {
    axios.post('/api/auth/logout')
      .then(res => {
        window.location.href = '/';
      });
  }

  const refreshMenu = useCallback(() => {
    const path = location.pathname;
    if (path === '/') {
      setKeys(['/']);
    } else {
      try {
        setKeys(['/' + path.split('/')[1]]);
      } catch (e) {
        console.error(e);
      }
    }
  }, [location]);

  useEffect(() => {
    refreshMenu();
  }, [refreshMenu]);

  return (
    <Header>
      <div className="logo"/>
      <Menu theme="dark" mode="horizontal" selectedKeys={keys}
            style={{ lineHeight: '64px' }}>
        <Menu.Item key="/">
          <Link to={'/'}>Hire me!</Link>
        </Menu.Item>
        <Menu.Item key="/search">
          <Link to={'/search'}>Search</Link>
        </Menu.Item>
        {
          !!user ? (
            <>
              <Menu.Item key="/favorites">
                <Link to={'/favorites'}>Favorites</Link>
              </Menu.Item>
              <Menu.Item key="/add-job">
                <Link to={'/add-job'}>Add Job</Link>
              </Menu.Item>
              <SubMenu
                key={'submenu'}
                title={(
                  <span>
                      <span>Welcome, {name}&nbsp;</span>
                      <CaretDownOutlined/>
                    </span>
                )}
              >
                <Menu.Item key="/logout" onClick={logout}>
                  Logout
                </Menu.Item>
              </SubMenu>
            </>

          ) : (
            <>
              <Menu.Item key="/login">
                <Link to={'/login'}>Login</Link>
              </Menu.Item>
              <Menu.Item key="/signup">
                <Link to={'/signup'}>Signup</Link>
              </Menu.Item>
            </>
          )
        }
      </Menu>
    </Header>
  );
}
