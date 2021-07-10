<template>
  <nav>
    <router-link to="/todo">ToDo</router-link> |<router-link to="/"
      >Home</router-link
    >
  </nav>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
};
</script>
