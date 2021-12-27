import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReducerData, setLayers, setStyles } from '@/store/reducer/data';
import { Collapse, Tag } from 'antd';
const { Panel } = Collapse;
function SFooter() {
  const layers = useSelector(getReducerData)['layers'] || {};
  const styles = useSelector(getReducerData)['styles'] || {};
  const status = useSelector(getReducerData)['status'] || {};
  const currentItem = useSelector(getReducerData)['currentItem'] || {};
  const _panelHeader = useCallback((title: string, extra?: string) => {
    return (
      <div>
        <Tag style={{ marginRight: '8px' }}>{title}</Tag>
        {extra || ''}
      </div>
    );
  }, []);
  return (
    <div className={styles.main}>
      <Collapse defaultActiveKey={'4'}>
        {/* <Panel header={_panelHeader('layers 图层')} key="1">
          <pre className={styles.pre}>{JSON.stringify(layers, null, 4)}</pre>
        </Panel> */}
        <Panel header={_panelHeader('currentItem 当前元素', '不展示children')} key="4">
          <pre className={styles.pre}>{JSON.stringify(currentItem, null, 4)}</pre>
        </Panel>
        {/* <Panel header={_panelHeader('status 状态')} key="3">
          <pre className={styles.pre}>{JSON.stringify(status, null, 4)}</pre>
        </Panel>
        <Panel header={_panelHeader('全部 styles 样式', '默认无样式')} key="2">
          <pre className={styles.pre}>{JSON.stringify(styles, null, 4)}</pre>
        </Panel> */}
      </Collapse>
    </div>
  );
}

export default SFooter;
