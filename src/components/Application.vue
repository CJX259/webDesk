<template>
  <div class="application-wrapper">
    <div class="header">
      <div class="left">
        <div
          v-for="(app, i) in apps"
          :key="i"
          :class="['page', { 'active': i === activeIndex }]"
          @click="changeActive(i)"
        >
          <div class="title">{{ app.title }}</div>
          <img class="close" @click.stop="closePage(i)" src="../assets/close.png" />
        </div>
      </div>
      <div class="operate">
        <div class="min"></div>
        <div class="normal"></div>
        <div class="close" @click="closeAllPage"></div>
      </div>
    </div>
    <div v-for="(page, index) in webPage" :key="index">
      <iframe
        v-show="index === activeIndex"
        class="webpage"
        :src="page"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  props: ["apps", 'clearApps', 'closePageByIndex', 'updateActive'],
  data() {
    return {
      dataMap: {
        个人博客: "http://www.jessyblog.cn/jessy/index",
        选课系统: "http://www.jessyblog.cn:8080",
      },
      activeIndex: 0,
    };
  },
  watch: {
    // 父组件通知子组件把activeIndex修改成最后一位
    updateActive() {
      this.activeIndex = this.apps.length - 1;
    }
  },
  methods: {
    changeActive(index) {
      this.activeIndex = index;
    },
    // 关闭网页页面
    // 最后一个问题：无论是什么情况，减去一个后再双击，都是不能切换active
    closePage(index){
      // 如果删除了activeIndex，就要选出下一个
      // apps没有了就触发close
      if(this.activeIndex === index){
        console.log("activeIndex = index喔");
        if(this.apps.length === 1){
          this.closeAllPage();
        } else{
          // this.activeIndex = this.activeIndex - 1;
          this.closePageByIndex(index);
          this.activeIndex === 0 ? "" : this.changeActive(this.activeIndex - 1);
        }
      }else{
        // 如果删除的不是activeIndex,就直接在数组中删除index;
        this.closePageByIndex(index);
        if(this.activeIndex > index) {
          this.changeActive(this.activeIndex - 1);
          console.log("active>index");
        }
        // 如果只有两个页面，active是0， 关闭1，出现问题：activeIndex=0，但无法正确显示active类(vue的标签判断失效)
        console.log(this.apps);
      }
    },
    // 关闭所有网页标签
    closeAllPage() {
      this.clearApps();
      this.activeIndex = 0;
    }
  },
  computed: {
    webPage() {
      let pageUrl = this.apps.map((app) => {
        return this.dataMap[app.title] ? this.dataMap[app.title] : "";
      });
      return pageUrl;
    },
  },
  created() {
  },
};
</script>

<style lang='less'>
.application-wrapper {
  position: relative;
  width: 1100px;
  height: 540px;
  left: 50%;
  top: 30px;
  transform: translateX(-50%);
  .header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: relative;
    padding-bottom: 3px;
    background: #ddd;
    &::after {
      position: absolute;
      content: "";
      width: 100%;
      height: 3px;
      background: #fff;
      bottom: 0;
    }
    .left {
      flex: 1;
      display: flex;
      padding-top: 4px;
      overflow: hidden;
      box-sizing: border-box;
      .page {
        /* min-width: 16px; */
        border-top-right-radius: 10px;
        margin-left: -2px;
        border-top-left-radius: 10px;
        color: #000;
        background: #eee;
        padding: 0 10px;
        width: 200px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &.active {
          background: #fff;
          z-index: 10;
        }
        &:nth-of-type(1) {
          margin-left: 7px;
        }
        .title {
          font-size: 12px;
          user-select: none;
        }
        .close {
          flex: 0 0 12px;
          padding: 1px;
          height: 12px;
          &:hover {
            background: #ccc;
            border-radius: 50%;
          }
        }
      }
    }
    .operate {
      flex: 0 0 150px;
      > div.min {
        background-image: url("../assets/min.png");
      }
      > div.normal {
        background-image: url("../assets/normal.png");
      }
      > div.close {
        background-image: url("../assets/close.png");
        &:hover {
          background-color: red;
          background-image: url("../assets/close_2.png");
        }
      }
      > div {
        width: 30px;
        height: 17px;
        padding: 10px;
        display: inline-block;
        transition: all 0.2s ease;
        background-repeat: no-repeat;
        background-size: 16px 16px;
        background-position: center center;
        &:hover {
          background-color: #ccc;
        }
      }
    }
  }
  .webpage {
    width: 100%;
    height: 600px;
    box-sizing: border-box;
  }
}
</style>