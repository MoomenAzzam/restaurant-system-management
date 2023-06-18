<template>
  <div class="container">
    <NavBar />
    <div class="home text-end">
      <p>
        Welcome {{ userName }}
        <router-link
          :to="{
            name: 'Profile',
          }"
        >
          <button class="btn btn-info text-light" type="button">Profile</button>
        </router-link>
      </p>
    </div>
    <router-link
      :to="{
        name: 'AddLocation',
      }"
    >
      <button type="button" class="btn btn-primary">
        Add New Restaurant
      </button></router-link
    >
    <UserLocations :allLocations="listOflocation" />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from "@/components/header/header.vue";
import UserLocations from "@/components/locations/UserLocations.vue";
import axios from "axios";
export default {
  name: "HomeView",
  data() {
    return {
      userName: "",
      userId: "",
      listOflocation: [],
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
    let result = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}`
    );
    if (result.status == 200 && result.data.length > 0) {
      this.listOflocation = result.data;
    }
  },
  components: {
    NavBar,
    UserLocations,
  },
};
</script>
