<template>
  <div class="container">
    <table class="table caption-top" v-if="allLocations.length > 0">
      <caption class="mt-2">
        List Of Locations
        <span> {{ allLocations.length }}</span>
        <span class="float-end">
          <router-link
            :to="{
              name: 'DeleteAllLocations',
            }"
          >
            <button class="btn btn-danger">Delete All</button>
          </router-link>
        </span>
      </caption>
      <thead class="table-dark">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Phone</th>
          <th scope="col">Address</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(location, i) in allLocations" :key="i">
          <th scope="row">{{ location.name }}</th>
          <td class="m-3">{{ location.phone }}</td>
          <td>{{ location.address }}</td>
          <td>
            <router-link
              :to="{
                name: 'DeleteLocation',
                params: { id: location.id },
              }"
            >
              <button class="btn btn-danger">Delete</button>
            </router-link>
            &nbsp;
            <router-link
              :to="{
                name: 'UpdateLocation',
                params: { id: location.id },
              }"
            >
              <button class="btn btn-info text-light">Update</button>
            </router-link>
            &nbsp;
            <router-link
              :to="{
                name: 'Menu',
                params: { locId: location.id },
              }"
            >
              <button class="btn btn-success">Menu</button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="alert alert-warning mt-3" v-else>No Locations Added</div>
  </div>
</template>

<script>
export default {
  name: "UserLocations",
  props: ["allLocations"],
};
</script>

<style>
td,
th {
  line-height: 2.5;
}
</style>
