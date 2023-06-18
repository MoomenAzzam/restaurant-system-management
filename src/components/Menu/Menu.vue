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
          name: 'AddNewItem',
          params: { locationId: locationId },
        }"
      >
        <button class="btn btn-success float-end" v-if="numberOfCategories > 0">
          View/Add Item
        </button>
      </router-link>
      <div class="clearfix"></div>
      <div class="text-center">
        <h2>{{ locationName }}</h2>
        <p>{{ locationAddress }}</p>
      </div>
    </div>
    <div class="row">
      <div v-for="(cat, i) in listOfCategories" :key="i" class="col-12 row">
        <h3 class="fw-bold bg-dark text-white p-3 rounded">{{ cat.name }}</h3>
        <div>
          <div v-for="(item, j) in listOfItems" :key="j">
            <!-- :class="{
              'col-xs-12 col-sm-4 card p-4 m-3': cat.id == item.catId,
            }" -->
            <div v-if="cat.id == item.catId" class="col-12">
              <div class="card my-3 p-1">
                <div class="">
                  <h4 class="float-start fw-bold mt-4">{{ item.name }}</h4>
                </div>
                <div class="clearfix"></div>
                <p class="text-muted">{{ item.description }}</p>
                <div class="align-item-center d-flex justify-content-between">
                  <p class="text-muted float-start">Price:{{ item.price }}</p>
                  <p class="text-muted float-end">Quantity:{{ item.quant }}</p>
                </div>
                <div class="align-item-center d-flex justify-content-between">
                  <router-link
                    :to="{
                      name: 'UpdateItem',
                      params: { itemId: item.id, locId: locationId },
                    }"
                  >
                    <button class="btn btn-warning">Update Item</button>
                  </router-link>
                  <router-link
                    :to="{
                      name: 'DeleteItem',
                      params: { itemId: item.id, locId: locationId },
                    }"
                  >
                    <button class="btn btn-danger">Delete Item</button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
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
      username: "",
      userId: "",
      locationId: this.$route.params.locId,
      listOfCategories: [],
      listOfItems: [],
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
    let resultCategories = await axios.get(
      `http://localhost:3000/categories?userId=${this.userId}&locationId=${this.locationId}`
    );
    if (resultCategories.status == 200) {
      this.listOfCategories = resultCategories.data;
      this.numberOfCategories = resultCategories.data.length;
    }

    // *******************validate to get data to diplay it**************************
    let resultItems = await axios.get(
      `http://localhost:3000/items?userId=${this.userId}&locId=${this.locationId}`
    );
    if (resultItems.status == 200 && resultItems.data.length > 0) {
      this.listOfItems = resultItems.data;
      this.numberOfCategories = resultItems.data.length;
    }

    // ********************validate if Can user access *************************
    let locationResults = await axios.get(
      `http://localhost:3000/locations?userId=${this.userId}&id=${this.locationId}`
    );
    if (locationResults.status == 200 && locationResults.data.length == 1) {
      this.listOfLocatioins = locationResults.data;
      this.locationName = this.listOfLocatioins[0].name;
      this.locationAddress = this.listOfLocatioins[0].address;
    } else {
      this.$router.push({ name: "Home" });
    }
  },
};
</script>

<style></style>
