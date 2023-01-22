<template>
  <div class="container">
    <NavBar />
    <form @click.prevent>
      <div class="container text-center mt-5">
        <div class="row g-3 align-items-center">
          <h1>Your Profile</h1>
          <div class="col-auto d-block mx-auto">
            <input
              type="text"
              disabled
              class="form-control"
              placeholder="Enter Your Name"
              v-model="name"
            />
          </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <input
              type="email"
              disabled
              class="form-control"
              placeholder="Enter Your Email"
              v-model="email"
            />
          </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <input
              type="password"
              disabled
              class="form-control"
              placeholder="Enter Your Password"
              v-model="pass"
            />
          </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <button
              type="submit"
              class="btn btn-primary me-2"
              @click="updateNow()"
            >
              Update Profile
            </button>
          </div>
        </div>
        <br />
      </div>
    </form>
  </div>
</template>
<script>
import NavBar from "@/components/header/header.vue";

export default {
  name: "profileForm",
  data() {
    return {
      name: "",
      email: "",
      pass: "",
    };
  },
  components: { NavBar },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.pass = JSON.parse(user).password;
    } else {
      this.$router.push({ name: "/" });
    }
  },
  methods: {
    updateNow() {
      this.$router.push({ name: "UpdateProfile" });
    },
  },
};
</script>

<style></style>
