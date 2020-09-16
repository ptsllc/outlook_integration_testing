<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="dark"
      class="navBarTextColor"
      style="padding:10px"
    >
      <b-navbar-nav>
        <h4>Outlook Appointment Testing</h4>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto"> </b-navbar-nav>
    </b-navbar>
    <router-view />
    <div class="footer bg-dark">
      <p>Pillar Training Solutions LLC - 2020</p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#my-nav-dropdown > a {
  color: rgb(224, 220, 220);
}

.navBarTextColor {
  color: rgb(224, 220, 220);
}

.navBarTextHover:hover {
  color: rgb(234, 241, 165);
  text-decoration: none;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: white;
}
</style>
