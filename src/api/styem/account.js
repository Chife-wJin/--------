import { getAction, postAction  } from '../manage'
const path = process.env.VUE_APP_BASE_API_DATA;

//三普台账
const threeAccountList = params => getAction(path + `/center/bsyd/bsyd/list`,params);//三普台账列表
const threeAccountInfoById = params => getAction(path + `/center/bsyd/bsyd/getInfoById`,params);//三普台账详细信息
export {
    threeAccountList,
    threeAccountInfoById
}