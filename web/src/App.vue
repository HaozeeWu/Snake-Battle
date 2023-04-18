<template>
  <NavBar />
  <router-view/>
</template>

<script>
import NavBar from './components/NavBar.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
// import $ from 'jquery'

export default {
  components: {
    NavBar
  }
  // setup() {
  //   $.ajax({
  //     url: "http://127.0.0.1:3000/user/account/token/",
  //     type: "post",
  //     data: {
  //       username: 'whz',
  //       password: 'pwhz',
  //     },
  //     success(resp) {
  //       console.log(resp);
  //     },
  //     error(resp) {
  //       console.log(resp);
  //     }
  //   })
  // }

}
</script>

<style>
body {
  background-image: url("./assets/images/1_59b8f162fd-background.png");
  background-size: cover;
}
</style>
