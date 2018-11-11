<template>
<b-container v-if="game">
    <h2>{{ game.name }}</h2>
    <div style="height: 600px; overflow: auto; border: 1px solid black;">
    <l-map :zoom="zoom" :options="mapOptions" :center="center"
      @update:center="centerUpdate" @update:zoom="zoomUpdate">
      <l-tile-layer :url="url" :attribution="attribution"/>
      <l-marker v-for="(question, index) in game.questions" :key="index" :lat-lng="getCoordinates(question.coordinate)">
        <l-popup>
          <div @click="popupClick">
              {{question.question}}
          </div>
        </l-popup>
      </l-marker>
    </l-map>
    </div>
</b-container>
</template>

<script>
import axios from 'axios';
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';

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
    LPopup
    },
    data () {
    return {
            loading: false,
            game: null,
      zoom: 18,
      center: L.latLng(47.413220, -1.219482),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      //url: 'https://www.gtrack.co.id/TileMapService/TileMap.ashx?cachetype=1&tilex={x}&tiley={y}&level={z}',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(47.413220, -1.219482),
      currentZoom: 18,
      currentCenter: L.latLng(47.413220, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 1,
      }
    };
  },
  methods: {
    zoomUpdate (zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate (center) {
      this.currentCenter = center;
    },
    showLongText () {
      this.showParagraph = !this.showParagraph;
    },
    getCoordinates(coordinates) {
        return L.latLng(coordinates.latitude, coordinates.longitude);
    },
    popupClick () {
      alert('Popup Click!');
    },
    onResize() {
    this.$refs.map.mapObject.invalidateSize();
    }
  },
    mounted() {
        this.loading = true;
        axios
            .get('http://localhost:8080/api/game/' + this.$route.params.id)
            .then(response => {
                const game = response.data;
                this.game = game,
                this.center = L.latLng(game.cityCoordinate.latitude, game.cityCoordinate.longitude)
                this.marker = L.latLng(game.cityCoordinate.latitude, game.cityCoordinate.longitude)
                this.centerUpdate(L.latLng(game.cityCoordinate.latitude, game.cityCoordinate.longitude))
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
            .finally(() => this.loading = false)
      setTimeout(function() { window.dispatchEvent(new Event('resize')) }, 250);
    }
}
</script>
<style>
.leaflet-fake-icon-image-2x {
  background-image: url(../../node_modules/leaflet/dist/images/marker-icon-2x.png);
}
.leaflet-fake-icon-shadow {
  background-image: url(../../node_modules/leaflet/dist/images/marker-shadow.png);
}
@import "../../node_modules/leaflet/dist/leaflet.css";
</style>