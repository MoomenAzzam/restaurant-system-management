<template>
  <div class="container mt-5">
    <NavBar />

    <button class="btn btn-info" @click="backToMenu()">Back To Menu</button>
    <br />
    <div class="row g-3 align-items-center text-center">
      <div class="col-ato mx-auto d-block">
        <h1>Dlelte Item #{{ itemId }}</h1>
        <h5 class="w-100">Item Name: {{ itemName }}</h5>
        <h5 class="w-100">Item Description: {{ itemDesc }}</h5>
        <p class="text-danger fw-bold">
          Are you sure you want to delete this item?
        </p>
      </div>
    </div>
    <div class="row g-3 align-items-center text-center">
      <div class="col-ato mx-auto d-block">
        <button class="btn btn-danger ms-2" @click="DeleteItem()">
          Delete Now
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "DeleteItemView",
  data() {
    return {
      username: "",
      userId: "",
      locationId: this.$route.params.locId,
      itemId: this.$route.params.itemId,
      successUserMessage: "",
      faildUserMessage: "",
      itemName: "",
      itemPrice: "",
      itemQuant: "",
      itemDesc: "",
    };
  },
  async mounted() {
    let user = localStorage.getItem("user-info");
    if (!user) {
      this.$router.push({ name: "Signup" });
    } else {
      this.username = JSON.parse(user).name;
      this.userId = JSON.parse(user).id;
    }
    console.log(this.userId, this.locationId, this.itemId);
    // get item data
    const itemData = await axios.get(
      `http://localhost:3000/items?userId=${this.userId}&locId=${this.locationId}&id=${this.itemId}`
    );
    console.log(itemData.data);
    if (itemData.status == 200 && itemData.data.length > 0) {
      console.log(itemData);
      this.itemName = itemData.data[0].name;
      this.itemPrice = itemData.data[0].price;
      this.itemQuant = itemData.data[0].quant;
      this.itemDesc = itemData.data[0].description;
    } else {
      this.$router.push({ name: "Menu" });
    }
  },
  methods: {
    backToMenu() {
      this.$router.push({
        name: "Menu",
        params: { id: this.locationId },
      });
    },
    async DeleteItem() {
      console.log("deleteItem");
      let result = await axios.delete(
        `http://localhost:3000/items/${this.itemId}`
      );
      console.log(result);
      if (result.status == 200) {
        this.$router.push({ name: "Menu" });
      }
    },
  },
};
</script>

<style></style>
