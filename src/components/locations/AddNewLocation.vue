<template>
  <div>
    <NavBar />
    <form @click.prevent>
      <div class="container text-center">
        <h2 class="mb-4">Add New Restaurant</h2>
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <input
              type="text"
              class="form-control"
              placeholder="Restaurant Name"
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
              type="text"
              class="form-control"
              placeholder="Restaurant Number"
              v-model="phone"
            />
            <span class="error-feedback" v-if="v$.phone.$error">{{
              v$.phone.$errors[0].$message
            }}</span>
          </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <input
              type="address"
              class="form-control"
              placeholder="Restaurant Address"
              v-model="address"
            />
            <span class="error-feedback mx-1" v-if="v$.address.$error">{{
              v$.address.$errors[0].$message
            }}</span>
          </div>
        </div>
        <br />
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <div
              class="alert alert-success"
              role="alert"
              v-if="successUserMessage.length > 0"
            >
              {{ successUserMessage }}
            </div>
            <div
              class="alert alert-danger"
              role="alert"
              v-if="faildUserMessage.length > 0"
            >
              {{ faildUserMessage }}
            </div>
          </div>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="button"
            class="btn btn-primary"
            @click="addNewLocation()"
          >
            Add Now
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import NavBar from "@/components/header/header.vue";
import axios from "axios";
// import { mapActions } from "vuex";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
export default {
  name: "AddNewRestaurant",
  data() {
    return {
      v$: useValidate(),
      name: "",
      phone: "",
      address: "",
      userId: "",
      added: "",
      faildUserMessage: "",
      successUserMessage: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      phone: { required, minLength: minLength(8) },
      address: { required, minLength: minLength(10) },
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "Signup" });
    } else {
      this.userId = JSON.parse(user).id;
    }
  },
  components: {
    NavBar,
  },
  methods: {
    async addNewLocation() {
      this.v$.$validate();
      if (!this.v$.$error) {
        console.log("validated");
        let result = await axios.post("http://localhost:3000/locations", {
          name: this.name,
          phone: this.phone,
          address: this.address,
          userId: this.userId,
        });
        if (result.status == 201) {
          this.added = true;
          this.successUserMessage = "Good job!";
          this.faildUserMessage = "";
          setTimeout(() => {
            this.$router.push({ name: "Home" });
          }, 2000);
        } else {
          this.successUserMessage = "";
          this.faildUserMessage = "Something went wrong, try agein pleas";
        }
      } else {
        this.successUserMessage = "";
        this.faildUserMessage = "you must fill all field";
        console.log("not validate");
      }
    },
  },
};
</script>

<style>
.error-feedback {
  color: red;
  font-size: 11px;
}
</style>
