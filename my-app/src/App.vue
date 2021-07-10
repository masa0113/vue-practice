<template>
  <div id="nav">
    <router-link to="/todo">ToDo</router-link> |<router-link to="/"
      >Home</router-link
    >
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
