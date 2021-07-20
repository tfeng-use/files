<template>
  <div class="upload-container">
    <div flex="wrap:wrap">
      <div
        class="item-image van-uploader__preview-image"
        v-for="(file, index) in showList"
        :key="index"
        @click.stop="handleViewImage(index)"
      >
        <img class="van-image__img" :src="file" alt="" />
        <div
          v-if="!isDisable"
          class="van-uploader__preview-delete"
          @click.stop="deleteFile(index)"
        >
          <i
            class="van-icon van-icon-cross van-uploader__preview-delete-icon"
          ></i>
        </div>
      </div>
      <div
        class="van-uploader__upload item-image"
        style="position: relative"
        @click="handleUpload"
        v-if="fileList.length < maxCount && !isDisable"
      >
        <i class="van-icon van-icon-photograph van-uploader__upload-icon" />
        <div
          class="upload-loading fs12"
          v-if="uploadLoading"
          flex="cross:center main:center dir:top"
        >
          <van-loading />
          <span>上传中...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview, Uploader, Loading } from 'vant'
import { computed } from 'vue'
import { useUpload } from '@/composables/useUpload'
export default {
  name: 'Upload',
  props: {
    featureName: {
      type: String,
      default: 'order'
    },
    isDisable: {
      type: Boolean,
      default: false
    },
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
  setup (props, { emit }) {
    const fileList = computed(() => props.modelValue)
    const showList = computed(() => {
      if (props.slice) {
        return fileList.value.slice(0, props.slice)
      }
      return fileList.value
    })
    // 图片上传
    const { upload, loading: uploadLoading } = useUpload({
      featureName: props.featureName,
      multiple: props.multiple
    })
    function handleUpload () {
      console.log('点击上传')
      upload().then(files => {
        // 当一次性选择很多个的时候，只保留maxCount个
        let arr = [...fileList.value, ...files]
        arr = arr.slice(0, props.maxCount)
        emit('update:modelValue', arr)
      })
    }
    // 预览
    function handleViewImage (index) {
      ImagePreview({
        images: fileList.value,
        startPosition: index
      })
    }
    function deleteFile (index) {
      const list = [...fileList.value]
      list.splice(index, 1)
      emit('update:modelValue', list)
    }
    return {
      showList,
      fileList,
      uploadLoading,
      handleViewImage,
      deleteFile,
      handleUpload
    }
  },
  emits: ['update:modelValue']
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
// 上传文件
.upload-container {
  position: relative;
}

.upload-loading {
  position: absolute;
  width: 80px;
  height: 80px;
  background-color: rgba(50, 50, 51, 0.88);
  color: var(--text-color-white);
  top: 0;
}
.item-image {
  margin-right: 8px;
  margin-bottom: 8px;
  position: relative;
  // &:nth-child(3n) {
  //   margin-right: 0;
  // }
}
.van-image__img {
  object-fit: cover;
}
</style>
