<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">List Games</router-link> |
      <router-link to="/add">Add</router-link> |
      <router-link to="/about">About</router-link>
      <p v-if="user">
        Hi {{user.name}}!
        (<a href="#" @click="logout">logout</a>)
      </p>
      <p v-if="!user">
        <label>Your name:
          <input type="text" @keyup.enter="login" v-model="userName">
        </label>
      </p>
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        user: null,
        userName: null,
      };
    },
    async mounted() {
      if ($cookies.isKey('username')) {
        this.user = { name: $cookies.get('username') };
      }
    },
    methods: {
      login() {
        this.user = { name: this.userName };
        $cookies.set('username', this.userName);
      },
      logout() {
        $cookies.remove('username');
        this.user = null;
      },
    },
  }
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  text-align: center;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
