import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReducerData, setLayers } from '@/store/reducer/data';
import styles from './index.less';
import { Tabs } from 'antd';
import ReactJson from 'react-json-view';
import { ReactJsonProps } from '@/utils';
function Data() {
  const layersData = useSelector(getReducerData)['layers'] || {};
  const stylesData = useSelector(getReducerData)['styles'] || {};
  return (
    <div className={styles.main}>
      <Tabs>
        <Tabs.TabPane tab="layers" key="layers">
          <div className={styles.content}>
            {/* <pre className={styles.pre}>{JSON.stringify(layersData, null, 4)}</pre> */}
            <ReactJson src={layersData} {...ReactJsonProps} />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="styles" key="styles">
          <div className={styles.content}>
            {/* <pre className={styles.pre}>{JSON.stringify(stylesData, null, 4)}</pre> */}
            <ReactJson src={stylesData} {...ReactJsonProps} />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default Data;
