import { getAction, postAction, postFormJson } from '../manage'
const path = process.env.VUE_APP_BASE_API;
//菜单
const menuList = params => getAction(`${path}/center/sys/menu/list`,params);//菜单列表
const menuGetMenuById = params => getAction(`${path}/center/sys/menu/getMenuById`,params);//根据ID获取菜单数据
const menuTree = params => getAction(`${path}/center/sys/menu/treeData`,params);//菜单JSON数据
const menuSave = params => postAction(`${path}/center/sys/menu/save`,params);//菜单保存
const menuDelete = params => postAction(`${path}/center/sys/menu/delete`,params);//菜单删除
const menuUpdateSort = params => postAction(`${path}/center/sys/menu/updateSort`,params);//批量修改菜单排序
const menuFormView = params => getAction(`${path}/center/sys/menu/formView`,params);//批量修改菜单排序
const getRouters = params => getAction(`${path}/center/sys/menu/getUserMenu`,params);//获取当前用户授权菜单
const getUserMenuByApplication = params => getAction(`${path}/center/sys/menu/getUserMenuByApplicationId`,params);//获取当前应用对应菜单
const getMenuByParentId = params => getAction(`${path}/center/sys/menu/getMenuByParentId`,params);//parentId=1根据parentId获取子菜单
const getMenuByApplicationId = params => getAction(`${path}/center/sys/menu/getMenuByApplicationId`,params);//根据应用获取菜单

//菜单应用维护
const sysApplicationSave = params => postFormJson(`${path}/center/sys/sysApplication/save`,params);//保存
const sysApplicationDelete = params => postAction(`${path}/center/sys/sysApplication/delete`,params);//删除
const sysApplicationGetInfoById = params => getAction(`${path}/center/sys/sysApplication/getInfoById`,params);//详情
const sysApplicationList = params => getAction(`${path}/center/sys/sysApplication/list`,params);//列表


export {
    menuList,
    menuGetMenuById,
    menuTree,
    menuSave,
    menuDelete,
    menuUpdateSort,
    menuFormView,
    getRouters,
    getUserMenuByApplication,
    getMenuByParentId,
    getMenuByApplicationId,
    sysApplicationSave,
    sysApplicationDelete,
    sysApplicationGetInfoById,
    sysApplicationList
}