<template>
  <b-container>
    <h2>Games</h2>
    <b-carousel id="carousel" style="text-shadow: 1px 1px 2px #333;filter: invert(1);border-radius:0.3rem;"
                controls indicators background="#000" :interval="4000" img-width="1024" img-height="320"
                v-model="slide" @sliding-start="onSlideStart" @sliding-end="onSlideEnd">
      <b-carousel-slide v-for="(game, index) of games" :key="index" img-blank img-alt="Blank image">
        <div class="row">
          <div class="col-xs-4">
            <b-card :title="game.name" style="max-width: 20rem;" class="mb-2">
              <p class="card-text">{{game.description}}<span class="city"> - @{{game.location}}</span></p>
              <b-link :to="`/game/${game.id}`" variant="primary">Start This game</b-link>
              <p v-if="game.score > 0">Recommended: {{game.score}}/5</p>
              <div>
                <b-button @click="removeGame(game)" class="removeGameButton">Remove this game
                  <fas icon="trash"></fas>
                </b-button>
              </div>
            </b-card>
          </div>
          <img :src=game.image class="col-xs-7 col-xs-offset-1"/>
        </div>
      </b-carousel-slide>
    </b-carousel>
  </b-container>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        loading: false,
        games: [],
        slide: 0,
        sliding: null,
        wikipedia: null
      }
    },
    mounted() {
      this.loading = true;
      this.getGames().finally(() => this.loading = false);
    },
    methods: {
      async getGames() {
        const response = await axios.get(process.env.VUE_APP_API_URL + 'games' + ($cookies.isKey('username') ? '?username=' + $cookies.get('username') : ''));
        this.games = await Promise.all(response.data.map(async (game) => {
          game.image = await this.getGameImage(game.location);
          return game;
        }));
      },
      async getGameImage(location) {
        return axios.get(process.env.VUE_APP_IMAGESERVICE_URL + location)
          .then(response => response.data.length > 0 ? response.data : '/images/no-city-image.jpg')
          .catch(error => {
            // frontend Circuit Breaker
            console.error('Error fetching image for', location, error);
            return '/images/no-city-image.jpg';
          });
      },
      async removeGame(game) {
        await axios.delete(process.env.VUE_APP_API_URL + '/games/' + game.id);
        this.getGames();
      },
      onSlideStart() {
        this.sliding = true
      },
      onSlideEnd() {
        this.sliding = false
      }

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  h2 {
    text-align: center;
  }

  h3:host {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  img {
    max-width: 30rem;
    max-height: 15rem;
    width: auto;
    height: auto;
    filter: invert(1);
    margin: 1rem 0;
  }

  .card {
    color: #2c3e50 !important;
    text-shadow: none !important;
    border: none;
    filter: invert(1);
  }

  .card .city {
    color: gray;
    font-size: 0.9rem;
  }

  .row {
    min-height: 17rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .col-xs-offset-1 {
    margin-left: 8.333333333333332%;
  }

  .btn-primary {
    color: white;
  }

  .removeGameButton {
    font-size: 0.8rem;
    background: white;
    color: gray;
    margin-top: 2rem;
    border: none;
    padding: 0.2rem 0.5rem;
  }

  .removeGameButton:hover {
    background: #e9e9e9;
    color: #6d6d6d;
  }

</style>