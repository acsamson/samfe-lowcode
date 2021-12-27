import { RedoOutlined } from '@ant-design/icons';
import { Button, Divider, Radio, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { getReducerData, setStatus } from '@/store/reducer/data';

function Header() {
  const currentItem = useSelector(getReducerData)['currentItem'] || {};
  const status = useSelector(getReducerData)['status'] || {};
  const [radioValue, setradioValue] = useState<string>('');
  const dispatch = useDispatch();
  useEffect(() => {
    let _value: string = '';
    Object.entries(status).forEach(_arr => {
      const [_key, _val] = _arr;
      if (_val) _value = _key;
    });
    setradioValue(_value);
    return () => {
      setradioValue('');
    };
  }, [status]);
  return (
    <div className={styles.main}>
      <h1 style={{ color: 'inherit' }}>samfe-lowcode</h1>
      <div className={styles.opt}>
        <Divider type="vertical" style={{ backgroundColor: '#fff', height: '32px' }} />
        <div className={styles.opt_group}>
          <Radio.Group
            onChange={e => {
              e.stopPropagation();
              e.preventDefault();
              setradioValue(e.target.value);
              let _status: Record<string, any> = {};
              Object.entries(status).forEach(_arr => {
                const [_key, _val] = _arr;
                _status[_key] = _key === e.target.value;
              });
              dispatch(setStatus(_status));
            }}
            value={radioValue}
            size="small"
            disabled={!radioValue.length}
          >
            <Radio.Button value="scalable" className={styles.btn}>
              <Tooltip title="scalable 内容缩放">可伸缩</Tooltip>
            </Radio.Button>
            <Radio.Button value="resizable" className={styles.btn}>
              <Tooltip title="resizable 内容保持不变">可调整大小</Tooltip>
            </Radio.Button>
            <Radio.Button value="warpable" className={styles.btn}>
              <Tooltip title="warpable 变形">可弯曲</Tooltip>
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}

export default Header;
