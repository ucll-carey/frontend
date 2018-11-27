<template>

  <b-row>
    <!-- fields with latitude and longitude -->
    <b-col sm="3" class="coordinates-col">
      <b-form-input type="text" step="0.0000001" v-model="coordinates.latitude" required
                    @change="checkCoordinates" placeholder="Latitude, eg: 50.884089"/>
    </b-col>
    <b-col sm="3" class="coordinates-col">
      <b-form-input type="text" step="0.0000001" v-model="coordinates.longitude" required
                    placeholder="Longitude, eg: 4.6353902"/>
    </b-col>

    <!-- Button to show map -->
    <b-col sm="1">
      <b-btn @click="showModal" title="Choose on map">
        <fas icon="map" size="xs"/>
      </b-btn>
    </b-col>

    <!-- Modal with a map to select the coordinates -->
    <b-modal ref="myModalRef" id="modal1" title="Select the Location" size="lg" @ok="handleOk">
      <div style="height: 50vh; overflow: auto; border: 1px solid black;">
        <l-map :zoom="14" :center="center" @mouseup="mouseUp">
          <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"/>
          <l-marker :lat-lng.sync="selected" :draggable="true"/>
        </l-map>
      </div>
      <div class="text-center">
        Latitude: {{selected.lat}}
        Longitude: {{selected.lng}}
      </div>
    </b-modal>
  </b-row>
</template>

<script>
  import {LMap, LTileLayer, LMarker} from 'vue2-leaflet';
  import L from 'leaflet';

  export default {
    components: {
      LMap,
      LTileLayer,
      LMarker,
    },
    data() {
      return {
        selected: L.latLng(50.846879, 4.725175),
        center: L.latLng(50.846879, 4.725175),
      }
    },
    watch: {
      selected: function () {
        // Added logic to index.html body tag for this
        if (!window.mouseDown) {
          this.center = this.selected;
        }
      }
    },
    props: ['coordinates'],
    methods: {
      mouseUp() {
        this.center = this.selected;
      },
      checkCoordinates() {
        const coordinateFormat = this.coordinates.longitude.match(/(\d+\.\d+),(\d+\.\d+)/);
        if (coordinateFormat) {
          this.coordinates.longitude = coordinateFormat[1];
          this.coordinates.latitude = coordinateFormat[2];
        }
      },
      handleOk() {
        this.coordinates.longitude = this.selected.lng;
        this.coordinates.latitude = this.selected.lat;
      },
      showModal() {
        // When opening the modal, check if coordinates are already filled in
        if (this.coordinates && this.coordinates.longitude && this.coordinates.latitude) {
          this.center = L.latLng(this.coordinates.longitude, this.coordinates.latitude);
          this.selected = L.latLng(this.coordinates.longitude, this.coordinates.latitude);
        }
        // open the modal
        this.$refs.myModalRef.show();
        // This line will trigger a resize, so the map renders properly
        // https://github.com/KoRiGaN/Vue2Leaflet/issues/96#issuecomment-341459943
        setTimeout(function () {
          window.dispatchEvent(new Event('resize'))
        }, 250);
      },
    },
  };
</script>
<style>
  @import "../../node_modules/leaflet/dist/leaflet.css";

  .coordinates-col {
    margin-bottom: 0.5rem;
  }
</style>
