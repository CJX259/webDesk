<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import Home from "./components/Home";

export default {
  name: "App",
  components: {
    Home,
  },
  mounted() {0
  // 鼠标右键事件
    document.oncontextmenu = function (e) {
      console.log(e);
  };
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  list-style: none;
  text-decoration: none;
}
body,
:root {
  height: 100%;
}
</style>
