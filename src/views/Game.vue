<template>
  <b-container v-if="game">
    <h2>{{ game.name }}</h2>
    <div style="height: 600px; overflow: auto; border: 1px solid black;" v-if="noNearbyQuestions">
      <l-map :zoom="zoom" :options="mapOptions" :center="center"
             @update:center="centerUpdate" @update:zoom="zoomUpdate">
        <l-tile-layer :url="url" :attribution="attribution"/>
        <l-marker v-for="(question, index) in game.questions" :key="index"
                  :lat-lng="getCoordinates(question.coordinates)">
          <l-popup>
            <div @click="popupClick">
              {{question.question}}
            </div>
          </l-popup>
        </l-marker>
        <l-marker v-if="user" :lat-lng="user" :icon="userIcon"/>
      </l-map>
    </div>
    <Question v-if="currentIndex !== null" :question="this.game.questions[currentIndex]"
              :getNextQuestion="checkForNearbyQuestions"/>
  </b-container>
</template>

<script>
  import axios from 'axios';
  import {LMap, LMarker, LPopup, LTileLayer} from 'vue2-leaflet';
  import Question from '../components/Question';

  import L from 'leaflet';

  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  });

  export default {
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LPopup,
      Question
    },
    data() {
      return {
        loading: false,
        noNearbyQuestions: true,
        game: null,
        user: null,
        userIcon: L.icon({
          iconUrl: '/images/user.png',
          iconSize: [36, 36],
          iconAnchor: [36, 36]
        }),
        zoom: 18,
        center: L.latLng(47.413220, -1.219482),
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        //url: 'https://www.gtrack.co.id/TileMapService/TileMap.ashx?cachetype=1&tilex={x}&tiley={y}&level={z}',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        marker: L.latLng(47.413220, -1.219482),
        currentZoom: 18,
        currentCenter: L.latLng(47.413220, -1.219482),
        mapOptions: {
          zoomSnap: 1,
        },
        currentIndex: null
      };
    },
    methods: {
      zoomUpdate(zoom) {
        this.currentZoom = zoom;
      },
      centerUpdate(center) {
        this.currentCenter = center;
      },
      getCoordinates(coordinates) {
        return L.latLng(coordinates.lat, coordinates.lon);
      },
      popupClick() {
        alert('Popup Click!');
      },
      checkForNearbyQuestions() {
        this.noNearbyQuestions = true;
        this.currentIndex = null;
        this.game.questions
          .filter(question => !question.answered)
          .forEach(async (question, index) => {
            const distance = await this.getDistance(question.coordinates.lat, question.coordinates.lon);
            if (distance < 50) {
              this.currentIndex = index;
              this.noNearbyQuestions = false;
            }
          });
      },
      getDistance(lat, lon) {
        const R = 6371e3; // metres
        const fi1 = this.user.lat * (Math.PI / 180);
        const fi2 = lat * (Math.PI / 180);
        const delta_fi = (lat - this.user.lat) * (Math.PI / 180);
        const delta_lambda = (lon - this.user.lng) * (Math.PI / 180);

        const a = Math.sin(delta_fi / 2) * Math.sin(delta_fi / 2) + Math.cos(fi1) * Math.cos(fi2) *
          Math.sin(delta_lambda / 2) * Math.sin(delta_lambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
      }

    },
    async mounted() {
      this.loading = true;
      await this.$getLocation({enableHighAccuracy: true, timeout: Infinity}).then(coordinates => {
        this.user = L.latLng(coordinates.lat, coordinates.lng);
        //this.center = this.user;
      });
      await axios
        .get('http://localhost:8080/games/' + this.$route.params.id)
        .then(response => {
          const game = response.data;
          console.log('game', game);
          this.game = game;
          this.center = L.latLng(game.coordinates.lat, game.coordinates.lon);
        })
        .catch(error => {
          console.log(error);
          this.errored = true
        })
        .finally(() => this.loading = false);
      setTimeout(this.checkForNearbyQuestions(), 10 * 1000);
    }
  }
</script>
<style>
  @import "../../node_modules/leaflet/dist/leaflet.css";

  .leaflet-fake-icon-image-2x {
    background-image: url(../../node_modules/leaflet/dist/images/marker-icon-2x.png);
  }

  .leaflet-fake-icon-shadow {
    background-image: url(../../node_modules/leaflet/dist/images/marker-shadow.png);
  }
</style>
