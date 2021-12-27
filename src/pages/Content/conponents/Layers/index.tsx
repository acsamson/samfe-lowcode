import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReducerData, setLayers } from '@/store/reducer/data';
interface Props {
  data: Record<string, any>[];
}
function Layers(props: Props) {
  const status = useSelector(getReducerData)['status'] || {};
  const dispatch = useDispatch();
  return (
    <div>
      <div
        className="element"
        style={{
          marginTop: 100,
          marginLeft: 35,
          width: 100,
          height: 100,
          backgroundColor: 'red',
        }}
      ></div>
    </div>
  );
}

export default Layers;
