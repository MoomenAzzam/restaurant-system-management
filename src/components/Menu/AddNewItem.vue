<template>
  <div class="container">
    <NavBar />

    <button class="btn btn-info" @click="backToMenu()">Back To Menu</button>
    <div class="text-center">
      <h1 class="mb-0">{{ locationName }}</h1>
      <p class="text-muted">{{ locationAddress }}</p>
    </div>
    <br />
    <form @click.prevent>
      <div class="container text-center">
        <h2 class="mb-4">Add New Item</h2>
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control MW-250"
                id="floatingName"
                placeholder="Item Name"
                v-model.trim="itemName"
              />
              <label for="floatingName">Name Item</label>
              <span class="error-feedback" v-if="v$.itemName.$error">{{
                v$.itemName.$errors[0].$message
              }}</span>
            </div>
          </div>
        </div>
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <div class="form-floating mb-3">
              <input
                type="number"
                class="form-control MW-250"
                id="floatingPrice"
                placeholder="Item Price"
                v-model.trim="itemPrice"
              />
              <label for="floatingPrice">Item Price</label>
              <span class="error-feedback" v-if="v$.itemPrice.$error">{{
                v$.itemPrice.$errors[0].$message
              }}</span>
            </div>
          </div>
        </div>
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <div class="form-floating mb-3">
              <input
                type="number"
                class="form-control MW-250"
                id="floatingQuantity"
                placeholder="Quantity Number"
                v-model.trim="itemQuant"
              />
              <label for="floatingQuantity">Quantity Number</label>
              <span class="error-feedback" v-if="v$.itemQuant.$error">{{
                v$.itemQuant.$errors[0].$message
              }}</span>
            </div>
          </div>
        </div>
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <div class="form-floating mb-3">
              <textarea
                class="form-control MW-250 MH-200"
                id="floatingDescription"
                placeholder="Item Description"
                v-model.trim="itemDesc"
              />
              <label for="floatingDescription">Item Description</label>
              <span class="error-feedback" v-if="v$.itemDesc.$error">{{
                v$.itemDesc.$errors[0].$message
              }}</span>
            </div>
          </div>
        </div>
        <div class="row g-3 align-items-center">
          <div class="col-auto d-block mx-auto">
            <div class="form-floating mb-3">
              <select
                class="form-select MW-250"
                id="floatingSelectCategory"
                v-model="pickedCategory"
              >
                <option
                  v-for="(cat, i) in listOfCategories"
                  :key="i"
                  :value="cat.id"
                >
                  {{ cat.name }}
                </option>
              </select>
              <label for="floatingSelectCategory">Select category</label>
              <span class="error-feedback" v-if="v$.pickedCategory.$error">{{
                v$.pickedCategory.$errors[0].$message
              }}</span>
            </div>
          </div>
        </div>
        <br />
        <div
          class="alert alert-success MW-200"
          role="alert"
          v-if="successUserMessage.length > 0"
        >
          {{ successUserMessage }}
        </div>
        <div
          class="alert alert-danger MW-200"
          role="alert"
          v-if="faildUserMessage.length > 0"
        >
          {{ faildUserMessage }}
        </div>
      </div>
      <div class="row g-3 align-items-center mb-3">
        <div class="col-auto d-block mx-auto">
          <button type="button" class="btn btn-success" @click="AddNewItem()">
            Add Now
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
import { required, minLength, maxLength, between } from "@vuelidate/validators";
export default {
  name: "AddNewItem",
  data() {
    return {
      v$: useValidate(),
      locationName: "",
      locationAddress: "",
      // locationNumber: "",
      username: "",
      userId: "",
      locationId: this.$route.params.locId,
      listOfCategories: [],
      numberOfCategories: "",
      successUserMessage: "",
      faildUserMessage: "",
      itemName: "",
      itemPrice: "",
      itemQuant: "",
      itemDesc: "",
      pickedCategory: "",
    };
  },
  validations() {
    return {
      itemName: { required, minLength: minLength(3), maxLength: maxLength(15) },
      itemPrice: { required, between: between(1, 1000000) },
      itemDesc: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(200),
      },
      itemQuant: {
        required,
        between: between(1, 100000),
      },
      pickedCategory: { required },
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
    this.canThisUserAccessToItem();
    // *******************validate to get data to diplay it**************************
    // console.log(this.userId, this.locationId);
    let result = await axios.get(
      `http://localhost:3000/categories?userId=${this.userId}&locationId=${this.locationId}`
    );
    // console.log(result.data);

    if (result.status == 200 && result.data.length > 0) {
      this.listOfCategories = result.data;
      this.numberOfCategories = result.data.length;
    } else {
      console.log("no data", this.userId, this.locationId);
      console.log(4);
      this.$router.push({ name: "Home" });
    }
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
    } else {
      this.$router.push({ name: "Home" });
    }
  },
  methods: {
    async AddNewItem() {
      this.v$.$validate();
      console.log("AddNewItem");

      if (!this.v$.$error) {
        const addItemResult = await axios.post(`http://localhost:3000/items`, {
          name: this.itemName,
          price: parseFloat(this.itemPrice).toFixed(2),
          quant: parseInt(this.itemQuant),
          description: this.itemDesc,
          userId: this.userId,
          locId: parseInt(this.locationId),
          catId: this.pickedCategory,
        });
        console.log("status", addItemResult.data, addItemResult.status);
        if (addItemResult.status == 201) {
          this.successUserMessage = "Add New Item Successfully!";
          this.faildUserMessage = "";
          setTimeout(() => {
            this.$router.push({
              name: "Menu",
              params: { id: this.locationId },
            });
          }, 1000);
        } else {
          this.successUserMessage = "";
          this.faildUserMessage = "Something went wrong, try agein pleas";
        }
        console.log("validated");
      } else {
        console.log("error");
      }
    },
    backToMenu() {
      this.$router.push({
        name: "Menu",
        params: { id: this.locationId },
      });
    },
    async canThisUserAccessToItem() {
      let result = await axios.get(
        `http://localhost:3000/items?userId=${this.userId}&locationId=${this.locationId}`
      );
      console.log(result);
      if (result.status == 200) {
        this.listOfItems = result.data;
      } else {
        this.$router.push({ name: "Home" });
      }
    },
  },
};
</script>

<style>
.MW-250 {
  min-width: 250px;
}
.MH-200 {
  height: 150px !important;
}
</style>
