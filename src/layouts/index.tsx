import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '@/store/store';

const AppLayout: React.FC = props => {
  const store = configureStore();
  return <Provider store={store}>{props.children}</Provider>;
};

export default AppLayout;
