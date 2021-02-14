<template>
  <div class="application-wrapper">
    <div class="header">
      <div class="left">
        <div class="page">
          <div class="title">{{ name }}</div>
          <img class="close" src="../assets/close.png" />
        </div>
      </div>
      <div class="operate">
        <div class="min"></div>
        <div class="normal"></div>
        <div class="close"></div>
      </div>
    </div>
    <iframe class="webpage" :src="webPage.url" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  props: ["name"],
  data() {
    return {
      webPage: {
        url: "",
      },
      dataMap: {
        个人博客: "http://www.jessyblog.cn/jessy/index",
        选课系统: "http://www.jessyblog.cn:8080",
      },
    };
  },
  watch: {
    name(newValue, oldValue) {
      if (newValue == oldValue) {
        return;
      } else {
        this.webPage.url = this.dataMap[newValue] ? this.dataMap[newValue] : "";
      }
    },
  },
  created() {
    this.webPage.url = this.dataMap[this.name] ? this.dataMap[this.name] : "";
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
        background: #fff;
        padding: 0 10px;
        width: 200px;
        display: flex;
        justify-content: space-between;
        align-items: center;
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
  }
}

</style>