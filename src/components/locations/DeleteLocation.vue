<template>
  <div class="container text-center w-25 mx-auto">
    <NavBar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-ato mx-auto d-block">
          <h1>Dlelte Restaurant #{{ locationId }}</h1>
          <p class="text-danger fw-bold">
            Are you sure you want to delete this location?
          </p>
          <hr />
          {{ name }}<br />
          {{ address }}<br />
          {{ phone }}<br />
          <hr />
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-ato mx-auto d-block">
          <button class="btn btn-info text-light me-2" @click="backToHome()">
            Go Back
          </button>
          <button class="btn btn-danger ms-2" @click="deleteLoc()">
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
  name: "DlelteNewLocation",
  data() {
    return {
      name: "",
      phone: "",
      address: "",
      userId: "",
      locationId: this.$route.params.id,
      locationData: "",
      successUserMessage: "",
      faildUserMessage: "",
      ItemsIdis: [],
      ItemsCategoriesIdis: [],
    };
  },
  // props: ["locationId"],
  components: {
    NavBar,
  },
  methods: {
    backToHome() {
      this.$router.push({ name: "Home" });
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
    async deleteLoc() {
      console.log(this.locationId);
      let result = await axios.delete(
        `http://localhost:3000/locations/${this.locationId}`
      );
      let allCategoriesResults = [];
      for (let i = 0; i < this.ItemsCategoriesIdis.length; i++) {
        console.log(this.ItemsCategoriesIdis[i]);
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.ItemsCategoriesIdis[i]}`
        );
        console.log("delete category", result);
        if (result.status == 200) {
          allCategoriesResults.push(true);
        } else {
          allCategoriesResults.push(false);
        }
      }
      console.log(this.ItemsIdis, "ItemsIdis");
      let allItemsResults = [];
      for (let i = 0; i < this.ItemsIdis.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.ItemsIdis[i]}`
        );
        if (
          result.status == 200 &&
          !allCategoriesResults.includes(false) &&
          !allItemsResults.includes(false)
        ) {
          allItemsResults.push(true);
        } else {
          allItemsResults.push(false);
        }
      }
      if (result.status == 200) {
        this.successUserMessage = "location is deleteed ...";
        this.faildUserMessage = "";
        setTimeout(() => {
          this.$router.push({ name: "Home" });
        }, 2000);
      } else {
        this.successUserMessage = "";
        this.faildUserMessage = "something error ...";
      }
    },
    // async locationId(){
    //   let result = await axios.delte
    // }
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "signup" });
    } else {
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();

      let resultForItems = await axios.get(
        `http://localhost:3000/items?locId=${this.locationId}`
      );
      for (let i = 0; i < resultForItems.data.length; i++) {
        this.ItemsIdis.push(resultForItems.data[i].id);
      }
      console.log("user", this.userId, "locationId", this.locationId);
      let resultForCategories = await axios.get(
        `http://localhost:3000/categories?locationId=${this.locationId}`
      );
      for (let i = 0; i < resultForCategories.data.length; i++) {
        this.ItemsCategoriesIdis.push(resultForCategories.data[i].id);
      }
      console.log(this.ItemsCategoriesIdis);
    }
  },
};
</script>

<style></style>
