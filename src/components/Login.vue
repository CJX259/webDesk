<template>
  <div class="mask" @click.self="resolve(0)">
    <div class="login-wrapper">
      <h3>请先验证身份</h3>
      密码：
      <el-input
        placeholder="请输入密码"
        v-model="password"
        type="password"
      ></el-input>
      <el-button @click="login">确认</el-button>
    </div>
  </div>
</template>

<script>
import md5 from "md5";
export default {
  props: ["resolve"],
  data() {
    return {
      password: "",
      truePassword: md5("123123"),
    };
  },
  methods: {
    login() {
      if (md5(this.password) === this.truePassword) {
        sessionStorage.setItem("login", md5(this.password));
        this.resolve(1);
      } else {
        this.resolve(0);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.mask {
  position: relative;
  z-index: 100;
  width: 100%;
  height: 100%;
  .login-wrapper {
    position: fixed;
    width: 400px;
    height: 150px;
    border-radius: 20px;
    border: 1px solid #000;
    color: #000;
    background: #fff;
    left: calc(50% - 200px);
    top: calc(30% - 70px);
    text-align: center;
    line-height: 50px;
    >.el-input{
      width: 200px;
    }
  }
}
</style>