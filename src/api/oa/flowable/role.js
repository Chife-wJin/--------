// 流程定义页面 -> 候选角色弹窗api
import {
  getAction,
} from '@/api/manage';
const path = process.env.VUE_APP_BASE_API;

// 查询角色列表
const roleList = params => getAction(`${path}/center/sys/role/list`,params);

export {
  roleList,
}