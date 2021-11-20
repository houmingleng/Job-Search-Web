import { Spin } from 'antd';
import React from 'react';

export default function () {
  return <div className={'loading-container'}>
    <Spin size="large"/>
  </div>;
}