<template>
  <div class="home_page">
    <a-layout class="full_height">
      <a-layout-sider :trigger="null" collapsible v-model="collapsed">
        <div class="logo">
          <img class="p4" v-show="!collapsed" src="@assets/jchj-logo@2x.png" />
          <img class="p16" v-show="collapsed" src="@assets/logo.png" />
        </div>
        <!-- 菜单-->
        <template v-if="leftMenu.length">
          <a-menu
            theme="dark"
            mode="inline"
            :defaultSelectedKeys="defaultSelectedKeys"
            :defaultOpenKeys="defaultOpenKeys"
            v-model="defaultSelectedKeys"
            :openKeys.sync="defaultOpenKeys"
            @click="got2OtherPage"
          >
            <template v-for="(menu, index) in leftMenu">
              <a-sub-menu
                :key="index + ''"
                v-if="menu.children && menu.children.length"
              >
                <span slot="title">
                  <a-icon :type="menu.icon" />
                  <span class="nav_span">{{ menu.name }}</span>
                </span>
                <a-menu-item
                  :key="`${subMenu.router}`"
                  class="left-menu--item"
                  flex="cross:center main:justify"
                  v-for="subMenu in menu.children"
                >
                  <span>{{ subMenu.name }}</span>
                  <a-badge
                    v-if="subMenu.count"
                    :count="subMenu.count"
                    :overflowCount="99"
                  ></a-badge>
                  <a-icon
                    type="star"
                    theme="filled"
                    class="fs16 fr menu-icon"
                    @click.stop="handleCollection(subMenu)"
                  />
                </a-menu-item>
              </a-sub-menu>
              <a-menu-item :key="menu.router" class v-else>
                <a-icon :type="menu.icon"></a-icon>
                <span class="nav_span">{{ menu.name }}</span>
              </a-menu-item>
            </template>
          </a-menu>
        </template>

        <!--菜单结束-->
      </a-layout-sider>
      <a-layout>
        <!--头部-->
        <a-layout-header
          style="background: #fff; padding: 0 24px"
          flex="dir:left"
        >
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
          <!--导航-->
          <section flex-box="1"></section>
          <!--导航结束-->

          <!-- 用户 -->
          <section class="header-user">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item key="2" @click="loginOut">
                  <a-icon type="poweroff" />登出
                </a-menu-item>
              </a-menu>
              <div>
                <a-avatar icon="user" class="mr4" />
                <span>{{ investUser.userInfo.nickName }}</span>
                <a-icon type="caret-down" class="fs12" />
              </div>
            </a-dropdown>
          </section>
          <!-- 用户结束 -->
        </a-layout-header>
        <!--内容-->
        <a-layout-content
          flex="dir:top"
          :style="{ position: 'relative', overflow: 'hidden' }"
        >
          <!--面包屑-->
          <div class="breadcrumb-box">
            <a-breadcrumb>
              <template v-for="(item, index) in getBreadcrumb">
                <a-breadcrumb-item :key="index" v-if="item">
                  <!-- <a-icon v-if="item.icon" :type="item.icon" /> -->
                  <span @click="goRoute(item, index)">{{ item.name }}</span>
                </a-breadcrumb-item>
              </template>
            </a-breadcrumb>
          </div>
          <div
            class="route-contain"
            :class="{ is_bg_not_white: $route.path === '/' }"
            :style="{ overflow: 'hidden' }"
            flex-box="1"
          >
            <router-view />
            <slide-web v-model="showSlide" @back="onSlideBack">
              <slide-component></slide-component>
            </slide-web>
          </div>
          <div id="content-loading"></div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import bus from '@bus'
import cookie from '@js/cookie'
import slideComponent from '@views/common/slideComponent'
import socket from '@js/socket.js'
import { SOCKET_URL } from '@js/config.js'
import { determineOpeningOrClosing, getGoldPrice } from '@api/goldPrice'
export default {
  name: 'Index',
  components: {
    slideComponent
  },
  created () {
    // 获取目录
    this.getLeftMenu()
    this.initSocket()
    this.determineOpeningOrClosing()
    bus.$on('updateMenuCount', () => {
      this.getAuditWaitCount(this.leftMenu)
    })
    bus.$on('refreshLeftMenu', path => {
      const leftMenu = this.leftMenu
      this.initMenu(leftMenu, path)
    })
    bus.$on('go2page', item => {
      this.menuChange(item)
    })
    this.loopRequest(this.$route.path)
  },
  beforeDestroy () {
    bus.$off('updateMenuCount')
    bus.$off('refreshLeftMenu')
    clearInterval(this.isOpenSaleInterval)
  },
  data () {
    return {
      collapsed: false,
      showContentLoading: false,
      defaultSelectedKeys: [], // 侧边栏默认选中
      defaultOpenKeys: [], // 侧边栏默认展开
      investUser: this.$storage.get('investUser'),
      isOpenSaleInterval: '',
      continueGetPrice: true,
      needLoopRequestRoutes: ['/quote'] // 需要循环请求的路由
    }
  },
  methods: {
    ...mapActions({
      updateBreadcrumb: 'updateBreadcrumb',
      updateSlideComponent: 'updateSlideComponent',
      updateCurrentMenu: 'updateCurrentMenu',
      updateLeftMenu: 'updateLeftMenu',
      clearStore: 'clearStore',
      updateUserInfo: 'updateUserInfo',
      updateIsOpenSale: 'updateIsOpenSale'
    }),
    loginOut () {
      this.clearStore()
      cookie.removeItem('accessToken')
      cookie.removeItem('x-token')
      cookie.removeItem('userCode')
      cookie.removeItem('companyCode')
      this.$storage.remove('investUser')
      this.$message.success('您已退出系统')
      bus.$emit('socket_close')
      this.$router.replace('/login')
    },
    toggleCollapsed () {
      this.collapsed = !this.collapsed
    },
    initSocket () {
      socket.init(SOCKET_URL, () => {
        bus.$emit('socket_send', {
          id: this.$storage.get('investUser').company.companyCode,
          code: 1,
          token: 'junit:test',
          type: 1
        })
      })
      bus.$on('socket_on_msg', res => {})
    },
    getLeftMenu () {
      const allMenus = this.investUser.permissions
      this.initMenu(allMenus, this.$route.path)

      this.updateLeftMenu(JSON.parse(JSON.stringify(allMenus)))
    },
    initMenu (leftMenu, to) {
      let path = to || this.$route.path
      // console.log(leftMenu[0])
      const firstMenuPath =
        leftMenu[0].children.length !== 0
          ? leftMenu[0].children[0].router
          : leftMenu[0].router

      path = path === '/' ? firstMenuPath : path
      // console.log(path)
      // 递归查找  对应menu与父index
      const menu = this.findMenu(path, leftMenu)
      // console.log(menu)
      const { currentMenu, parentIndex } = menu
      this.defaultOpenKeys = [parentIndex + '']
      this.defaultSelectedKeys = [path]
      // 返回就可以不用再调用路由 有to的时候
      if (!to) {
        this.$router.replace(currentMenu.router)
      }
      // vuex设置当前默认menu
      this.updateCurrentMenu(currentMenu)
      // 添加当前面包屑
      this.updateBreadcrumb({
        type: to ? 'replace' : 'push',
        item: currentMenu
      })
    },
    // path:当前路由  menuArr:目录  index:父元素index
    findMenu (path, menuArr, index) {
      // 返回值
      let options = {
        currentMenu: {},
        parentIndex: undefined
      }
      for (let i = 0, len = menuArr.length; i < len; i++) {
        const item = menuArr[i]
        if (item.children && item.children.length) {
          options = this.findMenu(path, item.children, i)
          // 如果options里有值已经找到直接return
          if (options.currentMenu && options.currentMenu.router) {
            return options
          }
        }
        // 如果找到路由返回父 index
        if (path == item.router) {
          return {
            currentMenu: item,
            parentIndex: index || 0
          }
        }
      }
      return options
    },
    handleCollection (subMenu) {
      return subMenu
    },
    got2OtherPage (item) {
      if (item && item.key) {
        this.$router.push(item.key)
      } else {
        if (this.leftMenu.length && this.leftMenu[0].router) {
          this.$router.push({ path: this.leftMenu[0].router })
        }
      }
    },
    menuChange (item) {
      if (item.key === '#') {
        return false
      }
      // 根据key递归查找当前目录
      const menu = this.findMenu(item.key, this.leftMenu)
      const { currentMenu } = menu

      // vuex设置当前默认menu
      this.updateCurrentMenu(currentMenu)
      // 更新面包屑
      this.updateBreadcrumb({
        type: 'replace',
        item: {
          id: item.key,
          name: currentMenu.name
        }
      })
    },

    goRoute (item, index) {
      // this.$router.push(item.path)
      if (this.getBreadcrumb.length === 1) {
        return false
      }
      this.updateBreadcrumb({
        type: 'goTo',
        index: index
      })
    },
    // 滑动组件返回
    onSlideBack () {
      // 更新面包屑
      this.updateBreadcrumb({ type: 'back' })
    },
    loopRequest (path) {
      if (this.needLoopRequestRoutes.indexOf(path) > -1) {
        this.isOpenSaleInterval = setInterval(() => {
          this.determineOpeningOrClosing()
        }, 1000)
      } else {
        clearInterval(this.isOpenSaleInterval)
      }
    }
  },
  watch: {
    // 当选中菜单变化通知更新左侧菜单 用在页面中更新菜单
    currentMenu: {
      deep: true,
      handler (value) {
        if (value && (value.count || parseInt(value.count) === 0)) {
          this.leftMenu.forEach(item => {
            if (item.children.length != 0) {
              item.children.forEach((inner, index) => {
                if (inner.name === value.name) {
                  item.children[index] = value
                }
              })
            }
          })
          const leftMenu = JSON.parse(JSON.stringify(this.leftMenu))
          this.updateLeftMenu(leftMenu)
        }
      }
    },
    $route: function (to, from) {
      this.loopRequest(to.path)
    }
  },
  computed: {
    ...mapGetters([
      'getBreadcrumb',
      'currentCrumb',
      'leftMenu',
      'currentMenu',
      'slideComponent',
      'userInfo',
      'isOpenSale'
    ]),
    // 滑动组件
    showSlide () {
      return Boolean(this.currentCrumb)
    }
  }
}
</script>

<style lang="less">
.logo {
  height: 63px;
  line-height: 63px;
  text-align: center;
  img {
    height: 100%;
    vertical-align: middle;
  }
}
.left-menu--item {
  .menu-icon {
    transition: all 0.3s;
    opacity: 0;
    transform: scale(0.7);
  }
  &.favorite,
  &:hover {
    .menu-icon {
      transition: all 0.3s;
      opacity: 1;
      transform: scale(1);
    }
  }
}
.route-contain {
  margin: 0 24px;
  padding: 24px 24px 0 24px;
  background: #fff;
  position: relative;
}
.is_bg_not_white {
  background-color: #f0f2f5;
  padding: 0;
}
.trigger {
  line-height: 64px;
}
.header-user {
  cursor: pointer;
}
.breadcrumb-box {
  margin: 16px 24px 12px;
  height: 21px;
  .ant-breadcrumb-link {
    cursor: pointer;
  }
}
</style>
