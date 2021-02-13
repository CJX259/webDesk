<template>
  <div class="application-wrapper">
    <div class="header">
      <div class="left">
        <div class="page">
          <div class="title">{{ name }}</div>
          <img class="close" src="../assets/close.png" />
        </div>
        <div class="page">
          <div class="title">{{ name }}</div>
          <img class="close" src="../assets/close.png" />
        </div>
      </div>
      <div class="operate"></div>
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

<style>
.application-wrapper {
  position: relative;
  width: 1100px;
  height: 540px;
  left: 50%;
  top: 30px;
  transform: translateX(-50%);
}
.application-wrapper .header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  position: relative;
  padding-bottom: 3px;
  background: #ddd;
}
.application-wrapper .header::after{
  position: absolute;
  content: '';
  width: 100%;
  height: 3px;
  background: #fff;
  bottom: 0;
}
.application-wrapper .header .left {
  flex: 1;
  display: flex;
  padding-top: 4px;
  overflow: hidden;
  box-sizing: border-box;
}

.application-wrapper .header .page:nth-of-type(1){
  margin-left: 7px;
}
.application-wrapper .header .page {
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
}
.application-wrapper .header .page .title{
  font-size: 12px;
  user-select: none;
}
.application-wrapper .header .page .close{
  flex: 0  0 14px;
  padding: 1px;
  height: 14px;
}
.application-wrapper .header .page .close:hover{
  background: #ccc;
  border-radius: 50%;

}
.application-wrapper .header .operate {
  flex: 0 0 100px;
  background: red;
}
.application-wrapper .webpage {
  width: 100%;
  height: 600px;
}
</style>