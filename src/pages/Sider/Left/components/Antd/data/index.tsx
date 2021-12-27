import { Button, Select } from 'antd';
import React from 'react';
const AntdComponents: Record<string, Record<string, any>> = {
  button: {
    _components: Button,
    _default: {
      children: 'button',
    },
    _data: {
      name: 'button',
      type: 'component',
      component: 'antd.button',
      alias: 'btn',
      props: {
        children: 'btn',
        style: {
          width: '200px',
          height: '38px',
        },
      },
    },
  },
};
export default AntdComponents;
