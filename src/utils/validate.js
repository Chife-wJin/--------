export function isExternal(path){
    return /^(https|http)/.test(path)
}
//密码必须包含数字、大小写字母、特殊符号且长度在6到20之间
export function isPasword(value){
    return /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[~!@#$%^&*()])[\da-zA-Z!@#$%^&*()]{6,20}$/.test(value)
}

//邮箱
export function isEmail(value){
    //return /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[~!@#$%^&*()])[\da-zA-Z!@#$%^&*()]{6,20}$/.test(value)
    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value)
}

//手机
export function isMobile(value){
    return /^(\d{3,4}-?)?\d{7,9}$/g.test(value)
}
//电话
export function isPhone(value){
    return /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value)
}

//只能保留六位
export function isDecimals(value){
    return /^[0-9]+(.[0-9]{1,10})?$/.test(value)
}
//身份证号
export function isCard(value){
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
}

//图片
export function isImg(value){
    return /\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(value)
}

//视频
export function isVideo(value){
    return /\.(mov|rmvb|rm|mp4|3gp)$/.test(value)
}

//音频
export function isAudio(value){
    return /\.(mp3)$/.test(value)
}

/**
 * 判断是否是json
 *
 * @param str
 * @returns {boolean}
 */
 export function isJSON(str) {
    if (typeof str === 'string') {
        try {
            JSON.parse(str)
            return true
        } catch (e) {
            return false
        }
    }
    return false
}
