//需要给该组件出现的left和top
<template>
  <div @click.stop="stopPropagation" class="calendar" ref="calendar">
    <div class="calendar-top">
      <div class="calendar-time">{{ time }}</div>
      <div class="calendar-date">
        {{
          date.split("/")[0] +
          "年" +
          date.split("/")[1] +
          "月" +
          date.split("/")[2] +
          "日"
        }}
      </div>
    </div>
    <div class="calendar-content">
      <div class="calendar-operation">
        <span>{{ title }}</span>
        <div class="calendar-btn">
          <div class="up" @click="handleUp"></div>
          <div class="down" @click="handleDown"></div>
        </div>
      </div>
      <div class="calendar-wrapper">
        <ul class="week">
          <li class="week-item" v-for="(item, index) in week" :key="index">
            {{ item }}
          </li>
        </ul>
        <ul ref="pointWrapper" :class="['day', { up: up, down: down }]">
          <!-- 鼠标的光源点 -->
          <!-- <div ref="point" :class="['point', { in: pointPosition }]"></div> -->
          <li
            :class="[
              'day-item',
              {
                other: item.other,
                today:
                  item.today &&
                  item.month == date.split('/')[1] &&
                  item.year == date.split('/')[0],
                next: item.next,
                prev: item.prev,
              },
            ]"
            v-for="(item, index) in days"
            :key="index"
          >
            {{ item.day }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      time: "",
      date: "",
      week: ["日", "一", "二", "三", "四", "五", "六"],
      days: [],
      // {top, left}
      pointPosition: null,
      title: "",
      up: false,
      down: false,
    };
  },
  methods: {
    //禁止冒泡
    stopPropagation() {
      // console.log(e);
    },
    //
    handleMove() {
      // -15 padding-left
      // var x = e.pageX - this.$refs.calendar.offsetLeft - 15;
      // // -200上面部分内容
      // var y = e.pageY - this.$refs.calendar.offsetTop - 200;
      // this.pointPosition = {left : x , top : y};
      // this.$refs.point.style.top = this.pointPosition.top + "px";
      // this.$refs.point.style.left = this.pointPosition.left + "px";
      // console.log(this.pointPosition.left);
      // var curDay = e.target.innerText;
      // var other = e.target.className.indexOf("next");
    },
    handleOut(e) {
      var x = e.pageX - this.$refs.calendar.offsetLeft - 15;
      // -200上面部分内容
      var y = e.pageY - this.$refs.calendar.offsetTop - 200;
      var minX = 0;
      var minY = 0;
      var maxX = 370;
      var maxY = 310;
      if (x <= minX || y <= minY || x >= maxX || y >= maxY) {
        this.pointPosition = null;
      }
    },
    // 获得日历相关数据  总共要渲染42个格子 7 * 6
    getDays() {
      var date = new Date();
      // 从0开始算，当前的月份
      this.monthNow = date.getMonth();
      // 下一个月份
      this.nextMonth = this.monthNow + 1 == 12 ? 0 : this.monthNow + 1;
      this.year = date.getFullYear();
      // 通过年月来得出days的数据
      this.getDataByYearAndMonth();
      this.renderDays();
    },
    handleUp() {
      // 如果是1月，则跳到上一年的12月
      // 其他照常
      if (this.monthNow == 0) {
        this.year = this.year - 1;
        this.nextMonth = 0;
        this.monthNow = 11;
        this.dayNum = 31;
        this.weekIndex = new Date(this.year, this.monthNow, 1).getDay();
        this.preMonthDay = 31;
      } else {
        this.nextMonth--;
        this.monthNow--;
        this.getDataByYearAndMonth();
      }
      this.up = true;
      this.renderDays();
    },
    getDataByYearAndMonth() {
      // 得好好看看创建Date对象时传的参数
      // 获得当月的天数
      // nextMonth月1号，+0-1  得monthNow
      this.dayNum = new Date(this.year, this.nextMonth, 0).getDate();
      // 获得这个月第一天是周几(从1开始  +1-1，第0天)
      this.weekIndex = new Date(this.year, this.monthNow, 1).getDay();
      // 获得上个月最后一天(也就是上个月有几天)
      this.preMonthDay = new Date(this.year, this.monthNow, 0).getDate();
    },
    //跳到某一年的某一月
    jumpTo(month, year=this.year){
      this.monthNow = month;
      this.year = year;
      this.getDataByYearAndMonth();
      this.renderDays();
    },
    handleDown() {
      // 如果是12月，则跳到下一年的1月
      // 其他照常
      if (this.monthNow == 11) {
        this.year = this.year + 1;
        this.nextMonth = 1;
        this.monthNow = 0;
        this.dayNum = 31;
        this.weekIndex = new Date(this.year, this.monthNow, 1).getDay();
        this.preMonthDay = 31;
      } else {
        this.nextMonth++;
        this.monthNow++;
        this.getDataByYearAndMonth();
      }
      this.renderDays();
    },
    // 根据当前的showDays，weekIndex，preMonthDay，dayNum，date来渲染li数据
    renderDays() {
      // 设置li数据
      this.days = [];
      for (var i = 0; i < this.showDays; i++) {
        if (i < this.weekIndex) {
          this.days.push({
            day: this.preMonthDay + i + 1 - this.weekIndex,
            // 是否为其他月份
            other: true,
            // 是不是今天
            today: false,
            // 是否属于下一个月
            next: false,
            // 是否属于上一个月
            prev: true,
            month: this.monthNow + 1,
            year: this.year,
          });
        } else if (i - this.weekIndex < this.dayNum) {
          this.days.push({
            day: i + 1 - this.weekIndex,
            other: false,
            today: i + 1 - this.weekIndex == this.date.split("/")[2],
            next: false,
            prev: false,
            month: this.monthNow + 1,
            year: this.year,
          });
        } else {
          this.days.push({
            day: i - this.dayNum - this.weekIndex + 1,
            other: true,
            today: false,
            next: true,
            month: this.monthNow + 1,
            prev: false,
            year: this.year,
          });
        }
      }
      // this.up = false;
      // this.down = false;
      this.title = this.days[19].year + "年" + this.days[19].month + "月";
    },
    setTime() {
      var date = new Date();
      this.time = date.toTimeString().split(" ")[0];
      this.date = date.toLocaleString().split(" ")[0];
      setInterval(() => {
        var date = new Date();
        var time = date.toTimeString().split(" ")[0];
        var newDate = date.toLocaleString().split(" ")[0];
        if (time !== this.time) {
          this.time = time;
        }
        if (newDate !== this.date) {
          this.date = newDate;
        }
      }, 1000);
    },
    init() {
      this.showDays = 42; //总共渲染的天数
      this.setTime();
      this.getDays();
    },
  },
  mounted() {
    this.init();
  },
});
</script>

<style lang="less" scoped>
.calendar {
  width: 400px;
  background-color: #1c3d32;
  height: 520px;
  position: absolute;
  color: #eee;
  // 完全出来的bottom值
  bottom: 40px;
  // bottom: -480px;
  right: 0;
  &-time {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    font-size: 35px;
  }
  &-date {
    width: 100%;
    padding-left: 15px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  &-top {
    border-bottom: 1px solid #aaa;
    height: 109px;
  }
  &-content {
    padding: 15px;
    box-sizing: border-box;
    height: 410px;
  }
  &-operation {
    height: 25px;
    display: flex;
    justify-content: space-between;
    span {
      line-height: 25px;
      font-size: 15px;
    }
  }
  &-btn {
    width: 80px;
    height: 25px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    .up {
      cursor: pointer;
      width: 25px;
      height: 25px;
      background-image: url("../assets/arrow-up-bold.png");
      background-size: 100% 100%;
    }
    .down {
      width: 25px;
      cursor: pointer;
      height: 25px;
      background-image: url("../assets/arrow-down-bold.png");
      background-size: 100% 100%;
    }
  }
  &-wrapper {
    width: 370px;
    height: 340px;
    margin-top: 15px;
    text-align: center;
    //   box-sizing: border-box;
    .week {
      height: 25px;
      display: flex;
      line-height: 25px;
      justify-content: space-around;
      font-size: 12px;
      &-item {
        height: 25px;
        width: 52px;
      }
    }
    .day {
      position: relative;
      margin-top: 10px;
      height: 310px;
      width: 370px;
      // box-sizing: border-box;
      margin-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      &-item {
        margin-top: 1px;
        height: 50px;
        width: 50px;
        line-height: 50px;
        border: 1px solid transparent;
        // border: 1px solid #eee;
        box-sizing: border-box;
        &:hover {
          border: 1px solid #ccc;
        }
      }
    }
    .other {
      color: #999;
    }
    .today {
      background-color: #0f5353;
      border: 1px solid #333;
      width: 50px;
      width: 50px;
    }
    // .point {
    //   width: 0px;
    //   height: 0px;
    //   border-radius: 50%;
    //   // background-color: #000;
    //   position: absolute;
    //   // top: 0;
    //   // left: 0;
    // }
    // .in {
    //   box-shadow: 0px 0px 25px 25px #888888;
    // }
  }
}
</style>