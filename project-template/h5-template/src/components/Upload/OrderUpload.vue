<template>
  <div class="upload-container">
    <div
      class="van-uploader__upload"
      @click="chooseImage"
      v-if="isWx && fileList.length < maxCount"
    >
      <i class="van-icon van-icon-photograph van-uploader__upload-icon" />
    </div>

    <van-uploader
      class="add-image"
      v-if="!isWx && fileList.length < maxCount"
      :after-read="onAfterRead"
      :multiple="multiple"
      :max-count="maxCount"
    />

    <div class="upload-loading" v-if="uploadLen !== choseLen">
      <van-loading />
      <span>上传中...</span>
    </div>

    <div
      class="van-image van-uploader__preview-image add-image"
      v-for="(file, index) in showList"
      :key="index"
      @click.stop="handleViewImage(index)"
    >
      <img class="van-image__img" :src="file.imgUrl" alt="" />
      <div class="van-uploader__preview-delete" @click.stop="deleteFile(index)">
        <i
          class="van-icon van-icon-cross van-uploader__preview-delete-icon"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview, Uploader, Loading } from 'vant'
import { computed, ref } from 'vue'
import { upload2Cos } from '@/api/upload'
import { __WX__ } from '@config'
import { dataURLtoFile } from '@util'
export default {
  name: 'OrderUpload',
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    modelValue: {
      type: Array,
      default () {
        return []
      }
    },
    slice: {
      type: [Number, String],
      default: 0
    },
    maxCount: {
      type: [Number, String],
      default: 100
    }
  },
  components: {
    [Uploader.name]: Uploader,
    [Loading.name]: Loading
  },
  data () {
    return {
      isWx: __WX__
    }
  },
  created () {},
  mounted () {},
  setup (props, { emit }) {
    const fileList = computed(() => props.modelValue)
    const showList = computed(() => {
      if (props.slice) {
        return fileList.value.slice(0, props.slice)
      }
      return fileList.value
    })
    // 文件上传
    const choseLen = ref(0)
    const uploadLen = ref(0)
    const onAfterRead = files => {
      if (Object.prototype.toString.call(files) === '[object Object]') {
        files = [files]
      }
      files = files.slice(0, props.maxCount - fileList.value.length) // 最多100张
      choseLen.value = files.length
      uploadLen.value = 0
      files.forEach(item => {
        const { file } = item
        upload2Cos('opcenter', file, res => {
          const imgUrl = res.data
          uploadLen.value++
          fileList.value.unshift({ imgUrl })
          emit('update:modelValue', fileList)
        })
      })
    }
    function handleViewImage (index) {
      ImagePreview({
        images: fileList.value.map(item => item.imgUrl),
        startPosition: index
      })
    }
    const deleteFile = index => {
      fileList.value.splice(index, 1)
      emit('update:modelValue', fileList)
    }

    // 微信上传
    const chooseImage = () => {
      // 最大100张
      if (fileList.value.length >= props.maxCount) {
        return
      }
      wx.chooseImage({
        count: props.multiple ? 9 : 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          var localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          console.log(localIds)
          localIds = localIds.slice(0, props.maxCount - fileList.value.length) // 最多100张
          choseLen.value = localIds.length
          uploadLen.value = 0
          // 获取图片信息 获取本地图片接口
          localIds.forEach(i => {
            wx.getLocalImgData({
              localId: i, // 图片的localID
              success: res => {
                console.log(res)
                var localData = res.localData // localData是图片的base64数据，可以用img标签显示
                // 图片base64转file
                const file = dataURLtoFile(localData, i + '.jpg')

                upload2Cos('opcenter', file, res => {
                  const imgUrl = res.data
                  uploadLen.value++
                  fileList.value.unshift({ imgUrl })
                  emit('update:modelValue', fileList)
                })
              }
            })
          })
        }
      })
    }
    return {
      uploadLen,
      choseLen,
      showList,
      fileList,
      onAfterRead,
      handleViewImage,
      deleteFile,
      chooseImage
    }
  },
  emits: ['update:modelValue']
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
// 上传文件
.upload-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-row-gap: 8px;
  grid-column-gap: calc((100% - 320px) / 3);
  position: relative;
}

.upload-loading {
  position: absolute;
  width: 80px;
  height: 80px;
  background-color: rgba(50, 50, 51, 0.88);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text-color-white);
  top: 0;
}
.van-image__img {
  object-fit: cover;
}
@media screen and (max-width: 321px) {
  .upload-container {
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: calc((100% - 240px) / 2);
  }
}

/deep/ .van-uploader__wrapper--disabled {
  opacity: 1;
}
</style>
