import React, { ReactElement, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import DATA from '@/data/layers';
import styles from './index.less';
import dragmethods, { getDragAngle } from '@/utils/dragmethods';
import EnhancedContainer from '@/components/EnhancedContainer';
import { nanoid } from 'nanoid';
import { Button, Input, Tag, Tooltip } from 'antd';
import _ from 'lodash';
import { pathSearch } from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { getReducerData, setLayers } from '@/store/reducer/data';
import eventBus from '@/utils/eventBus';
import Layers from './conponents/Layers';
import Moveable from 'moveable';
import { containerStyles } from '@/data';
import { StatsGraph } from '@helpscout/stats';

interface Props {
  onClick: () => void;
}
function Content(props: Props) {
  const containerRef = useRef<any>();
  const labelRef = useRef<any>({});
  const reduxLayers = useSelector(getReducerData)['layers'] || {};
  const currentItem = useSelector(getReducerData)['currentItem'] || {};
  const dispatch = useDispatch();
  const [layersData, setlayersData] = useState(reduxLayers);
  const { handleDrop, handleDragOver } = useMemo(dragmethods, []);
  const [isMouseDown, setisMouseDown] = useState(false);
  const [currentEle, setcurrentEle] = useState<any>(null);
  const handleCopy = (val: any | never) => {
    let _data = _.cloneDeep(layersData);
    let _valCopy = _.cloneDeep(val);
    _valCopy.id = `${_valCopy.id}__${nanoid()}`;
    // 找到val.id的父节点
    const path: any = pathSearch(_data, val.id, 'id') || [];
    if (path.length) {
      const _path = [].concat(path);
      _path.pop();
      _path.pop();
      const _item = _.get(layersData, _path, layersData);
      const _val = Object.assign([], _item);
      _val.splice(+path[path.length - 2], 0, _valCopy as never);
      if (_path.length) {
        _.set(_data, _path, _val);
      } else {
        _data = _val;
      }
    }
    dispatch(setLayers(_data));
  };
  const handleDelete = (val: any = {}) => {
    let _data = _.cloneDeep(layersData);
    const path: any = pathSearch(_data, val.id, 'id') || [];
    path.pop();
    _.unset(_data, path);
    dispatch(setLayers(_data));
  };
  const handleMouseDown = (type: any = '', target: any = null) => {
    if (!target) {
      return;
    }
    const rect = target.getBoundingClientRect();
    setcurrentEle(target);
    target.dataset.centerX = rect.left + rect.width / 2;
    target.dataset.centerY = rect.top + rect.height / 2;
    target.dataset.angle = getDragAngle(target, target);
    setisMouseDown(true);
    target.style.background = '#399';
  };
  const onMouseMove = (e: any) => {
    if (isMouseDown) {
      const element = currentEle;
      var angle = getDragAngle(e, currentEle);
      element.style.transform = 'rotate(' + angle + 'rad)';
    }
  };
  const onMouseUp = (e: any) => {
    const element = currentEle;
    if (element) element.dataset.angle = getDragAngle(e, currentEle);
    setisMouseDown(false);
  };
  const onCardChange = (type = '', val = {}, target: null) => {
    switch (type) {
      case 'copy':
        handleCopy(val);
        break;
      case 'delete':
        handleDelete(val);
      case 'onMouseDown':
        handleMouseDown(val, target);
        break;
    }
  };
  const renderComponents = (_val: any, _index: number) => {
    const EContainer = EnhancedContainer(_index, Button);
    return (
      <EContainer
        key={nanoid()}
        index={_index}
        {..._val}
        containerRef={containerRef}
        labelRef={labelRef}
        onChange={(type: string, _valInner: any, target: null) =>
          onCardChange(type, _valInner || _val, target)
        }
      />
    );
  };
  // 这里不能定义为function, 否则不会重新渲染
  const renderGroup = (_val: any, _index: number) => {
    const EContainer = EnhancedContainer(_index, Button);
    const _children = _val.children || [];
    return (
      <EContainer
        {..._val}
        key={nanoid()}
        index={_index}
        containerRef={containerRef}
        labelRef={labelRef}
      >
        {_children.length ? (
          // <div className={styles.group} key={nanoid()}>
          <React.Fragment>
            {_children.map((val: any, index: number) => {
              switch (val.type) {
                case 'component':
                  return renderComponents(val, index);
                case 'group':
                  return renderGroup(val, index);
              }
            })}
          </React.Fragment>
        ) : null}
      </EContainer>
    );
  };
  const getContentDetail = useMemo(() => {
    return Object.entries(layersData || {}).map((arr: any) => {
      const [key, val] = arr;
      switch (val.type) {
        case 'component':
          return renderComponents(val, key);
        case 'group':
          return renderGroup(val, key);
      }
    });
  }, [layersData]);
  useEffect(() => {
    eventBus.on('undateLayers', ({ type = '', value = {} }) => {
      setlayersData(value);
    });
  }, []);
  return (
    <div className={styles.main} onClick={props.onClick}>
      <StatsGraph position="absolute" right={0} />
      <div className={`${styles.container_label}`}>
        <Tooltip title={JSON.stringify(containerRef?.current?.getBoundingClientRect())}>
          <Tag color={'pink'} style={{ cursor: 'pointer' }}>
            布局信息
          </Tag>
        </Tooltip>
      </div>
      <div
        ref={containerRef}
        id="content_container"
        className={`${styles.container}`}
        style={{ ...containerStyles, position: 'relative' }}
        // onDragOver={handleDragOver}
        // onDrop={handleDrop}
        // onMouseMove={onMouseMove}
        // onMouseUp={onMouseUp}
      >
        {getContentDetail}
        <div className={styles.label} id="content_container_label" ref={labelRef} />
      </div>
    </div>
  );
}

export default Content;
