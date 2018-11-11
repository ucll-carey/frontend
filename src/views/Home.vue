<template>
<b-container>
    <h2>Games</h2>
    <b-card v-for="(game, index) in games" :key="index" :title="game.name"
          style="max-width: 20rem;"
          :footer="game.city"
          class="mb-2">
    <p class="card-text">{{game.description}}</p>
    <b-button :href="`/game/${game.id}`" variant="primary">Start This game</b-button>
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
        axios
            .get('http://localhost:8080/api/game/')
            .then(response => {
                this.games = response.data
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
            .finally(() => this.loading = false)
    }
}
</script>
