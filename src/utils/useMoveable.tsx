import { enhancedOptions, EnhancedOptions } from '@/components/EnhancedContainer/utils';
import { LayerItem } from '@/data/layers';
import Moveable from 'moveable';
import { Frame } from 'scenejs';
import _ from 'lodash';
import { emptyGroupStyles, zIndexMax } from '@/data';
import { useState } from 'react';

export interface MoveableContainerProps {
  node: LayerItem;
  style: Record<string, any>;
  Ref: {
    containerRef: any;
    targetRef: any;
    labelRef: any;
  };
  status: {
    scalable?: boolean;
    resizable?: boolean;
    warpable?: boolean;
  };
  setStyle: (x: Record<string, any>) => void;
}
function useMoveable(curItem: MoveableContainerProps) {
  const containerRef = _.get(curItem.Ref, 'containerRef.current', null);
  const targetRef = _.get(curItem.Ref, 'targetRef.current', null);
  const labelRef = _.get(curItem.Ref, 'labelRef.current', null);
  const options: EnhancedOptions = enhancedOptions(curItem.node.type || '');
  const _dom: any = document.querySelectorAll(`#content_container`)[0];
  const elementGuidelines = [].slice.call(_dom);
  const frame = new Frame({
    ...options.emptyStyles,
  });
  const moveable = new Moveable(_dom, {
    // 容器
    target: targetRef,
    // container: curItem?.Ref?.containerRef?.current || null,
    className: 'moveable-controller-box',
    // className: 'Moveable-controller-box',
    // 拖动
    draggable: true,
    dragArea: true,
    throttleDrag: 1,
    // onDrag: onDrag,
    // onDragEnd: onEnd,
    // 缩放
    scalable: curItem.status.scalable || false,
    throttleScale: 0.01,
    // 调整大小, 内容不变
    resizable: curItem.status.resizable || false,
    throttleResize: 1,
    // 变换形状
    warpable: curItem.status.warpable || false,
    // 旋转
    rotatable: true,
    throttleRotate: 0.2,
    // rotationPosition: 'top',
    // 双指缩放
    pinchable: true,
    pinchThreshold: 20,
    origin: false,
    // 其他
    snappable: true,
    elementGuidelines: elementGuidelines,
  });
  const setTransform = (target: any, transform: any) => {
    target.style.transform = transform;
  };
  const setPosition = (target: any, left: number, top: number) => {
    target.style.left = `${left}px`;
    target.style.top = `${top}px`;
  };
  // 设置样式
  const curItemSetStyle = (_val = {}) => {
    let _style = curItem.style || {};
    if (!Object.keys(_style || {}).length) {
      _style = emptyGroupStyles;
    }
    curItem.setStyle({ ..._style, ..._val });
  };
  const setLabel = ({ target, clientX, clientY, text, left, top, scaleX = 1, scaleY = 1 }: any) => {
    if (!target || !containerRef) {
      return;
    }
    const _rect = target.getBoundingClientRect();
    const _containerRect = containerRef.getBoundingClientRect();
    const _left = _rect.x - _containerRect.x;
    const _top = _rect.y - _containerRect.y;
    curItem.Ref.labelRef.current.style.cssText = `display: block; width: 72px; position: absolute; left: ${_left +
      _rect.width +
      76}px; top: ${_top + _rect.height + 48}px; z-index: ${zIndexMax}`;
    curItem.Ref.labelRef.current.innerHTML = text;
  };
  moveable.on(
    'scale',
    ({ target, delta, clientX, clientY, isPinch, transform, left, top }: any) => {
      const scaleX = frame.get('transform', 'scaleX') * delta[0];
      const scaleY = frame.get('transform', 'scaleY') * delta[1];
      frame.set('transform', 'scaleX', scaleX);
      frame.set('transform', 'scaleY', scaleY);
      setTransform(target, transform);
      curItemSetStyle({ transform: frame.get('transform') });
      if (!isPinch) {
        setLabel({
          target,
          clientX,
          clientY,
          text: `S: ${scaleX.toFixed(2)}, ${scaleY.toFixed(2)}`,
          left,
          top,
          scaleX,
          scaleY,
        });
      }
    },
  );
  // ==========
  // moveable.on('pinch', ({ clientX, clientY, target, transform, left, top }: any) => {
  //   setTransform(target, transform);
  //   setTimeout(() => {
  //     setLabel({
  //       target,
  //       clientX,
  //       clientY,
  //       text: `X: ${frame.get('left')}
  //           <br/>Y: ${frame.get('top')}
  //           <br/>W: ${frame.get('width')}
  //           <br/>H: ${frame.get('height')}
  //           <br/>S: ${frame.get('transform', 'scaleX').toFixed(2)}, ${frame
  //         .get('transform', 'scaleY')
  //         .toFixed(2)}
  //         <br/>R: ${parseFloat(frame.get('transform', 'rotate')).toFixed(1)}deg`,
  //       left,
  //       top,
  //     });
  //   });
  // });
  moveable.on(
    'rotate',
    ({ target, transform, clientX, clientY, beforeDelta, isPinch, left, top }: any) => {
      const deg = parseFloat(frame.get('transform', 'rotate')) + beforeDelta;
      frame.set('transform', 'rotate', `${deg}deg`);
      setTransform(target, transform);
      curItemSetStyle({ transform: frame.get('transform') });
      if (!isPinch) {
        setLabel({
          target,
          clientX,
          clientY,
          text: `R: ${deg.toFixed(1)}`,
          left,
          top,
        });
      }
    },
  );
  // /**
  //  * 拖动
  //  * @param param0
  //  */
  moveable.on(
    'drag',
    ({ target, transform, clientX, clientY, isPinch, inputEvent, left, top }: any) => {
      frame.set('left', `${left}px`);
      frame.set('top', `${top}px`);
      setPosition(target, left, top);
      curItemSetStyle({ left: `${left}px`, top: `${top}px` });
      if (!isPinch) {
        setLabel({ target, clientX, clientY, text: `X: ${left}px<br/>Y: ${top}px`, left, top });
      }
    },
  );
  /**
   * 调整大小
   * @param param0
   */
  moveable.on(
    'resize',
    ({ target, transform, clientX, clientY, width, height, isPinch, left, top }: any) => {
      target.style.width = `${width}px`;
      target.style.height = `${height}px`;
      curItemSetStyle({ width: `${width}px`, height: `${height}px` });
      if (!isPinch) {
        setLabel({ target, clientX, clientY, text: `W: ${width}px<br/>H: ${height}px`, left, top });
      }
    },
  );
  /**
   * 调整形状
   * @param param0
   */
  moveable.on(
    'warp',
    ({ target, transform, clientX, clientY, delta, multiply, left, top }: any) => {
      frame.set('transform', 'matrix3d', multiply(frame.get('transform', 'matrix3d'), delta));
      setTransform(target, transform);
      curItemSetStyle({ transform: frame.get('transform') });
      setLabel({
        target,
        clientX,
        clientY,
        text: `X: ${clientX}px<br/>Y: ${clientY}px`,
        left,
        top,
      });
    },
  );
  const onEnd = () => {
    curItem.Ref.labelRef.current.style.display = 'none';
  };
  moveable.on('scaleEnd', ({ target, isDrag }) => {
    onEnd();
  });
  moveable.on('resizeEnd', ({ target, isDrag }) => {
    onEnd();
  });
  moveable.on('rotateEnd', ({ target, isDrag }) => {
    onEnd();
  });
  moveable.on('dragEnd', ({ target, isDrag }) => {
    onEnd();
  });
  moveable.on('pinchEnd', ({ target, isDrag }) => {
    onEnd();
  });
  moveable.on('warpEnd', ({ target, isDrag }) => {
    onEnd();
  });
  return moveable;
}

export default useMoveable;
