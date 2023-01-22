<template>
  <div class="container text-center w-25 mx-auto">
    <NavBar />
    <form @click.prevent>
      <div class="row g-3 align-items-center">
        <div class="col-ato mx-auto d-block">
          <h1>Dlelte Category #{{ categoryId }}</h1>
          <h5 class="w-100">Category Name: {{ categoryName }}</h5>
          <p class="text-danger fw-bold">
            Are you sure you want to delete this category?
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
          <button class="btn btn-danger ms-2" @click="DeleteCategory()">
            Delete Now
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
  name: "DeleteCategory",
  data() {
    return {
      locationId: parseInt(this.$route.params.locId),
      categoryId: parseInt(this.$route.params.catId),
      userId: "",
      successUserMessage: "",
      faildUserMessage: "",
      categoryName: "",
      locationData: [],
      ItemsIdis: [],
    };
  },
  // props: ["locationId"],
  components: {
    NavBar,
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "signup" });
    } else {
      this.userId = JSON.parse(user).id;
      this.canCurrentUserAccessThisLocation();
      this.canThisUserAccessToCategory();
      let result = await axios.get(
        `http://localhost:3000/items?catId=${this.categoryId}`
      );
      for (let i = 0; i < result.data.length; i++) {
        this.ItemsIdis.push(result.data[i].id);
      }
    }
  },
  methods: {
    backToViewCategory() {
      this.$router.push({
        name: "viewCategories",
        params: { locationId: this.locationId },
      });
    },
    async canCurrentUserAccessThisLocation() {
      console.log(
        "user",
        this.userId,
        "locationId",
        this.locationId,
        "categoryId",
        this.categoryId
      );
      let result = await axios.get(
        `http://localhost:3000/locations?id=${this.locationId}&userId=${this.userId}`
      );
      if (result.status == 200 && result.data.length > 0) {
        this.locationData = result.data;
        // this.name = this.locationData[0].name;
        // this.phone = this.locationData[0].phone;
        // this.address = this.locationData[0].address;
      } else {
        console.log("locations to home");
        this.$router.push({ name: "Home" });
      }
    },
    async DeleteCategory() {
      let result = await axios.delete(
        `http://localhost:3000/categories/${this.categoryId}`
      );
      console.log(result);
      let allResults = [];
      for (let i = 0; i < this.ItemsIdis.length; i++) {
        let result = await axios.delete(
          `http://localhost:3000/items/${this.ItemsIdis[i]}`
        );
        console.log(result, "items", "ids:", this.ItemsIdis);
        if (result.status == 200) {
          allResults.push(true);
        } else {
          allResults.push(false);
        }
      }
      console.log(allResults);
      if (result.status == 200 && !allResults.includes(false)) {
        this.successUserMessage =
          "Categyory and related items are deleteed ...";
        this.faildUserMessage = "";
        setTimeout(() => {
          this.$router.push({
            name: "viewCategories",
            params: { locationId: this.locationId },
          });
        }, 2000);
      } else {
        this.successUserMessage = "";
        this.faildUserMessage = "something error ...";
      }
    },
    async canThisUserAccessToCategory() {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${this.userId}&locationId=${this.locationId}&id=${this.categoryId}`
      );
      if (result.status == 200) {
        this.categoryName = result.data[0].name;
        if (result.data.length != 1) {
          console.log("category to home");

          this.$router.push({
            name: "viewCategories",
            params: { locationId: this.locationId },
          });
        }
      }
    },
  },
};
</script>

<style></style>
