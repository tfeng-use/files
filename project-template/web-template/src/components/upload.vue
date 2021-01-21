<template>
  <div class="upload">
    <div class="imgs" v-if="imgList && imgList.length">
      <div class="img-wrapper" v-for="(item, index) in imgList" :key="index">
        <img :src="item" alt />
        <div class="icons">
          <a-icon type="eye" class="icon" @click="handlePreview(index)" />
          <a-icon
            v-if="showDeleteIcon"
            type="delete"
            class="icon"
            @click.native="handleDelete(index)"
          />
          <a-icon
            v-if="showEditIcon"
            type="edit"
            class="icon"
            @click.native="handleUploadEdit(index)"
          />
        </div>
      </div>
    </div>
    <a-upload
      ref="upload"
      name="file"
      listType="picture-card"
      class="avatar-uploader"
      :class="[editClass]"
      :showUploadAddList="false"
      multiple
      v-show="showUploadAdd"
      :customRequest="uploadImage"
      :beforeUpload="beforeUpload"
      accept="image/jpeg, image/jpg, image/png"
    >
      <div v-if="imgList.length < maxLength">
        <a-icon type="plus" />
        <div class="ant-upload-text">{{ text }}</div>
      </div>
    </a-upload>
    <a-modal title :visible="visible" :footer="null" @cancel="cancel">
      <img class="inner-img" :src="currentImg" alt />
    </a-modal>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
import { ENV, mycloudInfo } from '@/js/config'
import { getTempCredential } from '@/js/api/upload'

/* eslint-disable */
getTempCredential({}, res => {
  mycloudInfo.bucket = res.data.bucket
  mycloudInfo.region = res.data.region
  mycloudInfo.urlPrefix = res.data.urlPrefix
})
const cos = new COS({
  getAuthorization: (options, callback) => {
    getTempCredential({}, res => {
      const credentials = res.data.credentials

      callback({
        TmpSecretId: credentials.tmpSecretId,
        TmpSecretKey: credentials.tmpSecretKey,
        XCosSecurityToken: credentials.sessionToken,
        ExpiredTime: res.data.expiredTime
      })
    })
  }
})

/* eslint-disable */
export default {
  name: 'upload',
  props: {
    maxLength: {
      type: Number,
      default: 3
    },
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    folder: {
      type: String,
      default: 'purchase'
    },
    text: {
      type: String,
      default: '上传图片'
    },
    showUploadAdd: {
      type: Boolean,
      default: true
    },
    showDeleteIcon: {
      type: Boolean,
      default: true
    },
    showEditIcon: {
      type: Boolean,
      default: false
    },
    otherProp: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // editClass: {
    //   type: String,
    //   default: 'avatar-uploader'
    // },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      imgList: [],
      visible: false,
      currentImg: '',
      count: 0,
      currentIndex: 0,
      isHidden: false,
      editClass: 'uploader' + Date.now().toString(32) // 这个属性在使用编辑功能的时候必须要传，帮助操作dom时进行定位，为了出错，尽量保持唯一
    }
  },
  methods: {
    uploadImage (file) {
      if (this.imgList.length >= this.maxLength) {
        return
      }
      this.upload(file.file)
    },
    async upload (files) {
      // this.$toast.loading('上传中', false, 0)
      // 如果file是数组
      if (Array.isArray(files)) {
        for (let i = 0; i < len; i++) {
          const file = files[i]
          this.$utils.fileToBase64(file).then(content => {
            // content是base64
            this.afterRead({ file, content })
          })
        }
      } else {
        this.afterRead({ file: files }, false)
      }
    },
    afterRead (file, needCompress) {
      let isImage
      let type = ''
      if (file.file && file.file.name) {
        type = file.file.name.split('.').pop()
      }
      if (file.file && file.file.type) {
        isImage = file.file.type.indexOf('image') > -1
      }
      const [date, time] = this.$utils
        .fmtdate(new Date(), 'yyyyMMdd hhmmss')
        .split(' ')
      const randomStr = Math.random()
        .toString(36)
        .substr(2, 6)
      const projectName = ENV === 'production' ? 'invest' : 'invest_' + ENV
      const key =
        projectName +
        '/' +
        this.folder +
        '/' +
        date +
        '/' +
        time +
        randomStr +
        '.jpg'
      // console.log('mycloudInfo.bucket', mycloudInfo.bucket)
      // console.log('mycloudInfo.region', mycloudInfo.region)
      cos.putObject(
        {
          Bucket: mycloudInfo.bucket,
          Region: mycloudInfo.region,
          Key: key,
          Body: file.file,
          onProgress: function () {}
        },
        err => {
          if (err) {
            return
          }
          if (this.imgList.length >= this.maxLength) {
            return
          }
          let url = `${mycloudInfo.urlPrefix}${key}`
          // 如果没有显示添加的icon，那么这儿就是编辑
          if (this.showEditIcon) {
            let obj = {
              url: url,
              index: this.currentIndex,
              ...this.otherProp
            }
            this.$emit('handleUploadEdit', obj)
            return
          }
          this.imgList.push(url)
        }
      )
    },
    beforeUpload (file) {
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.warning('只能上传jpg/png格式的头像!')
      }
      // const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isLt2M) {
      //   this.$message.error('图片不得大于2MB!')
      // }
      return isJpgOrPng
    },
    handleDelete (index) {
      this.imgList.splice(index, 1)
    },
    handlePreview (index) {
      this.visible = true
      this.currentImg = this.imgList[index]
    },
    cancel () {
      this.visible = false
    },
    handleUploadEdit (index) {
      this.currentIndex = index
      document.querySelector(`.${this.editClass} input`).click()
    }
  },
  watch: {
    imgList: {
      handler (val) {
        this.$emit('change')
        this.$emit('input', val)
      }
    },
    value: {
      immediate: true,
      handler (val) {
        this.imgList = val
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.upload {
  .imgs {
    display: inline-block;
    vertical-align: middle;
    .img-wrapper {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
      margin-bottom: 8px;
      &:hover {
        .icons {
          opacity: 1;
        }
      }
      .icons {
        position: absolute;
        left: 8px;
        top: 8px;
        width: 62px;
        z-index: 10;
        left: 50%;
        opacity: 0;
        transform: translate(-50%, -50%);
        top: 50%;
        color: #fff;
        width: calc(95px - 16px);
        height: calc(95px - 16px);
        transition: opacity 0.1s;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          margin-right: 10px;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    img {
      padding: 8px;
      width: 95px;
      height: 95px;
      border-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.15);
    }
  }
  .avatar-uploader {
    vertical-align: top;
    width: auto;
  }
  .isHidden {
    // visibility: hidden;
    opacity: 0;
  }
}
</style>
