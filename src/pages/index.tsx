import React, { useEffect, useRef } from 'react';
import styles from './index.css';
import { formatMessage } from 'umi-plugin-locale';
import { Layout, message } from 'antd';
import { Provider } from 'react-redux';
import SHeader from './Header';
import SContent from './Content';
import SSiderLeft from './Sider/Left';
import SSiderRight from './Sider/Right';
import configureStore from '@/store/store';
import SortableTree, { map } from 'react-sortable-tree';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import SFooter from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import eventBus from '@/utils/eventBus';
import _ from 'lodash';

import {
  getReducerData,
  setCurrentItem,
  setStatus,
  setLayers,
  defaultStatus,
  setStyles,
} from '@/store/reducer/data';
import { getNodeKey, setCurrentItemById } from '@/utils';
import Moveable from 'moveable';
import useMoveable from '@/utils/useMoveable';
import { enhancedOptions, EnhancedOptions } from '@/components/EnhancedContainer/utils';
import { Frame } from 'scenejs';
import { containerStyles } from '@/data';
const { Header, Footer, Sider, Content } = Layout;
export default function() {
  const reduxLayers = useSelector(getReducerData)['layers'] || {};
  const reduxStatus = useSelector(getReducerData)['status'] || {};
  const reduxStyles = useSelector(getReducerData)['styles'] || {};
  const reduxCurrentItem = useSelector(getReducerData)['currentItem'] || {};
  const moveableRef = useRef<any>();
  const dispatch = useDispatch();
  const cancelCurItem = () => {
    // 取消点击
    dispatch(setCurrentItem({}));
    const newTree = map({
      treeData: reduxLayers,
      getNodeKey,
      callback: (n: any) => {
        n.node.isSelected = false;
        return n.node;
      },
      ignoreCollapsed: false,
    });
    dispatch(setLayers(newTree));
    dispatch(setStatus({ ...defaultStatus }));
    eventBus.emit('currentItem', {});
    console.log('取消currentItem, layers取消选中, status恢复默认');
    console.log('🚀 ', moveableRef.current);
  };
  useEffect(() => {
    eventBus.on('currentItem', currentItem => {
      if (moveableRef.current && moveableRef.current.innerMoveable) {
        moveableRef.current.destroy();
        moveableRef.current = null;
      }
      if (currentItem && Object.keys(currentItem || {}).length) {
        const _id = currentItem.node.id;
        moveableRef.current = useMoveable({
          ...currentItem,
          status: reduxStatus,
          style: reduxStyles[_id] || {},
          setStyle: (_styles: Record<string, any>) => {
            dispatch(
              setStyles({
                type: 'replace',
                value: {
                  ...reduxStyles,
                  [_id]: _styles,
                },
              }),
            );
            const _data = setCurrentItemById(_id, reduxLayers, _styles);
            dispatch(
              setCurrentItem({
                ...reduxCurrentItem,
                ..._data,
              }),
            );
          },
        });
        moveableRef.current.bounds = {
          left: 0,
          top: 0,
          right: containerStyles.width,
          bottom: containerStyles.height,
        };
      }
    });
  }, [reduxStatus]);
  useEffect(() => {
    if (moveableRef.current) {
      moveableRef.current.scalable = reduxStatus.scalable;
      moveableRef.current.resizable = reduxStatus.resizable;
      moveableRef.current.warpable = reduxStatus.warpable;
    }
  }, [reduxStatus]);
  return (
    <Layout className={styles.main}>
      <Header className={styles.header}>
        <SHeader />
      </Header>
      <Layout className={styles.content}>
        <SplitterLayout primaryIndex={1} secondaryInitialSize={400}>
          <SSiderLeft onClick={cancelCurItem} />
          {/* content right */}
          <SplitterLayout secondaryInitialSize={350}>
            <Layout className={styles.content_layout}>
              <Content className={styles.content}>
                <SplitterLayout primaryIndex={0} vertical secondaryInitialSize={400}>
                  <SContent onClick={cancelCurItem} />
                  <SFooter />
                </SplitterLayout>
              </Content>
            </Layout>
            <SSiderRight />
          </SplitterLayout>
        </SplitterLayout>
      </Layout>
    </Layout>
  );
}
