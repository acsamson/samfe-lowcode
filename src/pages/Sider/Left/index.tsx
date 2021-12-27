import React, { useState } from 'react';
import { Divider, Layout, Select, Tabs, Tooltip } from 'antd';
import styles from './index.less';
import { CodeSandboxOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
import Antd from './components/Antd';
import Data from './components/Data';
import View from './components/View';
const { Sider, Content } = Layout;
const { TabPane } = Tabs;
interface Props {
  onClick: () => void;
}
function Left(props: Props) {
  const [showType, setshowType] = useState('view');
  const getTypeElm = () => {
    switch (showType) {
      case 'view':
        return <View onClick={props.onClick} />;
      case 'data':
        return <Data />;
      default:
        return null;
    }
  };
  return (
    <Layout className={styles.main} id="left-sider">
      <Tabs defaultActiveKey="1" tabBarStyle={{ padding: 0 }} type="card">
        <TabPane tab="图层" key={'1'}>
          <Select
            defaultValue={'view'}
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
          </Select>
          <Divider style={{ margin: '8px 0' }} />
          {getTypeElm()}
        </TabPane>
      </Tabs>
    </Layout>
  );
}

export default Left;
