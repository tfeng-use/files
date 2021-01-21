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

export const PURCHASE_TYPE = {
  quick: 'quick', // 立即处理
  checkLogistics: 'checkLogistics', // 查看物流
  confirmAccept: 'confirmAccept', // 确认收货
  checkingResult: 'checkingResult', // 录入破检结果
  uploadVoucher: 'uploadVoucher', // 上传凭证
  sendToFactory: 'sendToFactory', // 发往工厂检查
  changeDeliveryWay: 'changeDeliveryWay' // 修改配送方式
}
