import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignUp from "../views/SignUp.vue";
import login from "@/views/Login.vue";
import profile from "@/views/Profile.vue";
import ErrorPage from "@/views/ErrorPage.vue";
import updateProfile from "@/components/profile/UpdateProfile.vue";
import AddLocation from "@/components/locations/AddNewLocation.vue";
import DeleteLocation from "@/components/locations/DeleteLocation.vue";
import DeleteAllLocations from "@/components/locations/DeleteAllLocations.vue";
import UpdateLocation from "@/components/locations/UpdateLocation.vue";
import Menu from "@/components/Menu/Menu.vue";
import AddNewCategory from "@/components/Menu/AddNewCategory.vue";
import viewCategories from "@/components/Menu/viewCategories.vue";
import UpdateCategory from "@/components/Menu/UpdateCategory.vue";
import DeleteCategory from "@/components/Menu/DeleteCategory.vue";
import DeleteAllCategory from "@/components/Menu/DeleteAllCategories.vue";
import AddNewItem from "@/components/Menu/AddNewItem.vue";
import UpdateItem from "@/components/Menu/UpdateItem.vue";
import DeleteItem from "@/components/Menu/DeleteItem.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignUp,
  },
  {
    path: "/login",
    name: "Login",
    component: login,
  },
  {
    path: "/profile",
    name: "Profile",
    component: profile,
  },
  {
    path: "/updateProfile",
    name: "UpdateProfile",
    component: updateProfile,
  },
  {
    path: "/AddLocation",
    name: "AddLocation",
    component: AddLocation,
  },
  {
    path: "/DeleteLocation/:id",
    name: "DeleteLocation",
    component: DeleteLocation,
  },
  {
    path: "/DeleteAllLocations",
    name: "DeleteAllLocations",
    component: DeleteAllLocations,
  },
  {
    path: "/UpdateLocation/:id",
    name: "UpdateLocation",
    component: UpdateLocation,
  },
  {
    path: "/Menu/locations/:locId",
    name: "Menu",
    component: Menu,
  },
  {
    path: "/Menu/locations/view/add/:locId",
    name: "AddNewCategory",
    component: AddNewCategory,
  },
  {
    path: "/Menu/locations/view/:locId",
    name: "viewCategories",
    component: viewCategories,
  },
  {
    path: "/Menu/locations/view/update/:locId/:catId",
    name: "UpdateCategory",
    component: UpdateCategory,
  },
  {
    path: "/Menu/locations/view/delete/loc/:locId/item/:catId",
    name: "DeleteCategory",
    component: DeleteCategory,
  },
  {
    path: "/Menu/locations/view/delete/all/loc/:locId",
    name: "DeleteAllCategories",
    component: DeleteAllCategory,
  },
  {
    path: "/Menu/add/new/item/:locId",
    name: "AddNewItem",
    component: AddNewItem,
  },
  {
    path: "/Menu/item/update/:itemId/loc/:locId",
    name: "UpdateItem",
    component: UpdateItem,
  },
  {
    path: "/Menu/item/delete/:itemId/loc/:locId",
    name: "DeleteItem",
    component: DeleteItem,
  },
  {
    path: "/:catchAll(.*)",
    name: "ErrorPage",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.name;
  if (to.params.pageTitle != undefined) {
    document.title = to.name;
    if (to.name == null) {
      document.title == `Unknow Page`;
    } else {
      document.title = `${to.name} | ${process.env.VUE_APP_TITLE}`;
    }
  }
  next();
});

export default router;
// /Menu/item/update/2/loc/6
