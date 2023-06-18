<template>
  <div class="container text-center w-25 mx-auto">
    <NavBar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-ato mx-auto d-block">
          <h1>Dlelte Restaurant</h1>
          <p class="text-danger fw-bold">
            Are you sure you want to delete all location?
          </p>
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-ato mx-auto d-block">
          <button class="btn btn-info text-light me-2" @click="backToHome()">
            Go Back
          </button>
          <button class="btn btn-danger ms-2" @click="deleteAllLcoations()">
            Delete Now
          </button>
        </div>
      </div>
    </form>
    <div
      class="alert alert-warning text-capitalize mt-3"
      role="alert"
      v-if="successUserMessage.length > 0"
    >
      {{ successUserMessage }}
    </div>
    <div
      class="alert alert-danger text-capitalize"
      role="alert"
      v-if="faildUserMessage.length > 0"
    >
      {{ faildUserMessage }}
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/header/header.vue";
import axios from "axios";
export default {
  name: "DeleteAllLocations",
  components: {
    NavBar,
  },
  data() {
    return {
      UserId: "",
      successUserMessage: "",
      faildUserMessage: "",
      allLocationId: [],
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "signup" });
    } else {
      this.UserId = JSON.parse(user).id;
      let result = await axios.get(
        `http://localhost:3000/locations?userId=${this.UserId}`
      );
      for (let i = 0; i < result.data.length; i++) {
        this.allLocationId.push(result.data[i].id);
      }
    }
  },
  methods: {
    backToHome() {
      this.$router.push({ name: "Home" });
    },
    async deleteAllLcoations() {
      let allResults = [];
      for (let i = 0; i < this.allLocationId.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/locations/${this.allLocationId[i]}`
        );
        if (result.status == 200) {
          allResults.push(true);
        } else {
          allResults.push(false);
        }
      }
      console.table(allResults);
      if (!allResults.includes(false)) {
        this.successUserMessage = "all locations are deleteed ...";
        this.faildUserMessage = "";
        setTimeout(() => {
          this.$router.push({ name: "Home" });
        }, 1000);
      } else {
        this.successUserMessage = "";
        this.faildUserMessage = "something error ...";
      }
    },
  },
};
</script>

<style></style>
