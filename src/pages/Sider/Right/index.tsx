import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReducerData, setCurrentItem, setLayers } from '@/store/reducer/data';
import { Tabs, Form, Input, InputNumber, Alert, Slider, Select, Divider, message } from 'antd';
import { styleProps } from '@/data/styleProps';
import _ from 'lodash';
import { pathSearch, ReactJsonProps } from '@/utils';
import Item from 'antd/lib/list/Item';
import { nanoid } from 'nanoid';
import ReactJson from 'react-json-view';
import { emptyElementStyles, emptyGroupStyles } from '@/data';

function Right() {
  const data = useSelector(getReducerData)['layers'] || {};
  const reduxCurrentItem = useSelector(getReducerData)['currentItem'] || {};
  const reduxStyles = useSelector(getReducerData)['styles'] || {};
  const [styleObject, setstyleObject] = useState({});
  const dispatch = useDispatch();
  const getFormElm = (_type = '', _props = {}) => {
    switch (_type) {
      case 'inputNumber':
        return <InputNumber {..._props} style={{ width: '200px' }} />;
      case 'slider':
        return <Slider min={0} max={50} {..._props} style={{ width: '200px' }} />;
      default:
        return <Input {..._props} />;
    }
  };
  function getStylesObject() {
    const _node = reduxCurrentItem.node || {};
    if (!_node || !Object.keys(_node).length) {
      return {};
    }
    const _id = _node.id || '';
    const _type = _node.type || 'component';
    let _style = reduxStyles[_id];
    if (!_style || !Object.keys(_style).length) {
      message.warn(`当前 ${_type} 没有设定样式, 选用默认样式`);
      _style = reduxStyles[_id] || (_type === 'component' ? emptyElementStyles : emptyGroupStyles);
    }
    setstyleObject(_style);
    return _style;
  }
  useEffect(() => {
    getStylesObject();
  }, [reduxCurrentItem, reduxStyles]);
  return (
    <Tabs type="card" defaultActiveKey={'props'} tabBarStyle={{ padding: 0 }}>
      <Tabs.TabPane key="props" tab="属性">
        {/* <Select
          defaultValue={'data'}
          placeholder="请选择展示类型"
          style={{ width: '100px', marginLeft: '15px' }}
          onChange={setshowType}
        >
          <Select.Option value="view" key={nanoid()}>
            视图
          </Select.Option>
          <Select.Option value="data" key={nanoid()}>
            数据
          </Select.Option>
        </Select> */}
        <Divider style={{ margin: '8px 0' }} />
        <ReactJson src={styleObject} {...ReactJsonProps} />
      </Tabs.TabPane>
    </Tabs>
  );
}

export default Right;
