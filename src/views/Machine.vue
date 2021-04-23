<template>
  <div class="container">
    <GmapMap
      class="col-12 mb-3"
      style="height: 400px"
      :zoom="11"
      :center="center"
      @click="mapClick"
      ref="map"
    >
      <GmapMarker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.latLng"
        :label="marker.info"
        :draggable="true"
        @click="mclick(index)"
      />
    </GmapMap>
    <h1 class="float-left">Machine</h1>

    <b-button class="float-right" v-if="role=='admin'" @click="open(item)">Add Machine</b-button>
    <table class="table table-condensed">
      <thead>
        <tr>
          <th @click="sort('code')">
            Code
            <b-icon-chevron-expand
              v-if="sortCol.substr(0, sortCol.length - 2) != 'code'"
            ></b-icon-chevron-expand>
            <b-icon-chevron-up v-if="sortCol == 'code+1'"></b-icon-chevron-up>
            <b-icon-chevron-down
              v-if="sortCol == 'code-1'"
            ></b-icon-chevron-down>
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
          <th width="100px">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.code }}</td>
          <td>{{ item.name }}</td>
          <td>
            <a v-if="role=='admin'">
              <b-icon-pencil class="" @click="open(item)"></b-icon-pencil>
            </a>
            <a v-if="role=='admin'">
              <b-icon-trash class="mx-2" @click="onDelete(item.id)">
              </b-icon-trash>
            </a>
            <a>
              <b-icon-card-list class="" @click="goto('/stock/' + item.id)">
              </b-icon-card-list>
            </a>
            <a>
              <span class="btn btn-primary" @click="goto('/sell/' + item.id)">TestSell
              </span>
            </a>
          </td>
        </tr>
      </tbody>
    </table>

    <b-modal id="modal-1" hide-footer>
      <div class="row">
        <GmapMap
          class="col-12"
          style="height: 350px"
          :zoom="11"
          :center="center"
          @click="mapClick"
          ref="map"
        >
          <GmapMarker :position="mcenter" />
        </GmapMap>

        <div class="col-12">
          <b-form @submit="onSubmit">
            <div class="row">
              <div class="col-12 col-md-4 text-left pt-2">Code</div>
              <div class="col-12 col-md-8">
                <b-form-input
                  id="input-1"
                  v-model="form.code"
                  placeholder="Enter Username"
                  required
                ></b-form-input>
              </div>
              <div class="col-12 col-md-4 text-left pt-2">Name</div>
              <div class="col-12 col-md-8">
                <b-form-input
                  id="input-2"
                  v-model="form.name"
                  placeholder="Enter Password"
                  required
                ></b-form-input>
              </div>
              <div class="col-12 col-md-4 text-left pt-2 d-none">lat</div>
              <div class="col-12 col-md-8 d-none">
                <b-form-input
                  id="input-2"
                  v-model="form.lat"
                  placeholder="Enter lat"
                  required
                ></b-form-input>
              </div>
              <div class="col-12 col-md-4 text-left pt-2 d-none">lng</div>
              <div class="col-12 col-md-8 d-none">
                <b-form-input
                  id="input-1"
                  v-model="form.lng"
                  placeholder="Enter lng"
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
                <b-button class="float-left" @click="goto('/stock/'+form.id)" variant="primary"
                  >Check Stock</b-button
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
      role: localStorage.getItem('role'),
      markers: [],
      place: null,
      center: {},
      mcenter: {},
      sortCol: "",
      list: [],
      form: {
        id: "",
        code: "",
        name: "",
        lat: "",
        lng: "",
        active: true,
      },
      show: true,
    };
  },
  mounted() {
    this.getList();
    this.center = {
      lat: 13.8129450014793,
      lng: 100.53714017291396,
    };
  },
  methods: {
    mclick(ind) {
      this.open(this.list[ind]);
    },
    mapClick(e) {
      console.log(e);
      this.mcenter = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      this.$refs.map.panTo({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
      this.form.lat = e.latLng.lat();
      this.form.lng = e.latLng.lng();
    },
    goto(url) {
      this.$router.push(url);
    },
    sort(col) {
      if (this.sortCol == col + "-1") this.sortCol = col + "+1";
      else this.sortCol = col + "-1";
      this.getList();
    },
    getList() {
      fetch(
        _config.apiDomain +
          "/machine?isDelete=false" +
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
          this.markers = [];
          for (var i in this.list) {
            this.markers.push({
              //icon:{ size: {width: 60, height: 90, f: 'px', b: 'px'},scaledSize: {width: 60, height: 90, f: 'px', b: 'px',},url: require('../assets/green.png')},
              info: this.list[i].code,
              latLng: {
                lat: this.list[i].lat,
                lng: this.list[i].lng,
              },
            });
          }
        })
        .catch((error) => {
          this.errorMessage = error;
          console.error("There was an error!", error);
        });
    },
    open(item) {
      this.$bvModal.show("modal-1");
      if (item) {
        this.form = item;
        this.mcenter.lat = item.lat;
        this.mcenter.lng = item.lng;
        this.center = this.mcenter;
      } else
        this.form = {
          id: "",
          code: "",
          name: "",
          lat: "",
          lng: "",
          active: true,
        };
      console.log(item ? item.id : "none");
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.form.id == "") delete this.form.id;
      fetch(
        _config.apiDomain + "/machine/" + (this.form.id ? this.form.id : ""),
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
      fetch(_config.apiDomain + "/machine/" + id, {
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
