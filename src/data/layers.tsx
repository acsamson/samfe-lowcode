import { nanoid } from 'nanoid';
export interface LayerItem {
  id: string;
  title: string;
  type: 'component' | 'group' | string;
  children?: LayerItem[];
}
export default [
  {
    title: 'element0',
    id: 'element0',
    type: 'component',
  },
  {
    title: 'group0',
    id: 'group0',
    type: 'group',
    children: [
      {
        title: 'group0-1',
        id: 'group0-1',
        type: 'group',
        children: [
          {
            title: 'group0-1-1',
            id: 'group0-1-1',
            type: 'group',
            children: [
              {
                title: 'element1',
                id: 'element1',
                type: 'component',
              },
            ],
          },
          {
            title: 'group0-2',
            id: 'group0-2',
            type: 'group',
            children: [
              {
                title: 'group0-2-1',
                id: 'group0-2-1',
                type: 'group',
                children: [
                  {
                    title: 'group0-2-1-1',
                    id: 'group0-2-1-1',
                    type: 'group',
                    children: [
                      {
                        title: 'element2',
                        id: 'element2',
                        type: 'component',
                      },
                    ],
                  },
                  {
                    title: 'element3',
                    id: 'element3',
                    type: 'component',
                  },
                ],
              },
              {
                title: 'element4',
                id: 'element4',
                type: 'component',
              },
            ],
          },
        ],
      },
      {
        title: 'element5',
        id: 'element5',
        type: 'component',
      },
    ],
  },
];
