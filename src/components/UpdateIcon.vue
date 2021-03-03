<template>
  <div class="mask" @click.self="cancel">
    <div class="update-wrapper">
      <h3>修改数据</h3>
      <el-form ref="form" :model="sizeForm" label-width="100px" size="large">
        <el-form-item label="文件/项目名">
          <el-input
            v-model="sizeForm.name"
            maxlength="13"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="网址" maxlength="50" show-word-limit>
          <el-input
            :disabled="type !== 'chrome'"
            v-model="sizeForm.address"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认修改</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import axios from 'axios';
export default {
  props: ["changeShowUpdate", "submit", "icon"],
  data() {
    return {
      type: "",
      sizeForm: {
        name: "",
        address: "",
      },
    };
  },
  async mounted() {
    this.type = this.icon.type;
    this.sizeForm.name = this.icon.title;
    if (this.type === "chrome") {
      const resp = await axios.get("/api/project/getmap");
      const arr = resp.data.data;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name == this.icon.title) {
          this.sizeForm.address = arr[i].address;
        }
      }
    }
  },
  methods: {
    async onSubmit() {
      if(this.type === 'txt' && !this.sizeForm.name.includes(".txt") ){
        this.sizeForm.name += '.txt';
      }
      if (!this.sizeForm.name || (this.type === 'chrome' && !this.sizeForm.address)) {
        this.$message({
          type: "warning",
          message: "缺少必要参数",
        });
        return;
      }
      const resp = await this.submit(this.sizeForm);
      console.log(resp);
      if (!resp.err) {
        //成功
        this.$message({
          message: "更新成功",
          duration: 2000,
          type: "success",
        });
        this.changeShowUpdate(false);
      } else {
        this.$message({
          message: resp.msg,
          duration: 2000,
          type: "error",
        });
      }
    },
    cancel() {
      this.changeShowUpdate(false);
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
  .update-wrapper {
    position: fixed;
    padding: 20px;
    box-sizing: border-box;
    width: 450px;
    height: 300px;
    border-radius: 20px;
    border: 1px solid #000;
    color: #000;
    background: #fff;
    left: calc(50% - 225px);
    top: calc(30% - 150px);
    text-align: center;
    // line-height: 50px;
    > h3 {
      margin-bottom: 10px;
    }
  }
}
</style>