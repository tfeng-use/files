// 用于判断表单提交的按钮是否为disable状态
import { computed } from 'vue'
export function useBtnDisable (formData, ignore = []) {
  const disable = computed(() => {
    return Object.keys(formData).some(key => {
      if (ignore.includes(key)) {
        return false
      }
      if (Array.isArray(formData[key])) {
        return !formData[key].length
      } else {
        return !formData[key]
      }
    })
  })
  return {
    disable
  }
}
