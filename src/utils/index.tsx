import React from 'react';
import { nanoid } from 'nanoid';
import { emptyElementStyles } from '../data';
import _ from 'lodash';
export const getNodeKey = ({ treeIndex }: any) => treeIndex;
export const moveableDefaultProps = {
  node: {
    id: '',
    title: '',
    type: 'component',
  },
  style: {},
  Ref: {
    containerRef: null,
    targetRef: null,
    labelRef: null,
  },
};
export const treeNewNode = (type = 'component') => {
  const _id = nanoid();
  let _node = {};
  switch (type) {
    case 'component':
      _node = {
        title: 'new component',
        type: 'component',
      };
      break;
    case 'group':
      _node = {
        title: 'new group',
        type: 'group',
        children: [],
      };
      break;
  }
  return {
    id: _id,
    node: {
      id: _id,
      ..._node,
    },
    style: emptyElementStyles,
  };
};
export function pathSearch(obj: Record<string | number, any>, value: any, key = '') {
  for (let _key in obj) {
    if (key === '' && obj[_key] === value) {
      return [_key];
    } else if (key === _key && obj[_key] === value) {
      return [_key];
    }
    const item = obj[_key];
    if (typeof item === 'object') {
      const temp: any = pathSearch(item, value, key);
      if (temp) return [_key, temp].flat();
    }
  }
}
export const setCurrentItemById = (_id = '', _layerData = {}, _styles = {}) => {
  const _path = pathSearch(_layerData, _id, 'id') || [];
  _path.pop();
  let _node = _.cloneDeep(_.get(_layerData, _path, {}));
  _node.isSelected = true;
  if (_node['children']) {
    delete _node['children'];
  }
  return {
    node: _node,
    // style: _styles,
  };
};
export const ReactJsonProps = {
  indentWidth: 1,
  collapseStringsAfterLength: 15,
};
