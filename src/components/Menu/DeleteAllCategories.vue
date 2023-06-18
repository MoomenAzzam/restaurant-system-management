<template>
  <div class="container text-center w-25 mx-auto">
    <NavBar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-ato mx-auto d-block">
          <h1>Dlelte categories</h1>
          <p class="text-danger fw-bold">
            Are you sure you want to delete allcategories?
          </p>
          <div class="text-center">
            <h2>{{ locationName }}</h2>
            <p>{{ locationAddress }}</p>
          </div>
          <p class="text-danger fw-bold">
            When Deleting all categories, thier related menu items will be
            deleted as well...
          </p>
        </div>
      </div>
      <div class="row g-3 align-items-center">
        <div class="col-ato mx-auto d-block">
          <button
            class="btn btn-info text-light me-2"
            @click="backToViewCategory()"
          >
            Go Back
          </button>
          <button class="btn btn-danger ms-2" @click="DeleteAllCategories()">
            Delete All
          </button>
        </div>
      </div>
    </form>
    <div
      class="alert alert-success text-capitalize mt-3"
      role="alert"
      v-if="successUserMessage.length > 0"
    >
      {{ successUserMessage }}
    </div>
    <div
      class="alert alert-warning text-capitalize"
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
  name: "DeleteAllCategories",
  data() {
    return {
      locationId: parseInt(this.$route.params.locId),
      userId: "",
      successUserMessage: "",
      faildUserMessage: "",
      locationData: [],
      ItemsIdis: [],
      ItemsCategoriesIdis: [],
      locationName: "",
      locationAddress: "",
    };
  },
  components: {
    NavBar,
  },
  // ********************************************************************
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "signup" });
    } else {
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      console.log(this.locationId, " locaioln id");
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
    }
  },
  // ********************************************************************
  methods: {
    backToViewCategory() {
      this.$router.push({
        name: "viewCategories",
        params: { locationId: this.locationId },
      });
    },
    async canCurrentUserAccessThisLocation() {
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        this.locationName = this.locationData[0].name;
        this.locationAddress = this.locationData[0].address;
      } else {
        this.$router.push({ name: "Home" });
      }
    },
    async DeleteAllCategories() {
      let allCategoriesResults = [];
      for (let i = 0; i < this.ItemsCategoriesIdis.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/categories/${this.ItemsCategoriesIdis[i]}`
        );
        if (result.status == 200) {
          allCategoriesResults.push(true);
        } else {
          allCategoriesResults.push(false);
        }
      }
      // items ******************************************************
      let allItemsResults = [];
      for (let i = 0; i < this.ItemsIdis.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.ItemsIdis[i]}`
        );
        console.log(result.status);
        if (result.status == 200) {
          allItemsResults.push(true);
        } else {
          allItemsResults.push(false);
        }
      }
      if (
        !allCategoriesResults.includes(false) &&
        !allItemsResults.includes(false)
      ) {
        this.successUserMessage =
          "Categyory and related items are ALL deleteed ...";
        this.faildUserMessage = "";
        setTimeout(() => {
          this.$router.push({
            name: "Home",
          });
        }, 2000);
      } else {
        this.successUserMessage = "";
        this.faildUserMessage = "something error ...";
      }
    },
  },
};
</script>

<style></style>
