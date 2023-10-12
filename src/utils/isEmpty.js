// 判断当前值是否是 null "null" undefined 0 "0"
export default function isEmpty(value) {
  if ([null, "null", undefined, 0, "0"].includes(value)) {
    return true;
  } else {
    return false
  }
}