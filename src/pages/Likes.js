import React, { useEffect, useMemo, useState } from 'react';
import './Home.css';
import { Card, Row, Col, Tabs } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import useNeedLogin from '../hooks/useNeedLogin';
import { ApplyStatuses } from '../constants';
import Loading from '../components/Loading';

export default function () {
  useNeedLogin();
  const history = useHistory();
  const [list, setList] = useState([]);
  const [tab, setTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/user/likes')
      .then(res => {
        // console.log(res);
        setList(res.data);
        setLoading(false);
      });
  }, []);

  const listD = useMemo(() => {
    return list.filter(v => tab === 'All' || v.mark === tab);
  }, [list, tab]);

  if (loading) {
    return <Loading/>;
  }

  return (
    <div className={'container'}>
      <h1>My Favorites</h1>

      <Tabs onChange={(v) => {
        setTab(v);
      }}>
        <Tabs.TabPane tab={'All'} key={'All'}/>
        {
          Object.keys(ApplyStatuses).map(k => (
            <Tabs.TabPane tab={ApplyStatuses[k]} key={k}/>
          ))
        }
      </Tabs>

      <Row gutter={20}>
        {
          listD.map(v => {
            return (
              <Col key={v._id}
                   xs={24} sm={12} md={8} lg={6} xxl={4} style={{ marginBottom: 20 }}>
                <Card
                  title={v.name}
                  extra={<Link to={`/job?id=${v._id}`}>Detail...</Link>}
                  onClick={() => {
                    history.push(`/job?id=${v._id}`);
                  }}
                  hoverable
                  cover={
                    <img alt="example" src={v.image ?? 'job.png'}/>
                  }
                >
                  <Card.Meta title={`${v.companyName}`} description={v.location}/>
                </Card>
              </Col>
            );
          })
        }
      </Row>

      {
        listD.length === 0 && (
          <div>Not result.</div>
        )
      }
    </div>
  );
}
