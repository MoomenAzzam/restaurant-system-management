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
        <button class="btn btn-success float-start">View/Add Categories</button>
      </router-link>
      <router-link
        :to="{
          name: '',
        }"
      >
        <button class="btn btn-success float-end" v-if="numberOfCategories > 0">
          View/Add Categories
        </button>
      </router-link>
      <div class="clearfix"></div>
      <div class="text-center">
        <h2>{{ locationName }}</h2>
        <p>{{ locationAddress }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "@/components/header/header.vue";
export default {
  name: "RestMenu",
  data() {
    return {
      locationName: "",
      locationAddress: "",
      // locationNumber: "",
      username: "",
      userId: "",
      locationId: this.$route.params.locId,
      listOfCategories: [],
      numberOfCategories: "",
    };
  },
  components: {
    NavBar,
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "Signup" });
    } else {
      this.username = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
    }

    // *******************validate to get data to diplay it**************************
    // console.log(this.userId, this.locationId);
    let result = await axios.get(
      `http://localhost:3000/categories?userId=${this.userId}&locationId=${this.locationId}`
    );
    // console.log(result.data);

    if (result.status == 200 && result.data.length > 0) {
      this.listOfCategories = result.data;
      this.numberOfCategories = result.data.length;
    }
    //  else {
    //   console.log("no data", this.userId, this.locationId);
    //   this.$router.push({ name: "Home" });
    // }
    // ********************validate if Can user access *************************
    let locationResults = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
    );
    if (locationResults.status == 200 && locationResults.data.length == 1) {
      // console.log("can access");
      this.listOfLocatioins = locationResults.data;
      // console.log(this.listOfLocatioins[0]);
      this.locationName = this.listOfLocatioins[0].name;
      this.locationAddress = this.listOfLocatioins[0].address;
      // this.locationNumber = this.listOfLocatioins[0].phone;
    }
    // else {
    //   this.$router.push({ name: "Home" });
    // }
  },
};
</script>

<style></style>
