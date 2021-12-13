import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Input, Button, message, Upload, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useNeedLogin from '../hooks/useNeedLogin';
import RichTextEditor from 'react-rte';
import Loading from '../components/Loading';

export default function () {
  useNeedLogin();

  const history = useHistory();
  const location = useLocation();
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState(RichTextEditor.createEmptyValue());
  const [job, setJob] = useState(null);

  const id = useMemo(() => location.search.replace('?id=', ''), [location.search]);

  useEffect(() => {
    if (id) {
      axios.get(`/api/job/${id}`).then(res => {
        setJob(res.data);
        setDesc(RichTextEditor.createValueFromString(res.data.description, 'html'));
        setImg(res.data.image ? { base64: res.data.image } : null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id]);

  function onSubmit (values) {
    let isEmpty = !desc.getEditorState().getCurrentContent().hasText();
    if (isEmpty) {
      message.warning('Please input description!');
      return;
    }

    if (job) {
      axios.put('/api/job/' + job._id, {
        ...values,
        image: img?.base64 ?? null,
        description: desc.toString('html')
      })
        .then(res => {
          console.log(res);
          message.success('Job updated.');
          history.push('/job?id=' + job._id);
        })
        .catch(err => {
          message.error('update failed:' + err.message);
        });
    } else {
      axios.post('/api/job', {
        ...values,
        image: img?.base64 ?? null,
        description: desc.toString('html')
      })
        .then(res => {
          console.log(res);
          message.success('Job created.');
          history.push('/job?id=' + res.data._id);
        })
        .catch(err => {
          message.error('created failed:' + err.message);
        });
    }
  }

  function onFailed (err) {
    console.log('Failed:', err);
  }

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <Form
      onFinish={onSubmit}
      onFinishFailed={onFailed}
      layout={'vertical'}
    >
      <h1>{job ? 'Edit' : 'Add'} job</h1>
      <Form.Item
        name={'name'}
        label="Name"
        rules={[
          { required: true, message: 'Please input this field!' }
        ]}
        initialValue={job?.name ?? ''}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name={'companyName'}
        label="Company name"
        rules={[
          { required: true, message: 'Please input this field!' }
        ]}
        initialValue={job?.companyName ?? ''}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name={'location'}
        label="Location"
        rules={[
          { required: true, message: 'Please input this field!' }
        ]}
        initialValue={job?.location ?? ''}
      >
        <Input/>
      </Form.Item>
      <div>
        <div className={'require-mark'}>*</div>
        Description
      </div>
      <RichTextEditor
        value={desc}
        onChange={(v) => setDesc(v)}
        toolbarConfig={{
          // Optionally specify the groups to display (displayed in the order listed).
          display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
          INLINE_STYLE_BUTTONS: [
            { label: 'Bold', style: 'BOLD' },
            { label: 'Italic', style: 'ITALIC' },
            { label: 'Underline', style: 'UNDERLINE' },
            { label: 'Code', style: 'CODE' },
            { label: 'STRIKETHROUGH', style: 'STRIKETHROUGH' }
          ],
          BLOCK_TYPE_DROPDOWN: [
            { label: 'Normal', style: 'unstyled' },
            { label: 'Heading Large', style: 'header-one' },
            { label: 'Heading Medium', style: 'header-two' },
            { label: 'Heading Small', style: 'header-three' }
          ],
          BLOCK_TYPE_BUTTONS: [
            { label: 'UL', style: 'unordered-list-item' },
            { label: 'OL', style: 'ordered-list-item' },
            { label: 'blockquote', style: 'blockquote' },
          ]
        }}/>

      <br/>
      <Form.Item
        name={'employerEmail'}
        label="Employer email"
        rules={[
          { required: true, message: 'Please input this field!' },
          { type: 'email', message: 'The input is not valid E-mail!' }
        ]}
        initialValue={job?.employerEmail ?? ''}
      >
        <Input/>
      </Form.Item>
      <Form.Item
        name={'link'}
        label="Company's link (optional)"
        rules={[
          { type: 'url', message: 'Please input a valid url!' }
        ]}
        initialValue={job?.link ?? ''}
      >
        <Input/>
      </Form.Item>
      <div>
        <Upload
          name={'image'}
          multiple={false}
          onRemove={() => {
            setImg(null);
          }}
          beforeUpload={(file) => {
            // console.log(file);
            let reader = new FileReader();
            reader.onload = (e) => {
              file.base64 = e.target.result;
              setImg(file);
            };
            reader.readAsDataURL(file);
            return false;
          }}>
          <Button icon={<UploadOutlined/>}>Company's image (optional)</Button>
        </Upload>
      </div>
      <br/>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
