<template>
  <b-container>
    <h2>Games</h2>
    <b-card v-for="(game, index) in games" :key="index" :title="game.name" :footer="game.city"
            style="max-width: 20rem;" class="mb-2">
      <p class="card-text">{{game.description}}</p>
      <b-button-group>
        <b-button :href="`/game/${game.id}`" variant="success">Start This game</b-button>
        <b-button @click="removeGame(game)" variant="outline-danger">
          <fas icon="trash"/>
        </b-button>
      </b-button-group>
    </b-card>
  </b-container>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        loading: false,
        games: [],
      }
    },
    mounted() {
      this.loading = true;
      this.getGames().finally(() => this.loading = false)
    },
    methods: {
      getGames() {
        return axios
          .get('http://localhost:8080/api/game/')
          .then(response => {
            this.games = response.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      async removeGame(game) {
        await axios.delete('http://localhost:8080/api/game/' + game.id);
        this.getGames();
      }

    }

  }
</script>
