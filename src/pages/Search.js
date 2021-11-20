import React, { useEffect, useState } from 'react';
import './Home.css';
import { Divider, Input, Card, Row, Col, message } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';

export default function () {
  const location = useLocation();
  const history = useHistory();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const q = location.search.replace('?q=', '');

  useEffect(() => {
    if (!q) {
      return;
    }
    setLoading(true);
    axios.get('/api/jobs?q=' + q)
      .then(res => {
        // console.log(res);
        setList(res.data);
        setLoading(false);
      });
  }, [q]);

  return (
    <div className={'container'}>
      <Row>
        <Col>
          <Input.Search
            size="large"
            placeholder="Search for job..."
            enterButton
            style={{ maxWidth: 500 }}
            onSearch={(v) => {
              if (!v) {
                message.info('Please input a query!');
                return;
              }
              history.push('/search?q=' + encodeURIComponent(v));
            }}
          />
        </Col>
      </Row>
      {
        !!q && (
          <>
            <Row>
              <Col>
                <Divider/>
                <h2>Searching {q}:</h2>
              </Col>
            </Row>
            {
              loading ? <Loading/> : (
                list.length ? (
                  <Row gutter={20}>
                    {
                      list.map(v => {
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
                ) : <div>No result. Try another keyword or <Link to={'/add-job'}>create one</Link>!</div>
              )
            }
          </>
        )
      }
    </div>
  );
}
