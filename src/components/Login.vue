<template>
  <div class="mask">
    <div class="login-wrapper">
      <h3>请先验证身份</h3>
      密码：<input @keydown.enter="login" type="password" v-model="password" />
      <button @click="login">确认</button>
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
        console.log("密码错误");
        this.resolve(0);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.mask {
  position: relative;
  z-index: 30;
  width: 100%;
  height: 100%;
  .login-wrapper {
    position: fixed;
    width: 300px;
    height: 120px;
    border-radius: 20px;
    border: 1px solid #000;
    color: #000;
    background: #fff;
    left: calc(50% - 150px);
    top: calc(30% - 25px);
    text-align: center;
    line-height: 50px;
    > button {
      margin-left: 10px;
      font-size: 12px;
      padding: 0 5px;
    }
  }
}
</style>