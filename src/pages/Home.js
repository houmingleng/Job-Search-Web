import React from 'react';
import './Home.css';
import { Input } from 'antd';
import { useHistory } from 'react-router-dom';

export default function Home () {
  const history = useHistory();

  return (
    <div className={'container'} style={{ textAlign: 'center' }}>
      <div className={'row'}>
        <div className={'col-xs-12'}>
          <h1 className={'title'}>Welcome to Hire me!</h1>
          <div className={'search'}>
            <div className={'searchbox'}>
              <Input.Search size="large" placeholder="Search for job..." enterButton onSearch={(v) => {
                history.push('/search?q=' + encodeURIComponent(v));
              }}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
