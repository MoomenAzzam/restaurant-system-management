<template>
  <div class="container">
    <NavBar />
    <div>
      <router-link
        :to="{
          name: 'AddNewCategory',
          params: { locationId: locationId },
        }"
      >
        <button class="btn btn-info">Add Categories</button>
      </router-link>
      &nbsp;&nbsp;&nbsp;
      <!-- if you add / after link you go this link you added , if you do not add / you added your path to the main link  -->
      <!-- اذا بتحط / قبل الرابط بروديك على الرابط اللي انتا حاططه \,اما اذا ما بتحط / بضيف الرابط على الرابط الموجود في المتصفح وبتروح لماكن مش معروف -->
      <router-link
        :to="{
          name: 'Menu',
          params: { locationId: locationId },
        }"
      >
        <button class="btn btn-success">Back To Menu</button>
      </router-link>
    </div>
    <div class="container">
      <table class="table caption-top" v-if="listOfCategories.length > 0">
        <caption class="mt-2">
          List Of Categories
          <span> {{ listOfCategories.length }}</span>
          <span class="float-end">
            <router-link
              :to="{
                name: 'DeleteAllCategories',
                params: { locationId: locationId },
              }"
            >
              <button class="btn btn-danger">Delete All</button>
            </router-link>
          </span>
        </caption>
        <thead class="table-dark">
          <tr>
            <th scope="col" class="w-50">Name</th>
            <th scope="col" class="w-50">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(category, i) in listOfCategories" :key="i">
            <th scope="row">{{ category.name }}</th>
            <td>
              <!-- مش عارف ليش هادي الطريقة في تمرير الباراميتر ما كانت تزبط ,سبحان الله 😂😂 -->
              <!-- بعد مندة من الكومينت الاول انا حذفت الطريقة الاولى و عدلت كل الاكواد وكله بخير  -->
              <router-link
                :to="{
                  name: 'UpdateCategory',
                  params: { locId: locationId, catId: category.id },
                }"
              >
                <button class="btn btn-info text-light">Update</button>
              </router-link>

              &nbsp;

              <router-link
                :to="{
                  name: 'DeleteCategory',
                  params: { locId: locationId, catId: category.id },
                }"
              >
                <button class="btn btn-danger">Delete</button>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="alert alert-warning mt-3" v-else>No Categories yet</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "@/components/header/header.vue";
export default {
  name: "viewCategories",
  components: { NavBar },
  data() {
    return {
      userId: "",
      listOfCategories: [],
      locationId: this.$route.params.locId,
      locationName: "",
      locationAddress: "",
      // locationNumber: "",
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
    // *******************validate to get data to diplay it**************************
    let result = await axios.get(
      `http://localhost:3000/categories?userId=${this.userId}&locationId=${this.locationId}`
    );

    if (result.status == 200 && result.data.length > 0) {
      this.listOfCategories = result.data;
      this.numberOfCategories = result.data.length;
    }
    //  else {
    //   console.log("no data");
    //   this.$router.push({ name: "Home" });
    // }
    // *********************************************
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
