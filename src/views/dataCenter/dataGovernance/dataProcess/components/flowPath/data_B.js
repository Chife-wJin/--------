// let dataB = {
//   name: '流程B',
//   nodeList: [{
//       entrance: [],
//       preLeftNodeId: "",
//       preRightNodeId: "",
//       nextNodeId: "",
//       nodeId: 'nodeA',
//       name: '节点A-不可拖拽',
//       type: 'task',
//       left: '18px',
//       top: '223px',
//       ico: 'el-icon-user-solid',
//       state: 'success',
//       viewOnly: true
//     },
//     {
//       entrance: [],
//       preLeftNodeId: "",
//       preRightNodeId: "",
//       nextNodeId: "",
//       nodeId: 'nodeB',
//       type: 'task',
//       name: '流程B-节点B',
//       left: '351px',
//       top: '96px',
//       ico: 'el-icon-goods',
//       state: 'error'
//     },
//     {
//       entrance: [],
//       preLeftNodeId: "",
//       preRightNodeId: "",
//       nextNodeId: "",
//       nodeId: 'nodeC',
//       name: '流程B-节点C',
//       type: 'task',
//       left: '354px',
//       top: '351px',
//       ico: 'el-icon-present',
//       state: 'warning'
//     }, {
//       entrance: [],
//       preLeftNodeId: "",
//       preRightNodeId: "",
//       nextNodeId: "",
//       nodeId: 'nodeD',
//       name: '流程B-节点D',
//       type: 'task',
//       left: '723px',
//       top: '215px',
//       ico: 'el-icon-present',
//       state: 'running'
//     }
//   ],
//   lineList: [{
//     from: 'nodeA',
//     to: 'nodeB',
//     label: '条件A'
//   }, {
//     from: 'nodeA',
//     to: 'nodeC',
//     label: '条件B'
//   }, {
//     from: 'nodeB',
//     to: 'nodeD'
//   }, {
//     from: 'nodeC',
//     to: 'nodeD'
//   }]
// }

let dataB = {
  name: '流程B',
  nodeList: [],
  lineList: []
}

export function getDataB() {
  return dataB
}