// 券状态
export const COUPON_STATUS_OBJ = {
  EFFECTIVE: '生效中',
  DISCARD: '已作废',
  COMPLETED: '已完成'
}

export const COUPON_STATUS_MAP = Object.keys(COUPON_STATUS_OBJ).map(key => {
  return {
    label: COUPON_STATUS_OBJ[key],
    value: key
  }
})
