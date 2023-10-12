import defaultSettings from '@/settings'
const { tagsView } = defaultSettings
const storageSetting = JSON.parse(localStorage.getItem('layout-setting')) || ''
const state = {
    theme: storageSetting.theme || '#409EFF',
    tagsView: storageSetting.tagsView === undefined ? tagsView : storageSetting.tagsView,
}
export default {
    namespaced: true,
    state
}