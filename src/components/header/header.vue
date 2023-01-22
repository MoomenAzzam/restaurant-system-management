<template>
  <div class="nav mt-4 text-center d-block">
    <router-link
      :to="{
        name: 'Home',
      }"
      >Go to Home</router-link
    >
    <span>|</span>
    <router-link
      :to="{
        name: 'Login',
      }"
      @click="logOut()"
      >Log Out</router-link
    >
  </div>
</template>

<script>
export default {
  name: "NavBar",
  methods: {
    logOut() {
      localStorage.clear();
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style lang="scss" scoped>
$fontColor: darkcyan;
$navColor: #525a5a;
.nav {
  color: $fontColor;
  margin-bottom: 50px;
  a,
  span {
    text-decoration: none;
    font-weight: bold;
    padding: 5px;
  }
}
a.router-link-exact-active,
.nav a:hover {
  color: $navColor;
  box-shadow: 2px 2px 4px 0px $navColor;
}
</style>
