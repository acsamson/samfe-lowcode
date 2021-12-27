const dragmethods = () => {
  const handleDragStart = (e: any, name: string) => {
    console.log('handleDragStart', e);
    e.dataTransfer.setLayers('component', name);
  };
  const handleDragEnd = (e: any, name: string) => {
    console.log('handleDragEnd', e);
  };
  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const componentIndex = e.dataTransfer.getData('component');
    console.log('🚀 handleDrop', componentIndex, e);
  };
  const handleDragOver = (e: any) => {
    // console.log('handleDragOver', e);
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  return { handleDragStart, handleDragEnd, handleDragOver, handleDrop };
};
export default dragmethods;
export function getDragAngle(event: any, element: any) {
  //  var element = event.target;
  var startAngle = parseFloat(element?.dataset?.angle) || 0;
  var center = {
    x: parseFloat(element?.dataset?.centerX) || 0,
    y: parseFloat(element?.dataset?.centerY) || 0,
  };
  var angle = Math.atan2(center.y - event.clientY, center.x - event.clientX);
  return angle - startAngle;
}
