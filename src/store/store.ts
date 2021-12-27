import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import layer from './reducer/data';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const configureStore = () => {
  const store = createStore(layer, composeEnhancers(applyMiddleware(sagaMiddleware)));
  // sagaMiddleware.run(sagas);
  return store;
};

export default configureStore;
