<template>
  <div class="container">
    <div class="row">
      <h3 class="col-4 col-md-2">Machine</h3>
      <div class="col-8 col-md-4">
        <b-form-select
          v-model="machine"
          :options="machineOption"
          @change="goto('/stock/' + machine)"
        ></b-form-select>
      </div>
      <div class="col-12 col-md-6 text-right">
        <b-button @click="open(item)" v-if="role == 'admin'"
          >Add Stock</b-button
        >
      </div>
    </div>
    <table class="table table-condensed">
      <thead>
        <tr>
          <th>Product</th>
          <th>Remain</th>
          <th width="100">Action</th>
          <th class="text-center">Item</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td @click="open(item)">{{ item.product.code }}</td>
          <td>{{ item.remain }}</td>
          <td>
            <a v-if="role == 'admin'">
              <b-icon-pencil class="" @click="open(item)"></b-icon-pencil>
            </a>
            <a v-if="role == 'admin'">
              <b-icon-trash class="mx-2" @click="onDelete(item.id)">
              </b-icon-trash>
            </a>
            <a>
              <b-icon-card-list
                class=""
                @click="goto('/transaction/' + item.id)"
              >
              </b-icon-card-list>
            </a>
          </td>
          <td>
            <b-form>
              <div class="row">
                <b-form-input
                  class="d-none"
                  v-model="form2[item.id].stock"
                  placeholder="Refill"
                  required
                ></b-form-input>
                <div class="col-12 col-md-2 pt-1 text-right">Refill</div>
                <div class="col-12 col-md-2">
                  <b-form-input
                    v-model="form2[item.id].add"
                    placeholder="Refill"
                    required
                  ></b-form-input>
                </div>
                <div class="col-12 col-md-2 pt-1 text-right">Remove</div>
                <div class="col-12 col-md-2">
                  <b-form-input
                    v-model="form2[item.id].sub"
                    placeholder="Remove"
                    required
                  ></b-form-input>
                </div>
                <div class="col-12 col-md-2 pt-1 text-right">Diff</div>
                <div class="col-12 col-md-2">
                  <b-form-input
                    v-model="form2[item.id].diff"
                    placeholder="Diff"
                    required
                  ></b-form-input>
                </div>
              </div>
            </b-form>
          </td>
        </tr>
      </tbody>
    </table>
    <b-button class="float-right" @click="submitTransaction" variant="primary"
      >Submit</b-button
    >

    <b-modal id="modal-1" hide-footer>
      <div class="row">
        <div class="col-12">
          <b-form @submit="onSubmit">
            <div class="row">
              <div class="col-12 col-md-4 text-left pt-2 d-none">machine</div>
              <div class="col-12 col-md-8 d-none">
                <b-form-input
                  id="input-1"
                  v-model="form.machine._id"
                  placeholder="Enter Username"
                  required
                ></b-form-input>
              </div>
              <div class="col-12 col-md-4 text-left pt-2">product</div>
              <div class="col-12 col-md-8">
                <b-form-select
                  v-model="form.product._id"
                  :options="productOption"
                ></b-form-select>
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
      role: localStorage.getItem("role"),
      machine: this.$route.params.id,
      sortCol: "",
      list: [],
      machineOption: [],

      form: {
        machine: { _id: this.$route.params.id },
        product: { _id: "" },
        id: "",
        productOption: [],
        quantity: "",
        active: true,
      },
      form2: [],
      show: true,
    };
  },
  created() {
    this.form.machine._id = this.$route.params.id;
    console.log(this.$route.params.id);
    this.getList();
    this.getMachine();
    this.getProduct();
  },
  methods: {
    goto(url) {
      this.$router.push(url);
    this.getList();
    this.getMachine();
    this.getProduct();
    },

    changeMachine() {
      console.log("/stock/" + this.machine);
      this.$router.push("/stock/" + this.machine);
    },

    getMachine() {
      this.machineOption = [{ text: "Select Machine", value: null }];
      fetch(
        _config.apiDomain +
          "/machine?isDelete=false&limit=999999" +
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

          for (var i in result.data) {
            console.log(result.data[i]);
            this.machineOption.push({
              text: result.data[i].name,
              value: result.data[i].id,
            });
          }
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },

    getProduct() {
      this.productOption = [{ text: "Select Product", value: null }];
      fetch(_config.apiDomain + "/product?isDelete=false&limit=999999", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      })
        .then(async (response) => {
          if (response.status == 401) this.$store.state.setExpire();
          const result = await response.json();
          for (var i in result.data)
            this.productOption.push({
              text: result.data[i].code + " - " + result.data[i].name,
              value: result.data[i].id,
            });
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },
    sort(col) {
      if (this.sortCol == col + "-1") this.sortCol = col + "+1";
      else this.sortCol = col + "-1";
      this.getList();
    },
    getList() {
      this.list = [];
      this.form2 = [];
      fetch(
        _config.apiDomain +
          "/stock?limit=1000&isDelete=false&machine=" +
          this.$route.params.id,
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
          for (var i in this.list)
            this.form2[this.list[i].id] = {
              stock: this.list[i].id,
              add: 0,
              sub: 0,
              remain: this.list[i].remain,
              diff: 0,
            };
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
          machine: { _id: this.$route.params.id },
          product: { _id: "" },
          id: "",
          quantity: "",
          active: true,
        };
      console.log(item ? item.id : "none");
    },
    submitTransaction() {
      for (var i in this.form2) this.onSubmitForm2(this.form2[i]);
      //console.log(this.form2);
    },
    onSubmitForm2(item) {
      if (item.id == "") delete item.id;
      if (item.add == 0 && item.sub == 0 && item.diff == 0) return;
      item.remain = item.remain * 1 + item.add * 1 - item.sub * 1;
      fetch(_config.apiDomain + "/transaction/" + (item.id ? item.id : ""), {
        method: item.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        body: JSON.stringify(item),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(item.id + " - Success:", result);
          this.getList();
        });
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.form.id == "") delete this.form.id;
      fetch(
        _config.apiDomain + "/stock/" + (this.form.id ? this.form.id : ""),
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
          //this.$store.state.setMenu(result.username, result.role);
          //localStorage.setItem('user', JSON.stringify(result));
          //this.props.allprod()
        });
      //alert(JSON.stringify(this.form));
    },
    onDelete(id) {
      fetch(_config.apiDomain + "/stock/" + id, {
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

