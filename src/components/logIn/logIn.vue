<template>
  <form @click.prevent>
    <div class="container text-center mt-5">
      <div class="row g-3 align-items-center">
        <h1>Log In</h1>
        <div class="col-auto d-block mx-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Enter Your email"
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
            @click="LogInNow()"
          >
            Log In Now
          </button>
          <button
            type="submit"
            @click="goToSignUp()"
            class="btn btn-secondary ms-2"
          >
            Sign Up
          </button>
        </div>
      </div>
      <br />
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <div
            class="alert alert-danger p-5 py-1"
            role="alert"
            v-if="ErrorUserNotFound"
          >
            {{ ErrorUserNotFound }}
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, minLength, email } from "@vuelidate/validators";
export default {
  name: "Log-In",
  data() {
    return {
      v$: useValidate(),
      email: "",
      pass: "",
      ErrorUserNotFound: "",
      info: "",
    };
  },
  validations() {
    return {
      email: { required, email },
      pass: { required, minLength: minLength(8) },
    };
  },
  methods: {
    ...mapActions(["redirectTo"]),
    goToSignUp() {
      this.$router.push({ name: "Signup" });
    },
    async LogInNow() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("successfuly");
        try {
          let result = await axios.get(
            `http://localhost:3000/users?email=${this.email}&password=${this.pass}`
          );
          console.log(result.data);
          if (result.status == 200 && result.data.length > 0) {
            console.log("user is login");
            //save user data in local storage
            localStorage.setItem("user-info", JSON.stringify(result.data[0]));
            // redirect to home page
            this.$router.push({ name: "Home" });
          } else {
            console.log("User not found");
            this.ErrorUserNotFound = "User not found";
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
<style lang="scss" scoped>
.error-feedback {
  color: red;
  font-size: 11px;
}
</style>
