<template>
  <div id="home" @click="contentClick">
    <!-- 此处要做一个栅格，透明背景 -->
    <!-- 当 -->
    <div class="wrapper">
      <ul
        class="col"
        v-for="(col, index) in icons"
        :class="{ last: index == icons.length - 1 }"
        :key="index"
      >
        <li
          v-for="(item, i) in col"
          :key="i"
          @click="clickIcon"
          @dragend="handleDragEnd"
          @dragstart="handleDragStart"
        >
          <Icon
            :imgUrl="item.img"
            :title="item.title"
            :handleClick="clickIcon"
            :active="item.active"
          />
        </li>
      </ul>
    </div>
    <transition name="downClose">
      <template v-if="showCalendar">
        <Calendar />
      </template>
    </transition>
    <transition v-if="app.title">
      <Application :name="app.title" />
    </transition>
    <Footer :changeCalendar="rightCalendar" />
  </div>
</template>
<script>
import Icon from "./Icon";
import Footer from "./Footer";
import Calendar from "./Calendar";
import Application from "./Application";

export default {
  components: {
    Footer,
    Icon,
    Calendar,
    Application,
  },
  data() {
    return {
      // 图标管理所需变量
      icons: [[]],
      colLength: 8,
      wrapperLength: 0,
      preX: 0,
      preY: 0,
      home: null,
      // 进行拖拽的图标坐标，从零开始
      dragIconIndex: null,
      // 被替换的图标
      replaceIconIndex: null,
      // 第几个图标拖拽（从1开始）
      dragIconNum: 0,
      replaceIconNum: 0,
      // 被替换的图标的链表对线
      replaceNode: null,
      dragNode: null,
      // 前一个节点
      prevReplaceNode: null,
      prevDragNode: null,

      // 管理日历变量
      showCalendar: false,

      // 管理打开程序变量
      // 双击点开的app
      app: {},
      // 监听双击的监听器
      doubleClickListen: null,
    };
  },
  methods: {
    // 改变日历展示
    // 点击右下角
    rightCalendar() {
      this.showCalendar = !this.showCalendar;
    },
    contentClick() {
      if (this.showCalendar) {
        this.showCalendar = false;
        return;
      }
    },
    // 处理拖拽图标事件的end
    handleDragEnd(e) {
      if (!this.dragIconIndex) {
        return;
      }
      var x = 1;
      var y = 1;
      //   padding-right：3px
      var iconWidth = 60 + 3;
      //   margin-bottom：3px
      var iconHeight = 65 + 3;
      // padding-left:5
      while (e.clientX >= x * iconWidth + 5) {
        x++;
      }
      // padding-top:5
      while (e.clientY >= y * iconHeight + 5) {
        y++;
      }
      // 判断是否拉到最后一个节点后面
      var lastFlag =
        this.icons[x - 1][y - 1] && this.icons[x - 1][y - 1].title == "";
      this.replaceIconIndex = { x: x - 1, y: y - 1 };
      this.replaceIconNum =
        this.replaceIconIndex.x * this.colLength + this.replaceIconIndex.y + 1;
      // 通过index拿到是一维数组中的第几个数据
      // 再遍历链表找到该数据，进行处理(从1开始)
      this.dragIconNum =
        this.dragIconIndex.x * this.colLength + this.dragIconIndex.y + 1;

      // 遍历链表
      var iconList = this.home;
      var curIndex = 0;
      // 因为Num是从1开始，所以-1 ，因为要先拿到prev指针，所以要再-1（如果是第一个就没有prev）
      var noPrev = false;
      while (iconList.next && curIndex != this.replaceIconNum - 2) {
        if (this.replaceIconNum - 1 == 0) {
          noPrev = true;
          break;
        }
        iconList = iconList.next;
        curIndex++;
      }
      if (!noPrev) {
        this.prevReplaceNode = iconList;
        iconList = iconList.next;
      }
      this.replaceNode = iconList;
      // 如果拉到的是最后一个，直接赋值prevReplaceNode为最后一个节点
      if (lastFlag) {
        var temp = this.home;
        while (temp.next) {
          temp = temp.next;
        }
        this.prevReplaceNode = temp;
      }

      iconList = this.home;
      curIndex = 0;
      noPrev = false;
      while (iconList.next && curIndex != this.dragIconNum - 2) {
        if (this.dragIconNum - 1 == 0) {
          noPrev = true;
          break;
        }
        iconList = iconList.next;
        curIndex++;
      }

      if (!noPrev) {
        this.prevDragNode = iconList;
        iconList = iconList.next;
      }
      this.dragNode = iconList;
      // 出bug后this.dragNode为null
      // 进行插入操作
      this.insertIcon(lastFlag);
    },
    // 插入那个拖拽的图标,实现这个貌似需要prev指针
    insertIcon(lastFlag) {
      if (this.dragNode === this.replaceNode) {
        return;
      }
      var upToDownFlag = this.prevReplaceNode === this.dragNode;
      // 向下一位替换，单独处理
      if (upToDownFlag) {
        // 拖拽第一个图标
        if (!this.prevDragNode) {
          this.home = this.replaceNode;
          this.dragNode.next = this.replaceNode.next;
          this.replaceNode.next = this.dragNode;
        } else {
          this.prevDragNode.next = this.replaceNode;
          this.dragNode.next = this.replaceNode.next;
          this.replaceNode.next = this.dragNode;
        }
        // 处理完后要把所有拖拽方面的信息清空
        this.initDrag();
        // 重新渲染数据
        this.renderDataFromHomeList();
        return;
      }
      if (this.prevDragNode) {
        // 处理插入节点的前一个节点
        this.prevDragNode.next = this.dragNode.next;
      } else {
        // 拖拽第一个图标的情况
        // 把第二个节点换成第一个
        var temp = this.home;
        this.home = temp.next;
      }

      if (this.prevReplaceNode) {
        // 处理被替换节点的前一个节点
        this.prevReplaceNode.next = this.dragNode;
        this.dragNode.next = lastFlag ? null : this.replaceNode;
      } else {
        // 插入到第一个的情况
        // 把插入的节点作为第一个节点
        this.dragNode.next = this.home;
        this.home = this.dragNode;
      }
      // 处理完后要把所有拖拽方面的信息清空
      this.initDrag();
      // 重新渲染数据
      this.renderDataFromHomeList();
    },
    // 打印home链表
    readHome() {
      var node = this.home;
      while (node.next) {
        console.log(node.title);
        node = node.next;
      }
      console.log(node.title);
    },
    // 初始化拖拽事件的数据
    initDrag() {
      this.dragIconIndex = null;
      this.replaceIconIndex = null;
      this.dragIconNum = 0;
      this.replaceIconNum = 0;
      this.replaceNode = null;
      this.dragNode = null;
      this.prevReplaceNode = null;
      this.prevDragNode = null;
    },
    // 处理拖拽图标事件的start
    handleDragStart(e) {
      var x = 1;
      var y = 1;
      //   padding-right：3px
      var iconWidth = 60 + 3;
      //   margin-bottom：3px
      var iconHeight = 65 + 3;
      // padding-left:5
      while (e.clientX >= x * iconWidth + 5) {
        x++;
      }
      // padding-top:5
      while (e.clientY >= y * iconHeight + 5) {
        y++;
      }
      if (this.icons[x - 1][y - 1].title != "") {
        this.dragIconIndex = { x: x - 1, y: y - 1 };
      }
    },
    // 通过链表赋值出icons数据，直接渲染到页面上
    renderDataFromHomeList() {
      // this.readHome();
      var iconNode = null;
      // 是否到最后一个的标记
      // 防止因为其他情况导致break(实现了只有最后一个才能break)
      var out = false;
      for (var x = 0; x < this.wrapperLength; x++) {
        if (x == 0) {
          iconNode = this.home;
        }
        for (var y = 0; y < this.colLength; y++) {
          this.icons[x][y].title = iconNode.title;
          this.icons[x][y].img = iconNode.img;
          // 到链表最后一个了
          if (!iconNode.next) {
            out = true;
            break;
          }
          // bug  高度限制再多一个，会消失
          // 因为它进了这里
          // 解决方法：加out变量进行标记
          iconNode = iconNode.next;
        }
        // bug在这里判断出去了
        if (out) {
          break;
        }
      }
    },
    // 这个函数被取代了
    renderWrapper(titles, imgUrls) {
      var col = titles.length;
      for (var x = 0; x < col; x++) {
        if (this.wrapperLength <= x) {
          // 越界了,超过了屏幕的宽度
          throw new Error("数据超出屏幕宽度");
        }
        var row = titles[x].length;
        for (var y = 0; y < row; y++) {
          if (y >= this.colLength) {
            // 越界，超过屏幕高度
            throw new Error("数据超出屏幕高度");
          }
          if (!titles[x][y] || !imgUrls[x][y]) {
            throw new Error("标题与图标数据不匹配");
          } else {
            this.icons[x][y].title = titles[x][y];
            this.icons[x][y].img = imgUrls[x][y];
          }
        }
      }
    },
    // 根据屏幕尺寸计算出x，y的最大值
    // 再把所有网格都渲染出来
    init() {
      var footerHeight = 40;
      var iconHeight = 65 + 3;
      var iconWidth = 60 + 3;
      this.colLength = Math.floor(
        (this.$el.offsetHeight - footerHeight - 10) / iconHeight
      );
      this.wrapperLength = Math.floor((this.$el.offsetWidth - 10) / iconWidth);
      // 初始化所有栅格
      // 这里数组的第一个是0项
      for (var i = 0; i < this.wrapperLength; i++) {
        var temp = [];
        for (var j = 0; j < this.colLength; j++) {
          temp.push({
            title: "",
            //   img: require("../assets/logo.png"),
            img: "",
            active: false,
          });
        }
        if (i == 0) {
          this.icons = [temp];
          continue;
        }
        this.icons.push(temp);
      }
    },
    clickIcon(e) {
      // 点击图标事件
      // 通过鼠标的左标判断当前点击的是哪个图标
      // 是否触发双击的flag
      var flag = false;
      var x = 1;
      var y = 1;
      //   padding-right：3px
      var iconWidth = 60 + 3;
      //   margin-bottom：3px
      var iconHeight = 65 + 3;
      while (e.pageX >= x * iconWidth + 5) {
        x++;
      }
      while (e.pageY >= y * iconHeight + 5) {
        y++;
      }
      // 把active都清false
      // 如果x，y = preX，preY
      // 触发双击事件

      if (this.preX != 0) {
        this.icons[this.preX - 1][this.preY - 1].active = false;
      }
      //如果点击的地方有图标，就变为active
      // 如果没有图标，就不进行处理，清除preX，preY
      if (this.icons[x - 1][y - 1].title != "") {
        if (this.preX === x && this.preY === y) {
          this.doubleClick(this.icons[x - 1][y - 1]);
          flag = true;
          // 触发完再初始化
          this.preX = 0;
          this.preY = 0;
        } else {
          this.icons[x - 1][y - 1].active = true;
          this.preY = y;
          this.preX = x;
        }
      } else {
        this.preX = 0;
        this.preY = 0;
      }
      // 点击完后设置定时器监听双击
      if (!flag) {
        this.doubleClickListen = setTimeout(() => {
          this.doubleClickListen = null;
        }, 500);
      }
    },
    // 双击事件
    doubleClick(icon) {
      // 如果不在setTimeout期间内再点击，则无法触发双击事件
      if (this.doubleClickListen) {
        this.app = icon;
        console.log("双击事件");
      }
    },
  },
  mounted() {
    this.init();
    //创建链表结构
    class NodeList {
      constructor(title, img, next) {
        this.title = title || "";
        this.img = img || "";
        this.next = next || null;
      }
    }
    var iconNode = new NodeList();
    this.home = iconNode;
    // 初始数据
    var titles = [
      "我的电脑",
      "回收站",
      "项目文件",
      "微信",
      "个人博客",
      "英雄联盟",
      "VUE",
      "我的电脑",
      "回收站",
      "项目文件",
      "微信",
      "选课系统",
      "英雄联盟",
      "VUE",
    ];
    var imgUrls = [
      require("../assets/系统.png"),
      require("../assets/回收站.png"),
      require("../assets/文件夹.png"),
      require("../assets/微信.png"),
      require("../assets/Chrome.png"),
      require("../assets/英雄联盟.png"),
      require("../assets/logo.png"),
      require("../assets/系统.png"),
      require("../assets/回收站.png"),
      require("../assets/文件夹.png"),
      require("../assets/微信.png"),
      require("../assets/Chrome.png"),
      require("../assets/英雄联盟.png"),
      require("../assets/logo.png"),
    ];
    // 通过初始的数据渲染这个链表
    for (var i = 0; i < titles.length; i++) {
      if (!titles[i] || !imgUrls[i]) {
        throw new Error("标题与图标数据不匹配");
      }
      iconNode.title = titles[i];
      iconNode.img = imgUrls[i];
      if (i == titles.length - 1) {
        // 最后一次
        iconNode.next = null;
        break;
      }
      var newNode = new NodeList();
      iconNode.next = newNode;
      iconNode = newNode;
    }
    // 通过链表建立出titles和imgUrls的数据
    this.renderDataFromHomeList();
  },
};
</script>
<style lang="less" scoped>
#home {
  overflow: hidden;
  width: 100%;
  height: 100vh;
  min-width: 1536px;
  min-height: 720px;
  background: url("../assets/bg.jpg");
  background-size: cover;
  box-sizing: border-box;
  position: relative;
  .wrapper {
    min-width: 1536px;
    height: 682px;
    box-sizing: border-box;
    position: absolute;
    padding: 5px;
    bottom: 40px;
    .col {
      display: inline-block;
      vertical-align: bottom;
      min-height: 682px;
      width: 60px;
      padding-right: 3px;
      &.last {
        margin: 0;
      }
      li {
        width: 100%;
        margin-bottom: 3px;
        height: 65px;
      }
    }
  }
}

.downClose-enter,
.downClose-leave-to {
  transform: translateY(20%);
  opacity: 0;
}
.downClose-enter-to,
.downClose-leave {
  transform: translateY(0);
  opacity: 1;
}
.downClose-enter-active,
.downClose-leave-active {
  transition: all 0.2s ease;
}
</style>