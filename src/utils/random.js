/**
 * 生成一个用不重复的ID
 * @param { Number } randomLength 
 */
 export function getUuiD(randomLength){
  return Number(Math.random().toString().substring(2,randomLength) + Date.now()).toString(36)
 }