<template>
  <div class="footer">
    <div class="begin"></div>
    <div class="right-content">
      <div class="time">
        <span>{{ time }}</span>
        <span>{{ date }}</span>
      </div>
      <span class="little-col"></span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      time: "12:00",
      date: "",
    };
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
  },
};
</script>
<style scoped>
.footer {
  width: 100%;
  height: 40px;
  background: #283732;
  position: absolute;
  bottom: 0px;
}
.begin {
  position: absolute;
  width: 50px;
  background: url("../assets/begin.png");
  background-position: 55px -6px;
  left: 0;
  height: 40px;
}
.begin:hover {
  background: url("../assets/beginhover.png");
  background-position: 55px -6px;
}
.right-content {
  display: flex;
  justify-content: flex-end;
  position: absolute;
  height: 40px;
  width: 150px;
  box-sizing: border-box;
  right: 0;
}
.right-content .time {
  display: flex;
  flex-direction: column;
  width: 80px;
  cursor: pointer;
  height: 40px;
  text-align: center;
}
.time span {
  width: 100%;
  line-height: 20px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
}
.time:hover {
  background: #3c4b46;
}
.right-content .little-col {
  width: 2px;
  height: 40px;
  display: inline-block;
  background: #aaa;
}
</style>