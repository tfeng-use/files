// 用于图片上传
import { __WX__, __LOCAL__ } from '@config'
import { upload2Cos } from '@/api/upload'
import { dataURLtoFile } from '@util'
import { ref } from 'vue'
export function useUpload ({ featureName = 'order', multiple = true } = {}) {
  // 微信上传
  function wxUpload () {
    return new Promise(resolve => {
      wx.chooseImage({
        count: multiple ? 9 : 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success ({ localIds }) {
          const { length } = localIds
          const fileList = []
          loading.value = true
          localIds.forEach(localId => {
            // 获取图片信息 获取本地图片接口
            wx.getLocalImgData({
              localId, // 图片的localID
              success ({ localData }) {
                // 图片base64转file
                const file = dataURLtoFile(localData, localId + '.jpg')
                upload2Cos(featureName, file, ({ data }) => {
                  fileList.push(data)
                  if (fileList.length === length) {
                    resolve(fileList)
                  }
                })
              }
            })
          })
        }
      })
    })
  }
  // 本地上传
  function localUpload () {
    return new Promise(resolve => {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      multiple && input.setAttribute('multiple', multiple)
      document.body.appendChild(input)
      input.addEventListener('change', event => {
        const files = [...event.target.files]
        const { length } = files
        const fileList = []
        loading.value = true
        files.forEach(file => {
          upload2Cos(featureName, file, ({ data }) => {
            fileList.push(data)
            if (fileList.length === length) {
              resolve(fileList)
              document.body.removeChild(input)
            }
          })
        })
      })
      input.click()
    })
  }
  // 上传
  const loading = ref(false)
  async function upload () {
    let fileList = []
    // 只有在不是本地的时候使用微信上传
    if (__WX__ && !__LOCAL__) {
      fileList = await wxUpload()
    } else {
      fileList = await localUpload()
    }
    loading.value = false
    return fileList
  }
  return {
    loading,
    upload
  }
}
