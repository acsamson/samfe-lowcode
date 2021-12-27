import dragmethods, { getDragAngle } from '@/utils/dragmethods';
import {
  BlockOutlined,
  CompressOutlined,
  DeleteOutlined,
  PlusOutlined,
  QuestionCircleFilled,
  RedoOutlined,
} from '@ant-design/icons';
import { map } from 'react-sortable-tree';
import { Popconfirm, Tooltip } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState, MouseEvent } from 'react';
import styles from './index.less';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentItem,
  getReducerData,
  setStatus,
  setStyles,
  setLayers,
} from '@/store/reducer/data';
import { getNodeKey, moveableDefaultProps, pathSearch, setCurrentItemById } from '@/utils';
import Moveable from 'react-moveable';
import _ from 'lodash';
import { Frame } from 'scenejs';
import { LayerItem } from '@/data/layers';
import { zIndexMax } from '@/data';
import { EnhancedOptions, enhancedOptions } from './utils';
import eventBus from '@/utils/eventBus';
export interface EnhancedContainerProps extends LayerItem {
  index: number;
  onChange?: (type: string, _val: any, target: null) => void;
  children?: any;
  containerRef: any;
  labelRef: any;
}

function EnhancedContainer(tooltips: any, WrappedComponent: any) {
  return function HOCCard(props: EnhancedContainerProps) {
    const options: EnhancedOptions = useMemo(() => {
      return enhancedOptions(props.type || '');
    }, [props.type]);
    // const containerRef = useRef<any>({});
    const targetRef = useRef<any>({});
    // const labelRef = useRef<any>({});
    const reduxLayers = useSelector(getReducerData)['layers'] || {};
    const reduxCurrentItem = useSelector(getReducerData)['currentItem'] || {};
    const reducxStyles = useSelector(getReducerData)['styles'] || {};
    const reduxStatus = useSelector(getReducerData)['status'] || {};
    const [position, setposition] = useState({ x: 0, y: 0 });
    const isSelected = _.get(reduxCurrentItem, 'node.id', '') === props.id;
    const dispatch = useDispatch();
    const [frame, setframe] = useState(
      new Frame({
        ...options.emptyStyles,
      }),
    );
    const onNodeClick = (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
      const _data = setCurrentItemById(props.id, reduxLayers, frame.get());
      const newTree = map({
        treeData: reduxLayers,
        getNodeKey,
        callback: (n: any) => {
          n.node.isSelected = n.node.id === props.id;
          return n.node;
        },
        ignoreCollapsed: false,
      });
      dispatch(setLayers(newTree));
      const _curItem = {
        node: props,
        // style: reducxStyles[props.id] || {},
        Ref: {
          containerRef: props.containerRef,
          targetRef,
          labelRef: props.labelRef,
        },
      };
      eventBus.emit('currentItem', _curItem);
      dispatch(
        setCurrentItem({
          ...reduxCurrentItem,
          ..._data,
        }),
      );
      dispatch(setStatus({ ...reduxStatus, scalable: true }));
    };
    useEffect(() => {
      const _style = reducxStyles[props.id] || {};
      if (targetRef.current && Object.keys(_style).length && _style.transform) {
        let _transform = '';
        Object.entries(_style.transform || {}).forEach(_arr => {
          const [_key, _val] = _arr;
          const _newVal = `${_key}(${_val}) `;
          _transform += _newVal;
        });
        targetRef.current.style.transform = _transform;
      }
    }, [reducxStyles]);
    return (
      <React.Fragment>
        <div
          className={`${styles[options.targetClassName]} content_container moveable__${props.id} ${
            options.targetClassName
          }`}
          id={`moveable__${props.id}`}
          ref={targetRef}
          style={reducxStyles[props.id] || options.emptyStyles}
          onClick={onNodeClick}
        >
          {props.children || props.title}
        </div>
      </React.Fragment>
    );
  };
}

export default EnhancedContainer;
