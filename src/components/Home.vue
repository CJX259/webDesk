<template>
  <div @contextmenu.prevent="() => {}" id="home" @click="contentClick">
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
          @click.stop.right.prevent="rightClickByIcon($event, item, i)"
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
    <transition-group name="app">
      <template v-if="apps.length !== 0">
        <Application
          key="app"
          v-if="this.smallWrapper.indexOf('chrome') === -1"
          :apps="apps"
          :changeActiveWrapper="changeActiveWrapper"
          :activeWrapper="activeWrapper"
          :clearApps="clearApps"
          :closePageByIndex="closePage"
          :updateActive="activeApp"
          :max="chromeMax"
          :needClose="needClose"
          name="chrome"
          :iconsData="iconsData.filter((item) => item.type === 'chrome')"
          :changeMax="changeMax"
          :changeSmallWrapper="changeSmallWrapper"
        >
          <template v-slot:default="pageData">
            <iframe class="webpage" :src="pageData.data.content"></iframe>
          </template>
        </Application>
      </template>
      <template v-if="txts.length !== 0">
        <Application
          key="txt"
          v-if="this.smallWrapper.indexOf('txt') === -1"
          :apps="txts"
          :changeActiveWrapper="changeActiveWrapper"
          :activeWrapper="activeWrapper"
          :clearApps="clearApps"
          :closePageByIndex="closePage"
          :updateActive="activeTxt"
          :max="txtMax"
          :changeMax="changeMax"
          name="txt"
          :needClose="needClose"
          :needInit="applicationInit"
          :iconsData="iconsData.filter((item) => item.type === 'txt')"
          :changeSmallWrapper="changeSmallWrapper"
        >
          <template v-slot:default="pageData">
            <textarea
              @keydown.ctrl.83.prevent="handleKeyDown($event, pageData.data)"
              class="txt"
              v-model="pageData.data.content"
              autofocus
            />
          </template>
        </Application>
      </template>
    </transition-group>
    <Footer
      :clickBottom="changeBottomActive"
      :bottomActive="bottomActive"
      :bottomIcons="bottomIcons"
      :changeCalendar="rightCalendar"
    />
    <transition name="app">
      <Login v-if="needLogin" :resolve="loginResolve" />
    </transition>
    <transition name="app">
      <template v-if="showRightMenu">
        <right-menu
          :icon="rightIcon"
          :mode="rightMenuMode"
          :left="rightMenuPosition.x"
          :top="rightMenuPosition.y"
          :handleUpdate="clickUpdateByMenu"
          :handleDelete="handleDelete"
          :handleAdd="clickAddByMenu"
          :changeShow="changeRightMenu"
        />
      </template>
    </transition>
    <transition-group name="app">
      <Createicon
        key="create"
        v-if="showCreate"
        :submit="handleCreateIcon"
        :changeShowCreate="changeShowCreate"
      />
      <UpdateIcon
        key="update"
        v-if="showUpdate"
        :submit="handleUpdateIcon"
        :changeShowUpdate="changeShowUpdate"
        :icon="rightIcon"
      />
    </transition-group>
  </div>
</template>
<script>
import axios from "axios";
import Icon from "./Icon";
import Footer from "./Footer";
import Calendar from "./Calendar";
import Application from "./Application";
import Login from "./Login";
import Createicon from "./CreateIcon";
import RightMenu from "./RightMenu";
import UpdateIcon from "./UpdateIcon";

export default {
  components: {
    Footer,
    Icon,
    Calendar,
    Application,
    Login,
    Createicon,
    RightMenu,
    UpdateIcon,
  },
  data() {
    return {
      // 图标管理所需变量
      icons: [[]],
      colLength: 8,
      wrapperLength: 0,
      //   margin-bottom：3px
      iconHeight: 65 + 3,
      //   padding-right：3px
      iconWidth: 60 + 3,
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
      activeApp: false,
      chromeMax: false,
      // 监听，用来触发closePage函数
      // {index, type}
      needClose: {},

      //已打开的txt文件名
      txts: [],
      activeTxt: false,
      txtMax: false,

      // 监听双击的监听器
      doubleClickListen: null,
      // 底部的icon,用于最小化，txt,chrome
      bottomIcons: [],
      bottomActive: 0,
      // 当前展示的最高窗口：chrome，txt
      activeWrapper: "",
      // 处于最小化状态的窗口：chrome, txt
      smallWrapper: [],

      // 数据库中的icon数据
      iconsData: [],
      //展示login
      needLogin: false,
      // login结束调用的resolve，传1为正确，0为错误
      loginResolve: "",
      // 重新请求application的远程数据：dataMap等
      applicationInit: false,

      // 展示create组件
      showCreate: false,
      showUpdate: false,
      // 展示右键菜单
      showRightMenu: false,
      // 'update add'  更新和新增两种模式
      rightMenuMode: "",
      // 右击的icon数据
      rightIcon: {},
      rightMenuPosition: {
        x: 0,
        y: 0,
      },
    };
  },
  methods: {
    changeRightMenu(flag) {
      this.showRightMenu = flag;
      // 去掉active
      for (let i = 0; i < this.icons.length - 1; i++) {
        for (let j = 0; j < this.icons[i].length - 1; j++) {
          if (this.icons[i][j].active) {
            this.icons[i][j].active = false;
          }
        }
      }
      this.preX = 0;
      this.preY = 0;
    },
    async handleUpdateIcon(data) {
      return await this.handleLogin(this.updateIcon, data);
    },
    async updateIcon(data) {
      try {
        const resp = await axios.post("/api/icon/updateicon", {
          name: this.rightIcon.title,
          newName: data.name,
          address: data.address ? data.address : "",
        });
        // console.log(this.rightIcon.title);
        if (!resp.data.data.err) {
          // 找到对应的arr，修改名字为新名字
          // let index = 0;
          // if (this.rightIcon.type === "txt") {
          //   console.log(this.txts);
          //   index = this.txts.indexOf(this.rightIcon.title);
          //   // console.log(index);
          //   this.txts[index] = data.name;
          //   console.log(this.txts);
          // } else if (this.rightIcon.type === "chrome") {
          //   index = this.apps.indexOf(this.rightIcon.title);
          //   this.apps[index] = data.name;
          //   console.log(this.apps);
          // }
          this.reload();
          return {
            err: false,
            msg: "成功",
          };
        }
      } catch (err) {
        return {
          err: true,
          msg: err,
        };
      }
    },
    // 点击右键的修改
    clickUpdateByMenu() {
      this.changeShowUpdate(true);
    },
    // 附上登录功能
    async handleDelete() {
      return await this.handleLogin(this.deleteByMenu);
    },
    // 点击右键的删除
    // 需要清除所属的arr，bottom和small
    async deleteByMenu() {
      try {
        const flag = await this.$confirm(
          "此操作将永久删除该文件, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (flag !== "confirm") {
          this.$message({
            type: "warning",
            message: "取消删除",
          });
          return;
        }
        const resp = await axios.get("/api/icon/deleteicon", {
          params: {
            name: this.rightIcon.title,
            type: this.rightIcon.type,
          },
        });
        if (!resp.data.data.err) {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          // 调用子组件Application里的关闭窗口方法
          let index =
            this.rightIcon.type === "txt"
              ? this.txts.indexOf(this.rightIcon.title)
              : this.apps.indexOf(this.rightIcon.title);
          this.needClose = { type: this.rightIcon.type, index };
          // 刷新页面
          this.reload();
        } else {
          this.$message({
            type: "error",
            message: "删除失败!",
          });
        }
      } catch (err) {
        this.$message({
          type: "warning",
          message: "取消删除",
        });
      }
    },
    // 点击右键添加
    clickAddByMenu() {
      this.changeShowCreate(true);
    },
    // 右键出两种
    // 1.icon有数据情况，提供修改和删除操作
    // 2.icon无数据情况，提供新增操作
    rightClickByIcon(e, icon) {
      this.rightMenuPosition.x = e.pageX;
      this.rightMenuPosition.y = e.pageY;
      if (!this.showRightMenu) {
        this.showRightMenu = true;
      }
      if (icon.title === "") {
        this.rightIcon = {};
        this.rightMenuMode = "add";
        // 去掉active
        for (let i = 0; i < this.icons.length - 1; i++) {
          for (let j = 0; j < this.icons[i].length - 1; j++) {
            if (this.icons[i][j].active) {
              this.icons[i][j].active = false;
            }
          }
        }
        this.preX = 0;
        this.preY = 0;
      } else {
        // 不是active，就设置为active
        if (!icon.active) {
          for (let i = 0; i < this.icons.length - 1; i++) {
            for (let j = 0; j < this.icons[i].length - 1; j++) {
              if (this.icons[i][j].active) {
                this.icons[i][j].active = false;
              }
            }
          }
          icon.active = true;
          //在这里设置prevX
          for (let i = 0; i < this.icons.length - 1; i++) {
            for (let j = 0; j < this.icons[i].length - 1; j++) {
              if (this.icons[i][j].active) {
                this.preX = i + 1;
                this.preY = j + 1;
              }
            }
          }
        }
        // 传入icon
        this.rightMenuMode = "update";
        this.rightIcon = icon;
      }
    },
    changeShowCreate(flag) {
      this.showCreate = flag;
    },
    changeShowUpdate(flag) {
      this.showUpdate = flag;
    },
    async handleCreateIcon(data) {
      return await this.handleLogin(this.createIcon, data);
    },
    // 新建图标
    async createIcon(data) {
      if (data.type === "txt" && !data.name.includes(".txt")) {
        // 把.后面的内容全部替换成txt即可
        const reg = new RegExp(/./g);
        console.log(data.name.replace(reg, ""));
        console.log(data.name);
        data.name += ".txt";
      }
      const resp = await axios.post("/api/icon/addicon", {
        ...data,
      });
      if (!resp.data.data.err) {
        // 写入成功,重新请求数据
        this.reload();
        return {
          err: false,
          msg: "成功",
        };
      } else {
        return {
          err: true,
          msg: resp.data.data.msg,
        };
      }
    },
    // 登录操作进行的函数,传入需要登录的函数操作和参数即可
    async handleLogin(func, ...arg) {
      if (!this.isLogin()) {
        const resp = await this.changeNeedLogin(true);
        if (resp) {
          this.$message({
            message: "密码正确",
            duration: 2000,
            type: "success",
          });
          this.changeNeedLogin(false);
          return func.call(this, ...arg);
        } else {
          this.$message({
            message: "密码错误",
            duration: 2000,
            type: "error",
          });
        }
        this.changeNeedLogin(false);
      } else {
        return func.call(this, ...arg);
      }
    },
    // 判断有没有登录过
    isLogin() {
      if (sessionStorage.getItem("login")) {
        return true;
      } else {
        return false;
      }
    },
    // 处理txt文本的保存
    async handleKeyDown(e, data) {
        // 登陆验证
        return await this.handleLogin(this.writeFile, data);
    },
    // 调用，写文件
    async writeFile(data) {
      const resp = await axios.post("/api/txt/write", {
        content: data.content,
        filename: data.name,
      });
      if (!resp.data.data.err) {
        // 写入成功,重新请求数据
        this.applicationInit = !this.applicationInit;
        this.$message({
          message: resp.data.data.msg,
          duration: 2000,
          type: "success",
        });
      } else {
        this.$message({
          message: resp.data.data.msg,
          duration: 2000,
          type: "error",
        });
      }
    },
    // 展示login组件，但需要login时，会返回一个promise对象
    // 调用此函数的地方可以使用await等待登录的结果
    // 返回1则是密码正确，返回0是密码错误
    // 若传false则不会返回promise（隐藏login，所以不用等待）
    changeNeedLogin(flag) {
      this.needLogin = flag;
      if (!flag) return;
      return new Promise((resolve) => {
        this.loginResolve = resolve;
      });
    },
    // 点击展示内容，设置成activeWrapper
    changeActiveWrapper(name) {
      this.activeWrapper = name;
      let index = this.bottomIcons.indexOf(name);
      this.bottomActive = index;
    },
    // 处理最小化的内容,包含处理buttonActive和activeWrapper
    changeSmallWrapper(type, appType) {
      switch (type) {
        case "delete":
          var index = this.bottomIcons.indexOf(appType);
          this.bottomActive = index;
          index = this.smallWrapper.indexOf(appType);
          if (index != -1) {
            this.smallWrapper.splice(index, 1);
          }
          this.activeWrapper = appType;
          break;
        case "add":
          // 如果最小化没有，则添加进去
          if (this.smallWrapper.indexOf(appType) === -1) {
            this.smallWrapper.push(appType);
          }
          // 如果最小化的是当前最高级，则把最高级换为第一个已打开应用中，非最小化的应用
          if (this.bottomActive === this.bottomIcons.indexOf(appType)) {
            this.bottomActive = -1;
            this.activeWrapper = "";
            for (var i = 0; i < this.bottomIcons.length; i++) {
              if (
                this.bottomIcons[i] !== appType &&
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
    clearApps(type) {
      switch (type) {
        case "chrome":
          this.apps = [];
          break;
        case "txt":
          this.txts = [];
      }
      // this.changeActive = 0;
      this.clearInBottomIcons(type);
    },
    changeMax(flag, name) {
      this[name + "Max"] = flag;
    },
    // 关闭应用，清除bottomIcons中相应数据（activeWrapper，bottomActive）
    clearInBottomIcons(type) {
      var index = this.bottomIcons.indexOf(type);
      this.bottomIcons.splice(index, 1);
      if (this.activeWrapper === type) {
        this.bottomActive = -1;
        this.activeWrapper = "";
        for (var i = 0; i < this.bottomIcons.length; i++) {
          if (
            this.bottomIcons[i] !== type &&
            this.smallWrapper.indexOf(this.bottomIcons[i]) === -1
          ) {
            this.activeWrapper = this.bottomIcons[i];
            this.bottomActive = i;
            break;
          }
        }
      } else {
        // 如果关闭的不是自己，且active大于自己，那么active退一位
        if (this.bottomActive > index) {
          this.bottomActive--;
        }
      }
    },
    closePage(index, name) {
      switch (name) {
        case "txt":
          this.txts.splice(index, 1);
          break;
        case "chrome":
          this.apps.splice(index, 1);
          break;
      }
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
      // padding-left:5
      while (e.clientX >= x * this.iconWidth + 5) {
        x++;
      }
      // padding-top:5
      while (e.clientY >= y * this.iconHeight + 5) {
        y++;
      }
      // 拖动到原本的位置，不变，且恢复dragIconIndex
      if (this.dragIconIndex.x === x - 1 && this.dragIconIndex.y === y - 1) {
        this.dragIconIndex = null;
        return;
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
      if (this.apps.length !== 0 || this.txts.length !== 0) {
        this.$message({
          message: "存在窗口时禁止拖动图标",
          duration: 2000,
          type: "warning",
        });
        return;
      }
      var x = 1;
      var y = 1;
      while (e.clientX >= x * this.iconWidth + 5) {
        x++;
      }
      // padding-top:5
      while (e.clientY >= y * this.iconHeight + 5) {
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
          this.icons[x][y].type = iconNode.type;
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
      this.colLength = Math.floor(
        (this.$el.offsetHeight - footerHeight - 10) / this.iconHeight
      );
      this.wrapperLength = Math.floor(
        (this.$el.offsetWidth - 10) / this.iconWidth
      );
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
            type: "",
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
      while (e.pageX >= x * this.iconWidth + 5) {
        x++;
      }
      while (e.pageY >= y * this.iconHeight + 5) {
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
      this.showRightMenu = false;
    },
    // 处理打开的文件的最小化和底部图标,还要从最小化中去除
    handleShow(type) {
      this.activeWrapper = type;
      let index = this.bottomIcons.indexOf(type);
      if (index === -1) {
        this.bottomIcons.push(type);
        this.bottomActive = this.bottomIcons.length - 1;
      } else {
        this.bottomActive = this.bottomIcons.indexOf(type);
        // 从最小化中去除
        this.changeSmallWrapper("delete", type);
      }
    },
    // 双击事件，窗口打开时禁止拖动图标
    doubleClick(icon) {
      // 如果不在setTimeout期间内再点击，则无法触发双击事件
      if (this.doubleClickListen) {
        // 记事本文件
        var arr = "";
        var active = "";
        if (icon.type == "txt") {
          active = "Txt";
          arr = "txts";
        } else if (icon.type === "chrome") {
          // app的是默认的
          arr = "apps";
          active = "App";
        }
        if (this[arr].length >= 11) {
          this.$message({
            message: "同时最多开启11个窗口",
            type: "warning",
            duration: 2000,
          });
          return;
        }
        this.handleShow(icon.type);
        this[arr].push(icon);
        this["active" + active] = !this["active" + active];
      }
    },
    async reload() {
      this.init();
      //创建链表结构
      class NodeList {
        constructor(title, img, next, type) {
          this.title = title || "";
          this.img = img || "";
          this.next = next || null;
          this.type = type;
        }
      }
      var iconNode = new NodeList();
      this.home = iconNode;
      // 初始数据
      // 需要修改，titles作为icons存储在数据库中
      // imgUrls作为vue的数据存在data中
      // init函数执行时，查数据库，拿到icons数组，icon有type属性，根据不同的type属性，分配不同的img
      // 上传操作时，传入icon的数据以及对应的address分别存入不同的表，再重新render一下即可
      let resp = await axios.get("/api/icon/geticon");
      if (resp.status === 200) {
        this.iconsData = resp.data.data;
      }
      // var this.iconsData = [
      //   "我的电脑",
      //   "个人博客",
      //   "项目文件",
      //   "选课系统",
      //   "用户信息.txt",
      // ];
      var imgUrls = [
        {
          name: "chrome",
          img: require("../assets/Chrome.png"),
        },
        {
          name: "txt",
          img: require("../assets/记事本.png"),
        },
      ];
      // var imgUrls = [
      //   require('imgUrl')
      // ]
      // 通过初始的数据渲染这个链表
      for (var i = 0; i < this.iconsData.length; i++) {
        iconNode.title = this.iconsData[i].name;
        iconNode.type = this.iconsData[i].type;
        // iconNode.img = imgUrls.filter(item=>item.name === this.iconsData[i].type)[0].img;
        var imgUrl = imgUrls.filter(
          (item) => item.name === this.iconsData[i].type
        );
        if (imgUrl.length <= 0) {
          throw new Error("缺少图片类型：" + this.iconsData[i].type);
        } else {
          iconNode.img = imgUrl[0].img;
        }
        // 最后一次
        if (i === this.iconsData.length - 1) {
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
  },
  async mounted() {
    await this.reload();
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