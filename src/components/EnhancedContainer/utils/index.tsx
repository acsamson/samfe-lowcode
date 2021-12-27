import { emptyElementStyles, emptyGroupStyles } from '@/data';

export interface EnhancedOptions {
  draggableHandle: string;
  containerClassName: string;
  targetClassName: string;
  emptyStyles: Record<string, any>;
}
export const enhancedOptions: (type: string) => EnhancedOptions = (type = 'element') => {
  switch (type) {
    case 'group':
      return {
        draggableHandle: '.group_moveable',
        containerClassName: 'group_container',
        targetClassName: 'group_moveable',
        emptyStyles: emptyGroupStyles,
      };
    // 'element'
    default:
      return {
        draggableHandle: '.element_moveable',
        containerClassName: 'element_container',
        targetClassName: 'element_moveable',
        emptyStyles: emptyElementStyles,
      };
  }
};
