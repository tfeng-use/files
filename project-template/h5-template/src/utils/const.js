// 列表查询所有时传的参数
export const ALL_PAGE = {
  pageNum: 1,
  pageSize: 0
}

export const GENRATE_QRCODE_PARAM = {
  configCode: '2'
}

export const CUSTOMER_AUTH_STATE = {
  2: '未认证',
  3: '审核中',
  5: '已认证'
}

export const CUSTOMER_SOURCE = {
  USER_SCAN_CODE: '用户扫码',
  PLATFORM_DISTRIBUTE: '平台分配'
}

export const APPCODE = 'GM_ITRADE'
export const COMPANY_CODE = '2278936549995530'
export const CUSTOMER_ITEM_SLELECT_LIST = {
  sex: ['男', '女'],
  identity: ['老板', '店长', '店员'],
  age: ['20-30', '30-40', '40-50', '50以上'],
  entirePeriod: ['3年以下', '3~10年', '10年以上'],
  companyType: [
    '品牌门店',
    '非品牌门店',
    '加工店',
    '典当行',
    '银行',
    '个人',
    '其他'
  ],
  operateYears: ['3年以下', '3~10年', '10年以上'],
  companyScale: ['10㎡以下', '11-30㎡', '31-60㎡', '60㎡以上'],
  counterLength: ['没柜台', '3米以下', '3-5米柜台', '5-10米', '10米及以上'],
  stockScale: ['不囤货', '1公斤以下', '1-3公斤', '3-5公斤', '5公斤以上'],
  employeeCount: ['1~3人', '3~5人', '5人以上'],
  productRange: [
    '黄金',
    '白银',
    '铂金',
    '镶嵌',
    '其他',
    '只做回收',
    '手工加工'
  ],
  monthRecycleAverage: ['30g以下', '31-50g', '50-100g', '100-500g', '500g以上'],
  monthSaleAverage: ['500g以下', '500-1kg', '1kg以上']
}

export const CUSTOMER_CONFIG = {
  configCode: '1348578618763739137'
}
