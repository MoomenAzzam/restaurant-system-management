<template>
  <div>
    <NavBar />
    <form @click.prevent>
      <div class="container text-center">
        <h2 class="mb-4">Update Restaurant</h2>
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
            <button
              type="button"
              class="btn btn-success"
              @click="updateLocation()"
            >
              Update Now
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import NavBar from "@/components/header/header.vue";
import axios from "axios";
import useValidate from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";
export default {
  name: "UpdateLocation",
  data() {
    return {
      v$: useValidate(),
      name: "",
      phone: "",
      address: "",
      userId: "",
      locationId: "",
      added: "",
      faildUserMessage: "",
      successUserMessage: "",
    };
  },
  mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "Signup" });
    } else {
      this.userId = JSON.parse(user).id;
      this.locationId = this.$route.params.id;
      this.canCurrentUserAccessThisLocation();
    }
  },
  components: { NavBar },
  validations() {
    return {
      name: { required, minLength: minLength(10) },
      phone: { required, minLength: minLength(8) },
      address: { required, minLength: minLength(10) },
    };
  },
  methods: {
    async updateLocation() {
      this.v$.$validate();
      if (!this.v$.$error) {
        let result = await axios.put(
          `http://localhost:3000/locations/${this.locationId}`,
          {
            name: this.name,
            phone: this.phone,
            address: this.address,
            userId: this.userId,
          }
        );
        if (result.status == 200) {
          this.added = true;
          this.successUserMessage = "Location Is Updated...";
          this.faildUserMessage = "";
          console.log("success Updating");
          setTimeout(() => {
            this.$router.push({ name: "Home" });
          }, 1000);
        } else {
          this.successUserMessage = "";
          this.faildUserMessage = "Something went wrong, try agein pleas";
        }
      } else {
        this.successUserMessage = "";
        this.faildUserMessage = "you must fill all field";
        console.log("faild Updating");
      }
    },
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.name = this.locationData[0].name;
        this.phone = this.locationData[0].phone;
        this.address = this.locationData[0].address;
      } else {
        this.$router.push({ name: "Home" });
      }
    },
  },
};
</script>

<style></style>
