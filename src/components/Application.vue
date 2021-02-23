<template>
  <div
    class="application-wrapper"
    :class="{ active: this.activeWrapper == name, max: this.max }"
    @click="changeActiveWrapper(name)"
    :ref="wrapperRefName"
  >
    <div class="header" @dblclick="changeMax(!max, name)" @mousedown="onMousedown($event)" @mouseup="onMouseup">
      <div class="left" @drag.prevent="onDrag">
        <div
          v-for="(app, i) in apps"
          :key="i"
          :class="['page', { active: i === activeIndex }]"
          @click.stop="changeActive(i)"
        >
          <div class="title">{{ app.title }}</div>
          <img
            class="close"
            @click.stop="closePage(i)"
            src="../assets/close.png"
          />
        </div>
      </div>
      <div class="operate">
        <div class="min" @click.stop="changeSmallWrapper('add', name)"></div>
        <div class="normal" @click="changeMax(!max, name)"></div>
        <div class="close" @click.stop="closeAllPage"></div>
      </div>
    </div>
    <div
      class="content"
      v-show="index === activeIndex"
      v-for="(data, index) in renderData"
      :key="index"
    >
      <div class="cover" v-if="mouseDown || activeWrapper !== name"></div>
      <!-- <iframe class="webpage" :src="data"></iframe> -->
      <div class="webpage">
        <!-- 写完后端后，这里只传index即可 -->
        <slot :data="(data)" ></slot>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: [
    "apps",
    "clearApps",
    "closePageByIndex",
    "updateActive",
    "activeWrapper",
    "changeActiveWrapper",
    "changeSmallWrapper",
    "max",
    "changeMax",
    // name是打开的格式（chrome, txt）
    "name",
    "iconsData"
  ],
  computed:{
    wrapperRefName(){
      return this.name + 'Wrapper';
    },
    renderData() {
      console.log(this.dataMap);
      let render = this.apps.map((app) => {
        return this.dataMap[app.title] ? this.dataMap[app.title] : "";
      });
      return render;
    },
  },
  data() {
    return {
      dataMap: {},
      activeIndex: 0,
      mouseDown: false,
      // 处理拖拽事件
      disX: 0,
      disY: 0,
    };
  },
  watch: {
    // 父组件通知子组件把activeIndex修改成最后一位
    updateActive() {
      this.activeIndex = this.apps.length - 1;
    },
  },
  methods: {
    // 无实际作用，用于阻止pageDom产生的drag事件，导致移动header失败
    onDrag() {},
    onMousedown(e) {
      this.mouseDown = true;
      this.disX = e.pageX - this.$refs[this.wrapperRefName].getClientRects()[0].left;
      this.disY = e.pageY - this.$refs[this.wrapperRefName].getClientRects()[0].top;
      // 给document注册move事件
      document.onmousemove = (e) => {
        const appWrapperDom = this.$refs[this.wrapperRefName];
        if (!this.mouseDown || appWrapperDom.className.includes("max")) {
          return;
        }
        let left = e.pageX - this.disX;
        let top = e.pageY - this.disY;
        appWrapperDom.style.left = left + "px";
        appWrapperDom.style.top = top + "px";
      };
      document.onmouseup = () => {
        this.mouseDown = false;
        this.disX = 0;
        this.disY = 0;
      };
    },
    onMouseup() {},
    changeActive(index) {
      this.activeIndex = index;
    },
    // 关闭网页页面
    // 最后一个问题：无论是什么情况，减去一个后再双击，都是不能切换active
    closePage(index) {
      // 如果删除了activeIndex，就要选出下一个
      // apps没有了就触发close
      if (this.activeIndex === index) {
        if (this.apps.length === 1) {
          this.closeAllPage();
        } else {
          // this.activeIndex = this.activeIndex - 1;
          this.closePageByIndex(index, this.name);
          this.activeIndex === 0 ? "" : this.changeActive(this.activeIndex - 1);
        }
      } else {
        // 如果删除的不是activeIndex,就直接在数组中删除index;
        this.closePageByIndex(index, this.name);
        if (this.activeIndex > index) {
          this.changeActive(this.activeIndex - 1);
        }
      }
    },
    // 关闭所有网页标签
    closeAllPage() {
      this.clearApps(this.name);
      this.activeIndex = 0;
    },
    // 最大化或正常
    resize() {
      if (this.$refs[this.wrapperRefName].className.includes("max")) {
        this.$refs[this.wrapperRefName].setAttribute("class", "application-wrapper");
      } else {
        this.$refs[this.wrapperRefName].setAttribute("class", "max application-wrapper");
      }
      // console.log(this.$refs.appWrapper.classList) ;
    },
  },
  async created(){
    // let resp;
    if(this.name === 'txt'){
      // txt,则遍历所有iconsData，请求read对应名字的文件，保存在data中
      this.iconsData.forEach(async icon=>{
        const resp = await axios.get("/api/txt/read", {
          params:{
            filename: icon.name,
          }
        });
        if(resp.status === 200){
          // 给dataMap新设置的属性设置响应式
          this.$set(this.dataMap, icon.name, resp.data.data.msg);
        }
      })
    }else if(this.name === 'chrome'){
      // 不用一个个拿
      const resp = await axios.get('/api/project/getmap');
      if(resp.status === 200){
        resp.data.data.forEach(item=>{
          this.$set(this.dataMap, item.name, item.address);
        })
      }
    }
    // console.log(this.dataMap);

  }
};
</script>

<style lang="less" scoped>
.application-wrapper {
  position: absolute;
  width: 1100px;
  height: 540px;
  overflow: hidden;
  left: calc(50% - 550px);
  z-index: 10;
  top: 30px;
  // border: 1px solid #000;
  box-shadow: 1px 1px 3px 1px #000;
  // margin-left: -550px;
  transition: all 0.03s linear;
  &.active{
    z-index: 20;
  }
  &.max {
    width: 100%;
    height: calc(100% - 40px);
    // height: 100%;
    left: 0 !important;
    top: 0 !important;
    margin-left: 0;
  }
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
          user-select: none;
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
        background-size: 12px 12px;
        background-position: center center;
        &:hover {
          background-color: #ccc;
        }
      }
    }
  }
  .content {
    height: calc(100% - 40px);
    position: relative;
    .webpage {
      width: 100%;
      // height: 600px;
      height: 100%;
      box-sizing: border-box;
      background-color: #eee;
      >textarea{
        width: 100%;
        border: none;
        line-height: 20px;
        height: 100%;
        resize:none;
        box-sizing: border-box;
        padding: 10px;
        outline: none;
      }
    }
    .cover {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
}
</style>