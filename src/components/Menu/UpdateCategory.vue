<template>
  <div class="container">
    <NavBar />
    <div>
      <router-link
        :to="{
          name: 'viewCategories',
          params: { locationId: locationId },
        }"
      >
        <button class="btn btn-info">Back To Categories</button>
      </router-link>
      &nbsp;&nbsp;&nbsp;
      <router-link
        :to="{
          name: 'Menu',
          params: { locationId: locationId },
        }"
      >
        <button class="btn btn-success">Back To Menu</button>
      </router-link>
    </div>
    <div class="text-center">
      <h1 class="mb-0">{{ locationName }}</h1>
      <p class="text-muted">{{ locationAddress }}</p>
    </div>
    <br />
    <form @click.prevent>
      <div class="container text-center">
        <h2 class="mb-4">Update Category</h2>
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <input
              type="text"
              class="form-control"
              placeholder="Update Category Name"
              v-model="name"
            />
            <span class="error-feedback" v-if="v$.name.$error">{{
              v$.name.$errors[0].$message
            }}</span>
          </div>
        </div>
        <br />
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
      <div class="row g-3 align-items-center">
        <div class="col-auto d-block mx-auto">
          <button
            type="button"
            class="btn btn-success"
            @click="updateCategory()"
          >
            Update Now
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "@/components/header/header.vue";
import useValidate from "@vuelidate/core";
import { required, minLength, maxLength } from "@vuelidate/validators";
export default {
  name: "UpdateCategory",
  components: { NavBar },
  data() {
    return {
      v$: useValidate(),
      userId: "",
      listOfCategories: [],
      locationId: parseInt(this.$route.params.locId),
      categoryId: parseInt(this.$route.params.catId),
      categoryName: "",
      locationName: "",
      locationAddress: "",
      name: "",
      successUserMessage: "",
      faildUserMessage: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(3), maxLength: maxLength(15) },
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "Signup" });
    } else {
      this.userName = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
    }
    // *********************************************
    let locationResults = await axios.get(
      `http://localhost:3000/categories?userId=${this.userId}&locationId=${this.locationId}`
    );
    if (locationResults.status == 200 && locationResults.data.length > 0) {
      // console.log("can access");
      this.listOfLocatioins = locationResults.data;
      this.categoryName = this.listOfLocatioins[0].name;
      if (this.categoryName) {
        this.name = this.categoryName;
      }
    }
    //************************************************* */
    let locationResult = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
    );
    if (locationResult.status == 200 && locationResult.data.length > 0) {
      // console.log("can access");
      this.listOfLocatioins = locationResult.data;
      this.locationName = this.listOfLocatioins[0].name;
      this.locationAddress = this.listOfLocatioins[0].address;
    }
    this.canThisUserAccessToCategory();
  },
  methods: {
    async updateCategory() {
      this.v$.$validate();
      let filterCategoryName = this.listOfCategories.filter(
        (v) => v.name.toLocaleLowerCase() == this.name.toLocaleLowerCase()
      );
      if (!this.v$.$error) {
        console.log("validated");
        if (filterCategoryName.length > 0) {
          this.faildUserMessage =
            "Category Name Already exists, try another name";
          this.successUserMessage = "";
        } else {
          let result = await axios.put(
            `http://localhost:3000/categories/${this.categoryId}`,
            {
              name: this.name,
              userId: this.userId,
              locationId: parseInt(this.locationId),
            }
          );
          if (result.status == 200) {
            this.successUserMessage = "Update New Category Successfully!";
            this.faildUserMessage = "";
            setTimeout(() => {
              this.$router.push({
                name: "viewCategories",
                params: { locationId: this.locationId },
              });
            }, 1000);
          } else {
            this.successUserMessage = "";
            this.faildUserMessage = "Something went wrong, try agein pleas";
          }
        }
      } else {
        this.successUserMessage = "";
        this.faildUserMessage = "You Must Fill In Category Name";
      }
    },
    async canThisUserAccessToCategory() {
      let result = await axios.get(
        `http://localhost:3000/categories?userId=${this.userId}&locationId=${this.locationId}&id=${this.categoryId}`
      );
      if (result.status == 200) {
        this.listOfCategories = result.data;
        if (this.listOfCategories.length != 1) {
          this.$router.push({ name: "Home" });
        }
      }
    },
  },
};
</script>

<style></style>
