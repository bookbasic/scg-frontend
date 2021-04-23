<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1 class="float-left">Product</h1>
        <b-button class="float-right" @click="open(item)">Add Product</b-button>
      </div>
    </div>
    <table class="table table-condensed">
      <thead>
        <tr>
          <th @click="sort('code')">
            Code
            <b-icon-chevron-expand v-if="sortCol.substr(0, sortCol.length - 2) != 'code'"></b-icon-chevron-expand>
            <b-icon-chevron-up v-if="sortCol == 'code+1'"></b-icon-chevron-up>
            <b-icon-chevron-down v-if="sortCol == 'code-1'"></b-icon-chevron-down>
          </th>
          <th @click="sort('name')">
            Name
            <b-icon-chevron-expand
              v-if="sortCol.substr(0, sortCol.length - 2) != 'name'"
            ></b-icon-chevron-expand>
            <b-icon-chevron-up v-if="sortCol == 'name+1'"></b-icon-chevron-up>
            <b-icon-chevron-down
              v-if="sortCol == 'name-1'"
            ></b-icon-chevron-down>
          </th>
          <th @click="sort('price')" class="d-none d-md-block">
            Price
            <b-icon-chevron-expand
              v-if="sortCol.substr(0, sortCol.length - 2) != 'price'"
            ></b-icon-chevron-expand>
            <b-icon-chevron-up v-if="sortCol == 'price+1'"></b-icon-chevron-up>
            <b-icon-chevron-down
              v-if="sortCol == 'price-1'"
            ></b-icon-chevron-down>
          </th>
          <th width="60px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.code }}</td>
          <td>{{ item.name }}</td>
          <td class="d-none d-md-block">{{ item.price }}</td>
          <td>
            <a href="#">
              <b-icon-pencil class="mr-2" @click="open(item)"></b-icon-pencil>
            </a>
            <a href="#">
              <b-icon-trash class="ml-2" @click="onDelete(item.id)">
              </b-icon-trash>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <div class="col">
        <b-form-select
          class="float-right ml-2"
          style="width: 100px"
          v-model="perPage"
          :options="perPageOption"
          @change="getList"
        ></b-form-select>
        <div @click="getList" class="float-right">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
          ></b-pagination>
        </div>
      </div>
    </div>

    <b-modal id="modal-1" title="Product" hide-footer>
      <div class="row">
        <div class="col-12">
          <b-form @submit="onSubmit">
            <div class="row">
              <div class="col-12 col-md-4 text-left pt-2">Code</div>
              <div class="col-12 col-md-8">
                <b-form-input
                  id="input-1"
                  v-model="form.code"
                  placeholder="Enter Code"
                  required
                ></b-form-input>
              </div>
              <div class="col-12 col-md-4 text-left pt-2">Name</div>
              <div class="col-12 col-md-8">
                <b-form-input
                  id="input-1"
                  v-model="form.name"
                  placeholder="Enter Name"
                  required
                ></b-form-input>
              </div>
              <div class="col-12 col-md-4 text-left pt-2">Price</div>
              <div class="col-12 col-md-8">
                <b-form-input
                  id="input-2"
                  v-model="form.price"
                  type="number"
                  placeholder="Enter Price"
                  required
                ></b-form-input>
              </div>
              <div class="col-12 pt-2">
                <b-form-checkbox
                  switch
                  size="lg"
                  v-model="form.active"
                  class="float-left pt-1 d-none"
                  >Active</b-form-checkbox
                >
                <b-button class="float-right" type="submit" variant="primary"
                  >Submit</b-button
                >
              </div>
            </div>
          </b-form>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import _config from "../_config";

export default {
  data() {
    return {
      perPageOption: [
        { text: "5 rows", value: 5 },
        { text: "10 rows", value: 10 },
        { text: "20 rows", value: 20 },
      ],
      perPage: 5,
      currentPage: 1,
      rows: 0,
      sortCol: "",
      list: [],
      form: {
        id: "",
        code: "",
        name: "",
        price: "",
        active: true,
      },
      show: true,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    sort(col) {
      if (this.sortCol == col + "-1") this.sortCol = col + "+1";
      else this.sortCol = col + "-1";
      this.getList();
    },
    getList() {
      fetch(
        _config.apiDomain +
          "/product?isDelete=false" +
          "&skip=" +
          (this.currentPage - 1) * this.perPage +
          (this.sortCol == "" ? "" : "&sort=" + this.sortCol),
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        }
      )
        .then(async (response) => {
          if (response.status == 401) this.$store.state.setExpire();
          const result = await response.json();
          this.list = result.data;
          this.rows = result.total;
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },
    open(item) {
      this.$bvModal.show("modal-1");
      if (item) this.form = item;
      else
        this.form = {
          id: "",
          code: "",
          name: "",
          price: "",
          active: true,
        };

      console.log(item ? item.id : "none");
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.form.id == "") delete this.form.id;
      fetch(
        _config.apiDomain + "/product/" + (this.form.id ? this.form.id : ""),
        {
          method: this.form.id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
          body: JSON.stringify(this.form),
        }
      )
        .then((response) => response.json())
        .then((result) => {
          console.log("Success:", result);
          this.$bvModal.hide("modal-1");
          this.getList();
        });
    },
    onDelete(id) {
      fetch(_config.apiDomain + "/product/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("Success:", result);
          this.$bvModal.hide("modal-1");
          this.getList();
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
</style>
