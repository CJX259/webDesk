<template>
  <div class="mask" @click.self="cancel">
    <div class="createicon-wrapper">
      <h3>新建图标</h3>
      <el-form ref="form" :model="sizeForm" label-width="100px" size="large">
        <el-form-item label="文件/项目名">
          <el-input v-model="sizeForm.name" maxlength="13" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="网址" maxlength="50" show-word-limit>
          <el-input
            :disabled="sizeForm.type !== 'chrome'"
            v-model="sizeForm.address"
          ></el-input>
        </el-form-item>
        <el-form-item label="文件类型">
          <el-select v-model="sizeForm.type" placeholder="请选择文件类型">
            
            <el-option v-for="(type, i) in types" :key="i" :label="type" :value="type"></el-option>
            <!-- <el-option label="chrome" value="chrome"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
export default {
  props: ["changeShowCreate", "submit"],
  data() {
    return {
      types: ["txt", "chrome"],
      name: "",
      address: "",
      sizeForm: {
        name: "",
        type: "",
        address: "",
      },
    };
  },
  methods: {
    async onSubmit() {
      const resp = await this.submit(this.sizeForm);
      if (!resp.err) {
        //成功
        this.$message({
          message: '操作成功',
          duration: 2000,
          type: 'success'
        });
        this.changeShowCreate(false);
      } else {
        this.$message({
          message: resp.msg,
          duration: 2000,
          type: 'error'
        });
      }
    },
    cancel() {
      this.changeShowCreate(false);
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
  .createicon-wrapper {
    position: fixed;
    padding: 20px;
    box-sizing: border-box;
    width: 400px;
    height: 300px;
    border-radius: 20px;
    border: 1px solid #000;
    color: #000;
    background: #fff;
    left: calc(50% - 200px);
    top: calc(30% - 150px);
    text-align: center;
    // line-height: 50px;
    >h3{
      margin-bottom: 10px;
    }
  }
}
</style>