
let checkObj = {
   1: [
    {
      name: '按位数替换',
      key: 1,
      value: 1,
    },
    {
      name: '按固定值替换',
      key: 2,
      value: 2,
    },
  ],
  2:[
    {
      name: '保留',
      key: 1,
      value: 1,
    },
    {
      name: '去除',
      key: 2,
      value: 2,
    },
  ],
  3:[
    {
      name: '加',
      key: 1,
      value: 1,
    },
    {
      name: '减',
      key: 2,
      value: 2,
    },
    {
      name: '乘',
      key: 3,
      value: 3,
    },
    {
      name: '除',
      key: 4,
      value: 4,
    },
  ]
}
  
let desensitizationModeCheck =[
  {
    name: '替换',
    key: '1',
    value: '1',
  },
  {
    name: '截取',
    key: '2',
    value: '2',
  },
  {
    name: '运算',
    key: '3',
    value: '3',
  },
  {
    name: '随机化',
    key: '4',
    value: '4',
  },
  {
    name: '常用规则',
    key: '5',
    value: '5',
  },
]


export {
  checkObj,
  desensitizationModeCheck
}

