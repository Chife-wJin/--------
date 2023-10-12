const getters = {
  token: (state) => state.user.token,
  userInfo: (state) => state.user.userInfo,
  areaArry: (state) => state.user.areaInfo,
  topbarRouters: (state) => state.permission.topbarRouters,
  sidebarRouters: (state) => state.permission.sidebarRouters,
  tableSetting: (state) => state.permission.tableSetting,
  permissions: (state) => state.user.permissions,
  taskItemInfo: (state) => state.tableSetting.taskItemInfo,
  pageHeight: (state) => state.user.pageHeight,
};
export default getters;
