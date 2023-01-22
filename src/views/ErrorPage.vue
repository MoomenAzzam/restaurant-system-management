<template>
  <div class="pageError">
    <router-link :to="{ name: 'Home' }" class="text-center d-block">
      <button class="btn btn-info text-light mt-4">
        Go To Home Page
      </button></router-link
    >
    <div>
      <img
        src="../assets/pageNotFound.webp"
        class="rounded mx-auto d-block mt-2"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
};
</script>

<style>
img {
  height: 500px;
  cursor: not-allowed;
}
</style>
