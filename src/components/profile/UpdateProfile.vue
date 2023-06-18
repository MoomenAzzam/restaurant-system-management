<template>
  <div class="container">
    <NavBar />
    <form @click.prevent>
      <div class="container text-center mt-5">
        <div class="row g-3 align-items-center">
          <h1>Update Your Profile</h1>
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
              class="btn btn-info text-light me-2"
              @click="updateProfileNow()"
            >
              Update Profile
            </button>
          </div>
        </div>
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <div
              class="alert alert-danger p-5 py-1"
              role="alert"
              v-if="ErrorUserUpdate"
            >
              {{ ErrorUserUpdate }}
            </div>
          </div>
        </div>
        <br />
      </div>
    </form>
  </div>
</template>
<script>
import NavBar from "@/components/header/header.vue";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
export default {
  name: "profileForm",
  data() {
    return {
      v$: useValidate(),
      name: "",
      email: "",
      pass: "",
      id: "",
      ErrorUserUpdate: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      pass: { required, minLength: minLength(8) },
      email: { required, email },
    };
  },
  components: { NavBar },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (user) {
      this.name = JSON.parse(user).name;
      this.email = JSON.parse(user).email;
      this.pass = JSON.parse(user).password;
      this.userId = JSON.parse(user).id;
    } else {
      this.$router.push({ name: "Signup" });
    }
  },
  methods: {
    async updateProfileNow() {
      this.v$.$validate();
      if (this.v$.$error) {
        this.ErrorUserUpdate = "Not Validate";
      } else {
        console.log("validate");
        // put
        let updateResult = await axios.put(
          `http://localhost:3000/users/${this.userId}`,
          {
            name: this.name,
            email: this.email,
            password: this.pass,
          }
        );
        if (updateResult.status == 200 && updateResult.data) {
          localStorage.setItem("user-info", JSON.stringify(updateResult.data));
          this.ErrorUserUpdate = "profile is updated";
          this.$router.push({ name: "Signup" });
        } else {
          this.ErrorUserUpdate = "profile is not updated";
        }
      }
    },
  },
};
</script>
