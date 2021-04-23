<template>
  <div class="vue-tempalte">
    <!-- Navigation -->
    <div>
      <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand>
          <router-link class="navbar-brand float-left" to="/"
            >Vending Machine</router-link
          >
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item v-if="showProduct"
              ><router-link class="nav-link p-0" to="/product"
                >Product</router-link
              ></b-nav-item
            >
            <b-nav-item v-if="showMachine"
              ><router-link class="nav-link p-0" to="/machine"
                >Machine</router-link
              ></b-nav-item
            >
            <b-nav-item v-if="showStock"
              ><router-link class="nav-link p-0" to="/stock"
                >Stock</router-link
              ></b-nav-item
            >
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item v-if="!currentUser"
              ><router-link class="nav-link p-0" to="/login"
                >Login</router-link
              ></b-nav-item
            >
            <b-nav-item v-if="currentUser" @click.prevent="logOut"
              ><router-link class="nav-link p-0" to=""
                >LogOut</router-link
              ></b-nav-item
            >
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <div class="pt-3">
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      //currentUser: localStorage.getItem("username"),
      //showProduct: this.$store.state.showProduct,
      //showMachine: this.$store.state.showMachine,
      //showStock: this.$store.state.showStock,
    };
  },
  created() {
    this.$store.state.setMenu();
  },
  computed: {
    currentUser() {
      return this.$store.state.currentUser;
    },

    showProduct() {
      return this.$store.state.showProduct;
    },
    showMachine() {
      return this.$store.state.showMachine;
    },
    showStock() {
      return this.$store.state.showStock;
    },
  },
  methods: {
    logOut() {
      this.$store.state.setLogout();
    },
  },
};
</script>