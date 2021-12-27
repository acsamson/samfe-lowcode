import EnhancedComponent from '@/components/EnhancedComponent';
import { Button } from 'antd';
import { nanoid } from 'nanoid';
import React from 'react';
import AntdComponents from './data';
import styles from './index.css';

function Antd() {
  return (
    <div className={styles.main}>
      {Object.entries(AntdComponents).map(arr => {
        const [key, val] = arr;
        const AntdCom = EnhancedComponent(key, val._components);
        return <AntdCom key={nanoid()} {...(val._default || {})} />;
      })}
    </div>
  );
}

export default Antd;
