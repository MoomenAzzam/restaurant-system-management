<template>
  <form @click.prevent>
    <div class="container text-center mt-5">
      <div class="row g-3 align-items-center">
        <h1>Sign Up</h1>
        <div class="col-auto d-block mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Enter Your Name"
            v-model="name"
          />
          <span class="error-feedback" v-if="v$.name.$error">{{
            v$.name.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="email"
            class="form-control"
            placeholder="Enter Your Email"
            v-model="email"
          />
          <span class="error-feedback" v-if="v$.email.$error">{{
            v$.email.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <input
            type="password"
            class="form-control"
            placeholder="Enter Your Password"
            v-model="pass"
          />
          <span class="error-feedback" v-if="v$.pass.$error">{{
            v$.pass.$errors[0].$message
          }}</span>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="submit"
            class="btn btn-primary me-2"
            @click="SignUpNow()"
          >
            Sign Up Now
          </button>
          <button
            type="submit"
            @click="goToLogin()"
            class="btn btn-secondary ms-2"
          >
            Log In
          </button>
        </div>
      </div>
      <br />
    </div>
  </form>
</template>

<script>
import axios from "axios";
// import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
export default {
  name: "SingUpForm",
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      pass: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      pass: { required, minLength: minLength(8) },
      email: { required, email },
    };
  },
  methods: {
    // ...mapActions(["redirectTo"]),
    goToLogin() {
      this.$router.push({ name: "Login" });
    },
    async SignUpNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("successfuly");
        // post data for registration new user
        try {
          let result = await axios.post("http://localhost:3000/users", {
            name: this.name,
            email: this.email,
            password: this.pass,
          });
          if (result.status == 201) {
            console.log("added user new user");
            //save user data in local storage
            localStorage.setItem("user-info", JSON.stringify(result.data));
            // redirect to home page
            this.$router.push({ name: "Home" });
          } else {
            console.log("Error on added new user");
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log("failed");
      }
    },
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.$router.push({ name: "Home" });
    }
  },
};
</script>
<style>
.error-feedback {
  color: red;
  font-size: 11px;
}
</style>
