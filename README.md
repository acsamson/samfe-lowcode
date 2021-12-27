# samfe-lowcode 低代码平台
git commit --no-verify -m  "feat: rota"
### start
```shell
yarn
yarn start
```
### TODO
https://codesandbox.io/s/react-moveable-demo-jl69c?file=/src/index.js:234-477
- [ ] 操作区域
  - [ ] 撤销
  - [ ] 重做
  - [ ] 画布切换
  - [ ] 预览
- [ ] 画布区域
  - [ ] 组件
    - [ ] 放大缩小
    - [ ] 旋转
    - [x] 移动
    - [x] 复制
    - [x] 删除
    - [ ] 位置标注
    - [ ] 右键控制
- [ ] 属性区域
  - [ ] 基础属性
    - [ ] width
    - [ ] height
    - [ ] background
    - [ ] border
- [ ] 尾部区域
  - [ ] 布局控制
    - [ ] 放大缩小
    - [ ] 页面数据展示
- [ ] 其他
  - [ ] 键盘操作控制
    - [ ] 撤销
    - [ ] 重做

### 数据格式
```json
[{
    "name": "button0",
    "key": "button0",
    "type": "component",
    "component": "antd.button",
    "alias": "btn0",
    "props": {
      "type": "primary",
      "children": "btn0",
      "style": {
        "width": "200px",
        "height": "38px"
      }
    }
  },
  {
    "name": "group1",
    "key": "group1",
    "type": "group",
    "alias": "g1",
    "props": {},
    "children": [{
        "name": "group1-1",
        "key": "group1-1",
        "type": "group",
        "alias": "g1-1",
        "props": {},
        "children": [{
          "name": "button1",
          "key": "button1",
          "type": "component",
          "component": "antd.button",
          "alias": "btn1",
          "props": {
            "children": "btn1",
            "style": {
              "width": "200px",
              "height": "38px"
            }
          }
        }]
      },
      {
        "name": "button2",
        "key": "button2",
        "type": "component",
        "component": "antd.button",
        "alias": "btn2",
        "props": {
          "children": "btn2",
          "style": {
            "width": "200px",
            "height": "38px"
          }
        }
      }
    ]
  }
]
```
