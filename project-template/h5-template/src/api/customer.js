import request from './request'

// 客户列表
export function customerList (data) {
  return request('customer/list', {
    ...data,
    contentType: 'formData'
  })
}

// 客户详情
export function customerDetail (data) {
  return request('customer/detail', {
    ...data,
    contentType: 'formData'
  })
}

// 保存客户信息
export function customerSave (data) {
  return request('customer/save', {
    ...data,
    contentType: 'formData'
  })
}
