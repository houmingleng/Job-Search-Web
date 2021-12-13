import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { Popconfirm, message, Button, Row, Col, Spin, Image, Divider, Dropdown, Menu } from 'antd';
import { useSelector } from 'react-redux';
import { ApplyStatuses } from '../constants';
import Loading from '../components/Loading';

export default function () {
  const history = useHistory();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [likes, setLikes] = useState([]);
  const [marks, setMarks] = useState([]);

  const user = useSelector(state => state.user.user);

  const liked = job && likes.includes(job._id);
  const mark = job && marks.find(v => v.id === job._id);

  useEffect(() => {
    const id = location.search.replace('?id=', '');
    axios.get(`/api/job/${id}`).then(res => {
      setJob(res.data);
    });
  }, [location.search]);

  useEffect(() => {
    axios.get('/api/user/likes').then(res => {
      setLikes(res.data.map(v => v._id));
    });
    axios.get('/api/user/marks').then(res => {
      setMarks(res.data);
    });
  }, []);

  if (!job) {
    return <Loading/>;
  }

  return (
    <div className={'container'}>
      <Row>
        <Col>
          <h1>{job.name}</h1>
          <div>
            <Button type={'primary'} danger={liked} size={'large'} onClick={() => {
              if (!user) {
                const back = location.pathname + location.search;
                history.push('/login?back=' + encodeURIComponent(back));
              }
              const l = [...likes];
              if (liked) {
                l.splice(l.indexOf(job._id), 1);
              } else {
                l.push(job._id);
              }
              axios.put('/api/user/likes', { likes: l }).then(res => {
                message.success(`${liked ? 'Remove' : 'Add'} favorite success!`);
                setLikes(res.data);
              });
            }}>
              {liked ? 'Remove from favorites' : 'Add to favorites'}
            </Button>
            {
              !!user && job.createdBy === user._id && (
                <>
                  <Button type={'primary'} ghost size={'large'} style={{ marginLeft: 10 }}
                          onClick={() => history.push('/add-job?id=' + job._id)}>
                    Edit
                  </Button>
                  <Popconfirm
                    title={'Are you sure?'}
                    onConfirm={() => {
                      axios.delete('/api/job/' + job._id).then(() => {
                        message.success('Job deleted');
                        history.push('/');
                      });
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type={'primary'} danger ghost size={'large'} style={{ marginLeft: 10 }} onClick={() => {

                    }}>
                      Delete
                    </Button>
                  </Popconfirm>
                </>
              )
            }
          </div>
          {
            !!user && liked && (
              <>
                <br/>
                <div>
                  <Dropdown overlay={(
                    <Menu>
                      {
                        Object.keys(ApplyStatuses).map(k => {
                          return (
                            <Menu.Item key={k} onClick={() => {
                              const index = marks.findIndex(v => v.id === job._id);
                              if (index >= 0) {
                                marks[index].status = k;
                              } else {
                                marks.push({
                                  id: job._id,
                                  status: k
                                });
                              }
                              axios.put('/api/user/marks', { marks: marks }).then(res => {
                                message.success('Mark status success!');
                                setMarks(res.data);
                              });
                            }}>{ApplyStatuses[k]}</Menu.Item>
                          );
                        })
                      }
                    </Menu>
                  )}>
                    <Button type={'primary'} size={'large'}>Apply status
                      ({mark ? ApplyStatuses[mark.status] : 'please select...'})</Button>
                  </Dropdown>
                </div>
              </>
            )
          }
          <Divider/>
          <Image src={job.image ?? 'job.png'} style={{ maxWidth: `100%` }}/>
          <Divider/>
          <h2>Company name:</h2>
          <div>{job.companyName}</div>
          <Divider/>
          <h2>Location:</h2>
          <div>{job.location}</div>
          <Divider/>
          <h2>Description:</h2>
          <div dangerouslySetInnerHTML={{ __html: job.description }}/>
          <Divider/>
          <h2>Employer's Email:</h2>
          <div><a href={`mailto:${job.employerEmail}`}>{job.employerEmail}</a></div>
          <Divider/>
          {
            !!job.link && (
              <>
                <h2>Website Link:</h2>
                <div><a href={`${job.link}`}>{job.link}</a></div>
                <Divider/>
              </>
            )
          }
          <h2>Created At:</h2>
          <div>{new Date(job.createdAt).toLocaleString()}</div>
          <Divider/>
        </Col>
      </Row>
    </div>
  );
}
