<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-6 offset-md-3">
        <div class="card p-3 bg-light">
          <b-form @submit="onSubmit">
            <div class="row">
              <div class="col-12 col-md-4 text-left pt-2">Username</div>
              <div class="col-12 col-md-8">
                <b-form-input
                  id="input-1"
                  v-model="form.username"
                  placeholder="Enter Username"
                  required
                ></b-form-input>
              </div>
              <div class="col-12 col-md-4 text-left pt-2">Password</div>
              <div class="col-12 col-md-8">
                <b-form-input
                  id="input-2"
                  v-model="form.password"
                  type="password"
                  placeholder="Enter Password"
                  required
                ></b-form-input>
              </div>
              <div class="col-12 pt-2">
                <span class="btn btn-link" v-b-modal.modal-1>Hint</span>
                <b-modal id="modal-1" title="Username">
                  <div>Admin (for manage Master Data)</div>
                  <div class="pl-4">
                    username : admin<br />password : password
                  </div>
                  <div class="mt-4">Staff (for manage Stock)</div>
                  <div class="pl-4">
                    username : staff<br />password : password
                  </div>
                  <div class="mt-4">Machine (for sell)</div>
                  <div class="pl-4">
                    username : machine<br />password : password
                  </div>
                </b-modal>
                <b-button class="float-right" type="submit" variant="primary"
                  >Submit</b-button
                >
              </div>
            </div>
          </b-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _config from "../_config";
import MD5 from "crypto-js/md5";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      show: true,
    };
  },
  computed: {},
  methods: {
    onSubmit(event) {
      event.preventDefault();
      fetch(_config.apiDomain + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.form),
      })
        .then((response) => response.json())
        .then((result) => {
          result.token = MD5(result.username+'|'+result.role+'|'+result.access_token).toString();
          console.log("Success:", result);
          for (var i in result) localStorage.setItem(i, result[i]);
          this.$store.state.setMenu(result.username,result.role);
          //localStorage.setItem('user', JSON.stringify(result));
          //this.props.allprod()
        });
      //alert(JSON.stringify(this.form));
    },
  },
};
</script>