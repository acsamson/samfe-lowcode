import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getReducerData,
  setCurrentItem,
  setLayers,
  setStyles,
  setStatus,
  defaultStatus,
} from '@/store/reducer/data';
import {
  Alert,
  Button,
  Divider,
  Input,
  List,
  message,
  Popconfirm,
  Popover,
  Select,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import SortableTree, {
  map,
  toggleExpandedForAll,
  changeNodeAtPath,
  insertNode,
  removeNodeAtPath,
  addNodeUnderParent,
  getNodeAtPath,
} from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import styles from './index.less';
import {
  CiCircleOutlined,
  CloseOutlined,
  EditOutlined,
  FileOutlined,
  FolderOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import eventBus from '@/utils/eventBus';
import _ from 'lodash';
import { antdBtnProps } from '@/data';
import { nanoid } from 'nanoid';
import { getNodeKey, setCurrentItemById, treeNewNode } from '@/utils';
interface Props {
  onClick: () => void;
}
function View(props: Props) {
  const treeData = useSelector(getReducerData)['layers'] || {};
  const reducxStyles = useSelector(getReducerData)['styles'] || {};
  const status = useSelector(getReducerData)['status'] || {};
  const dispatch = useDispatch();
  const [searchString, setsearchString] = useState('');
  const [maxDepth, setmaxDepth] = useState<number | undefined>(undefined);
  // 查询节点
  const _inputChange = (_event: any, _node: Record<string, any>, _path: number[] | string[]) => {
    const title = _event.target.value;
    const _data = changeNodeAtPath({
      treeData: treeData,
      path: _path,
      getNodeKey,
      newNode: { ..._node, title },
    });
    console.log('🚀 onChange', title, _data, _path);
    message.success(`${_node.title || ''} => ${title} : 修改${_node.id || ''}的title成功`);
    eventBus.emit('undateLayers', { type: 'inputChange', value: _data });
    dispatch(setLayers(_data));
  };
  const expandAndCollapse = (expanded: Boolean) => {
    dispatch(
      setLayers(
        toggleExpandedForAll({
          treeData: treeData,
          expanded,
        }),
      ),
    );
  };
  // 添加到父节点
  const _addNodeUnderParent = (
    e: { preventDefault: () => void; stopPropagation: () => void },
    _node: Record<string, any>,
    _path: any,
    _type = 'component',
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // _path.pop();
    let parentNode = getNodeAtPath({
      treeData,
      path: _path,
      getNodeKey,
      ignoreCollapsed: true,
    });
    let parentKey = getNodeKey(parentNode);
    if (parentKey == -1) {
      parentKey = null;
    }
    const _newData = treeNewNode(_type);
    dispatch(
      setStyles({
        type: 'add',
        value: { ...reducxStyles, [_newData.id || '']: _newData.style || {} },
      }),
    );
    const _dataAll = addNodeUnderParent({
      treeData,
      getNodeKey,
      parentKey: parentKey,
      newNode: _newData.node || {},
      expandParent: true,
      addAsFirstChild: true,
    });
    const _data = _dataAll.treeData || [];
    eventBus.emit('undateLayers', { type: 'addNodeUnderParent', value: _data });
    dispatch(setLayers(_data || []));
  };
  const _insertNewNode = (_path: any, _type = 'component') => {
    const _newData = treeNewNode(_type);
    dispatch(
      setStyles({
        type: 'add',
        value: { ...reducxStyles, [_newData.id || '']: _newData.style || {} },
      }),
    );
    const _treeData =
      insertNode({
        treeData,
        depth: 0,
        minimumTreeIndex: 0,
        newNode: _newData.node || {},
        getNodeKey,
        expandParent: true,
      }).treeData || [];
    eventBus.emit('undateLayers', { type: 'insertNewNode', value: _treeData });
    dispatch(setLayers(_treeData || []));
  };
  const _deleteNode = (_node: Record<string, any>, _path: number) => {
    const _treeData = removeNodeAtPath({
      treeData,
      path: _path,
      getNodeKey,
    });
    dispatch(setLayers(_treeData || []));
    let _reducxStyles = _.cloneDeep(reducxStyles);
    delete _reducxStyles[_node.id || ''];
    eventBus.emit('undateLayers', { type: 'deleteNode', value: _treeData });
    dispatch(
      setStyles({
        type: 'replace',
        value: _reducxStyles,
      }),
    );
  };
  const _onDepthChange = (_val: number | never) => {
    setmaxDepth(_val || 0);
    let _data = toggleExpandedForAll({
      treeData: treeData,
      expanded: false,
    });
    const _dfs = (_dataInner: any, depth: number) => {
      console.log('🚀 11', _dataInner, depth, _val);
      if (+depth >= +_val) {
        return _dataInner;
      }
      // const _dep = +depth + 1;
      if (Array.isArray(_dataInner)) {
        const len = _dataInner.length;
        for (let i = 0; i < len; i += 1) {
          _dataInner[i] = _dfs(_dataInner[i], depth);
        }
      } else {
        _dataInner.expanded = true;
        if (_dataInner.children) {
          _dataInner.children = _dfs(_dataInner.children, +depth + 1);
        }
      }
      return _dataInner;
    };
    const _res = _dfs(_data, 1);
    dispatch(setLayers(_res || []));
  };
  const addContent = () => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '260px' }}>
        <div>
          <Button
            onClick={e => _insertNewNode(0, 'group')}
            type="primary"
            style={{ marginRight: '8px' }}
          >
            <FolderOutlined style={{ marginRight: '8px' }} />
            group
          </Button>
          <Button onClick={e => _insertNewNode(0, 'component')} className={styles.btn}>
            <FileOutlined style={{ marginRight: '8px' }} />
            component
          </Button>
        </div>
      </div>
    );
  };
  // 左死的人: 选中元素/组合
  const onNodeClick = (node: Record<string, any>, event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const clickedItemClassName = event.target.className;
    if (
      !(
        clickedItemClassName === 'rst__moveHandle' ||
        (clickedItemClassName.indexOf && clickedItemClassName.indexOf('tree_node') !== -1)
      )
    ) {
      return;
    }
    const _isSelected = Boolean(node.isSelected);
    const newTree = map({
      treeData,
      getNodeKey,
      callback: (n: any) => {
        n.node.isSelected = _isSelected ? false : n.node.id === node.id;
        return n.node;
      },
      ignoreCollapsed: false,
    });
    dispatch(setLayers(newTree));
    let _data = setCurrentItemById(node.id, treeData);
    if (_data.node) {
      if (_data.node.children) {
        delete _data.node['children'];
      }
      _data.node = {
        ..._data.node,
        isSelected: true,
      };
    }
    console.log('🚀 选中元素: _data', _data);
    const _curItem = {
      node: props,
      // style: reducxStyles[node.id] || {},
      Ref: {
        containerRef: { current: document.getElementById('content_container') },
        targetRef: { current: document.getElementById(`moveable__${node.id}`) },
        labelRef: { current: document.getElementById('content_container_label') },
      },
    };
    eventBus.emit('currentItem', _curItem);
    dispatch(setCurrentItem(_data));
  };
  useEffect(() => {
    expandAndCollapse(true);
  }, []);
  return (
    <div className={styles.main}>
      <div className={styles.tree_header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input.Search
            style={{ width: '200px', marginRight: '8px' }}
            placeholder="节点查询"
            onSearch={_val => {
              setsearchString(_val);
            }}
          />
          <Button size="small" style={{ marginRight: '8px' }}>
            <Popover placement="top" title={null} content={addContent()} trigger="click">
              <PlusOutlined />
            </Popover>
          </Button>
          <Tooltip
            trigger={'hover'}
            overlayInnerStyle={{ width: 'fit-content', maxHeight: '400px', overflow: 'auto' }}
            title={
              <div>
                <Tag className={styles.tag}>{'group可添加孩子，component不可'}</Tag>
                <Tag className={styles.tag}>{'input按下回车完成修改title'}</Tag>
              </div>
            }
          >
            <QuestionCircleOutlined style={{ marginRight: '8px' }} />
          </Tooltip>
        </div>
        <div className={styles.header}>
          <Button
            size="small"
            {...antdBtnProps}
            className={styles.btn}
            onClick={() => {
              expandAndCollapse(true);
              setmaxDepth(undefined);
            }}
          >
            展开全部
          </Button>
          <Button
            size="small"
            type="ghost"
            className={styles.btn}
            onClick={() => {
              expandAndCollapse(false);
              setmaxDepth(undefined);
            }}
          >
            收起全部
          </Button>
          <Select
            placeholder="展开级别"
            size="small"
            value={maxDepth}
            allowClear
            onChange={_onDepthChange}
          >
            {[1, 2, 3, 4, 5, 6].map(_val => {
              return <Select.Option value={_val} key={nanoid()}>{`第${_val}层`}</Select.Option>;
            })}
          </Select>
        </div>
      </div>
      <div className={styles.tree_container}>
        <SortableTree
          searchQuery={searchString}
          searchFocusOffset={0}
          treeData={treeData}
          style={{ height: 'calc(100% - 120px)' }}
          canNodeHaveChildren={(node: Record<string, any>) => {
            return node.type !== 'component';
          }}
          onChange={(treeData: any) => {
            dispatch(setLayers(treeData));
          }}
          rowHeight={48}
          scaffoldBlockPxWidth={32}
          generateNodeProps={({ node, path }: any) => ({
            onClick: (e: MouseEvent) => onNodeClick(node, e),
            onMouseEnter: (e: MouseEvent) => console.log('onMouseEnter', { node, e }),
            title: (
              <div className={`tree_node ${node.isSelected ? styles.tree_node_selected : ''}`}>
                <Input
                  size="small"
                  key={nanoid()}
                  style={{
                    width: 100,
                    marginRight: '4px',
                    ...(node.type === 'group'
                      ? { backgroundColor: 'rgb(131 199 255)', color: '#fff' }
                      : { backgroundColor: 'antiquewhite' }),
                  }}
                  defaultValue={node.title}
                  onPressEnter={(e: any) => _inputChange(e, node, path)}
                />
                <Tooltip
                  trigger={'click'}
                  overlayInnerStyle={{ width: 'fit-content', maxHeight: '400px', overflow: 'auto' }}
                  title={
                    <div>
                      <pre>
                        {JSON.stringify(
                          { layer: node, style: reducxStyles[node.id || ''] || {} },
                          null,
                          4,
                        )}
                      </pre>
                    </div>
                  }
                >
                  <QuestionCircleOutlined style={{ marginRight: '4px' }} />
                </Tooltip>
                {node.type === 'group' ? (
                  <Button size="small" style={{ marginRight: '4px' }}>
                    <Popover
                      placement="top"
                      title={null}
                      content={
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          <Button
                            onClick={e => _addNodeUnderParent(e, node, path, 'group')}
                            type="primary"
                            style={{ marginRight: '8px' }}
                          >
                            <FolderOutlined style={{ marginRight: '8px' }} />
                            group
                          </Button>
                          <Button
                            onClick={e => _addNodeUnderParent(e, node, path, 'component')}
                            className={styles.btn}
                          >
                            <FileOutlined style={{ marginRight: '8px' }} />
                            component
                          </Button>
                        </div>
                      }
                      trigger="click"
                    >
                      <PlusOutlined />
                    </Popover>
                  </Button>
                ) : null}
                <Button size="small" style={{ marginRight: '4px' }}>
                  <Popconfirm
                    placement="bottom"
                    title={'确认删除'}
                    onConfirm={() => _deleteNode(node, path)}
                    okText="确定"
                    cancelText="否"
                  >
                    <CloseOutlined />
                  </Popconfirm>
                </Button>
              </div>
            ),
          })}
        />
      </div>
    </div>
  );
}

export default View;
