import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import { Layout, Spin } from 'antd';
import { fetchUser } from './redux/actions';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Search from './pages/Search';
import AddJob from './pages/AddJob';
import Job from './pages/Job';
import Likes from './pages/Likes';
import Loading from './components/Loading';

export default function App () {

  const dispatch = useDispatch();
  const loading = useSelector(state => state.user.loading);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) {
    return <Loading/>;
  }

  return (
    <Layout className="layout">
      <Navbar/>
      <Layout.Content>
        <div className={'main'}>
          <Route exact path="/" component={Home}/>
          <Route path="/search" component={Search}/>
          <Route path="/login" component={Login}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/add-job" component={AddJob}/>
          <Route path="/job" component={Job}/>
          <Route path="/favorites" component={Likes}/>
        </div>
      </Layout.Content>
      <Footer/>
    </Layout>
  );
}
