<template>
  <div class="footer">
    <div class="begin"></div>
    <div class="left-content">
      <div
        :class="['bottom-icon', { active: i === bottomActive }]"
        v-for="(icon, i) in iconUrl"
        :key="i"
        @click="clickBottom(icon.type, i)"
      >
        <img :src="icon.imgUrl" />
      </div>
    </div>
    <div class="right-content">
      <div class="time" @click.stop="changeCalendar">
        <span>{{ time }}</span>
        <span>{{ date }}</span>
      </div>
      <span class="little-col"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["changeCalendar", "bottomIcons", "bottomActive", "clickBottom"],
  data() {
    return {
      time: "12:00",
      date: "",
      // 传入的格式和图标映射
      dataMap: {
        txt: require("../assets/记事本.png"),
        chrome: require("../assets/Chrome.png"),
      },
    };
  },
  computed: {
    iconUrl() {
      var temp = this.bottomIcons.map((icon) => {
        if (this.dataMap[icon]) {
          return { type: icon, imgUrl: this.dataMap[icon] };
        }
      });
      return temp;
    },
  },
  methods: {
    setTime() {
      var time = new Date().toTimeString().split(" ")[0];
      this.time = time;
      this.date = new Date().toLocaleString().split(" ")[0];
      setInterval(() => {
        var time = new Date().toTimeString().split(" ")[0];
        var date = new Date().toLocaleString().split(" ")[0];
        if (time !== this.time) {
          this.time = time;
        }
        if (date !== this.date) {
          this.date = date;
        }
      }, 1000);
    },
  },
  mounted() {
    this.setTime();
    console.log(this.iconUrl);
  },
};
</script>
<style lang="less" scoped>
.footer {
  width: 100%;
  height: 40px;
  background: #283732;
  position: absolute;
  bottom: 0px;
  .begin {
    position: absolute;
    width: 50px;
    background: url("../assets/begin.png");
    background-position: 55px -6px;
    left: 0;
    height: 40px;
    &:hover {
      background: url("../assets/beginhover.png");
      background-position: 55px -6px;
    }
  }
  .left-content {
    position: absolute;
    left: 50px;
    right: 150px;
    height: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .bottom-icon {
      margin-right: 3px;
      flex-basis: 24px;
      padding: 6px 13px 8px 13px;
      height: 24px;
      border-bottom: 2px solid #008c8c;
      > img {
        width: 24px;
        height: 24px;
      }
      &:hover {
        background-color: #3c4b46;
      }
      &.active {
        background-color: #2e574b;
      }
    }
  }
  .right-content {
    display: flex;
    justify-content: flex-end;
    position: absolute;
    height: 40px;
    width: 150px;
    box-sizing: border-box;
    right: 0;
    user-select: none;
    .time {
      display: flex;
      flex-direction: column;
      width: 80px;
      cursor: pointer;
      height: 40px;
      text-align: center;
      span {
        width: 100%;
        line-height: 20px;
        color: #fff;
        display: inline-block;
        font-size: 12px;
      }
      &:hover {
        background: #3c4b46;
      }
    }
    .little-col {
      width: 2px;
      height: 40px;
      display: inline-block;
      background: #aaa;
    }
  }
}
</style>