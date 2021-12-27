import { nanoid } from 'nanoid';
export const zIndexMax = 10000000;
// export const zIndexMax = 2147483647;
export const containerStyles = {
  width: '100%',
  height: '100%',
};
export const emptyElementStyles = {
  // ======= layout
  // position: 'relative',
  width: '100px',
  height: '100px',
  left: 0,
  top: 0,
  // ======= border
  border: '1px solid #adadad',
  borderRadius: 0,
  backgroundColor: 'aquamarine',
  // ======== text
  textAlign: 'center',
  fontSize: '18px',
  fontWeight: 100,
  letterSpacing: '1px',
  fontFamily: 'Roboto, sans-serif',
  // ======== transform
  transform: {
    // rotate: '0deg',
    // scaleX: 1,
    // scaleY: 1,
    // matrix3d: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  },
};
export const emptyGroupStyles = {
  position: 'relative',
  minHeight: '100px',
  width: '100%',
  height: 'fit-content',
  border: '1px dashed #e2e2e2',
  borderRadius: 0,
  backgroundColor: '#459',
  transform: {
    // rotate: '0',
    // scaleX: 1,
    // scaleY: 1,
    // matrix3d: [],
  },
};
export const antdBtnProps = {
  style: { marginRight: '8px' },
};
export const ModalDefaultProps = {
  width: '80%',
  footer: null,
  closable: true,
  bodyStyle: { maxHeight: '800px', overflow: 'auto' },
};
