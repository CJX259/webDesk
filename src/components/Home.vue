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
    <transition name="app">
      <template v-if="apps.length !== 0">
        <Application
          v-show="this.smallWrapper.indexOf('chrome') === -1"
          :apps="apps"
          :changeActiveWrapper="changeActiveWrapper"
          :activeWrapper="activeWrapper"
          :clearApps="clearApps"
          :closePageByIndex="closePage"
          :updateActive="updateActive"
          :changeSmallWrapper="changeSmallWrapper"
        />
      </template>
    </transition>
    <transition name="app">
      <template v-if="txt !== ''">
        <Txt
          v-show="this.smallWrapper.indexOf('txt') === -1"
          :txt="txt"
          :activeWrapper="activeWrapper"
        />
      </template>
    </transition>
    <Footer
      :clickBottom="changeBottomActive"
      :bottomActive="bottomActive"
      :bottomIcons="bottomIcons"
      :changeCalendar="rightCalendar"
    />
  </div>
</template>
<script>
import Icon from "./Icon";
import Footer from "./Footer";
import Calendar from "./Calendar";
import Application from "./Application";
import Txt from "./Txt";

export default {
  components: {
    Footer,
    Icon,
    Calendar,
    Application,
    Txt,
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
      // 双击点开的webapp
      apps: [],
      // 给子组件监听，来修改active
      updateActive: false,

      //已打开的txt文件名
      txt: "",

      // 监听双击的监听器
      doubleClickListen: null,
      // 底部的icon,用于最小化，txt,chrome
      bottomIcons: [],
      bottomActive: 0,
      // 当前展示的最高窗口：chrome，txt
      activeWrapper: "",
      // 处于最小化状态的窗口：chrome, txt
      smallWrapper: [],
    };
  },
  methods: {
    // 点击展示内容，设置成activeWrapper
    changeActiveWrapper(name) {
      this.activeWrapper = name;
      let index = this.bottomIcons.indexOf(name);
      this.bottomActive = index;
    },
    // 处理最小化的内容,包含处理buttonActive和activeWrapper
    changeSmallWrapper(type, name) {
      switch (type) {
        case "delete":
          var index = this.bottomIcons.indexOf(name);
          this.bottomActive = index;
          index = this.smallWrapper.indexOf(name);
          this.smallWrapper.splice(index, 1);
          this.activeWrapper = name;
          break;
        case "add":
          // 如果最小化没有，则添加进去
          if (this.smallWrapper.indexOf(name) === -1) {
            this.smallWrapper.push(name);
          }
          // 如果最小化的是当前最高级，则把最高级换为第一个已打开应用中，非最小化的应用
          if (this.bottomActive === this.bottomIcons.indexOf(name)) {
            this.bottomActive = -1;
            this.activeWrapper = "";
            for (var i = 0; i < this.bottomIcons.length; i++) {
              if (
                this.bottomIcons[i] !== name &&
                this.smallWrapper.indexOf(this.bottomIcons[i]) === -1
              ) {
                this.activeWrapper = this.bottomIcons[i];
                this.bottomActive = i;
                break;
              }
            }
          }
          break;
      }
    },
    //点击底部icon
    changeBottomActive(name, index) {
      if (!index) {
        index = this.bottomIcons.indexOf(name);
      }
      // 判断如果small里面有了，就去除，否则再看是否为最高级，不是就变为最高级
      if (this.smallWrapper.indexOf(name) === -1) {
        // 是最高级，添加进最小化
        if (this.activeWrapper === name) {
          this.changeSmallWrapper("add", name);
        } else {
          // 不是当前的话，就变为最高级
          this.activeWrapper = name;
          this.bottomActive = this.bottomIcons.indexOf(name);
        }
      } else {
        this.changeSmallWrapper("delete", name);
      }
    },
    // 清除apps
    clearApps() {
      this.apps = [];
      this.changeActive = 0;
      this.clearInBottomIcons('chrome');
      console.log(this.bottomActive);
    },
    // 关闭应用，清除bottomIcons中相应数据（activeWrapper，bottomActive）
    clearInBottomIcons(name) {
      var index = this.bottomIcons.indexOf(name);
      this.bottomIcons.splice(index, 1);
      if (this.activeWrapper === name) {
        this.bottomActive = -1;
        this.activeWrapper = "";
        for (var i = 0; i < this.bottomIcons.length; i++) {
          if (
            this.bottomIcons[i] !== name &&
            this.smallWrapper.indexOf(this.bottomIcons[i]) === -1
          ) {
            this.activeWrapper = this.bottomIcons[i];
            this.bottomActive = i;
            break;
          }
        }
      }else{
        // 如果关闭的不是自己，且active大于自己，那么active退一位
        if(this.bottomActive > index){
          this.bottomActive--;
        }
      }
    },
    closePage(index) {
      this.apps.splice(index, 1);
    },
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
    // 插入那个拖拽的图标,实现这个需要prev指针
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
      // 打开窗口时禁止拖动
      if (this.apps.length !== 0) {
        alert("打开窗口时禁止拖动图标");
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
          // 出现问题：当图标移动时，icons改变，跟着这里的icon也会变
          // 导致展示中的页面自动变化
          const icon = this.icons[x - 1][y - 1];
          this.doubleClick(icon);
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
    // 处理打开的文件的最小化和底部图标
    handleShow(name) {
      this.activeWrapper = name;
      let index = this.bottomIcons.indexOf(name);
      if (index === -1) {
        this.bottomIcons.push(name);
        this.bottomActive = this.bottomIcons.length - 1;
      } else {
        this.bottomActive = this.bottomIcons.indexOf(name);
      }
    },
    // 双击事件，窗口打开时禁止拖动图标
    doubleClick(icon) {
      // 如果不在setTimeout期间内再点击，则无法触发双击事件
      if (this.doubleClickListen) {
        // 记事本文件
        if (icon.title.includes(".txt")) {
          this.txt = icon.title;
          // 如果bottomIcon里有记事本，那就设为active
          // 否则添加
          this.handleShow("txt");
        } else {
          // app的是默认的
          if (this.apps.length >= 11) {
            alert("同时最多开启11个窗口");
            return;
          }
          this.handleShow("chrome");
          this.apps.push(icon);
          // 双击更新的apps，提醒子组件来更新active
          this.updateActive = !this.updateActive;
        }
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
      "个人博客",
      "项目文件",
      "选课系统",
      "用户信息.txt",
    ];
    var imgUrls = [
      require("../assets/系统.png"),
      require("../assets/Chrome.png"),
      require("../assets/文件夹.png"),
      require("../assets/Chrome.png"),
      require("../assets/记事本.png"),
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
    top: 0;
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

.app-enter,
.app-leave-to {
  transform: scale(0.9);
  opacity: 0.1;
}
.app-enter-active,
.app-leave-active {
  transition: transform 0.2s linear;
}

.app-leave,
.app-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>