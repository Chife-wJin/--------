import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const {
      value
    } = binding
    const all_permission = "*:*:*";
    let permissions;
    if (store.getters && store.getters.permissions.length) {
      permissions = store.getters.permissions;
    } else {
      permissions = JSON.parse(localStorage.getItem("userInfo")).userInfo.permissions;
    }
    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}