<template>
  <b-row>
    <b-btn @click="showModal">
      <fas icon="map" size="xs"/>
    </b-btn>
    <b-col>
      <b-form-input type="text" step="0.0000001" v-model="coordinates.longitude" required @change="checkCoordinates"
                    placeholder="Longitude, eg: 50.884089"/>
    </b-col>
    <b-col>
      <b-form-input type="text" step="0.0000001" v-model="coordinates.latitude" required
                    placeholder="Latitude, eg: 4.6353902"/>
    </b-col>
    <b-modal ref="myModalRef" id="modal1" title="Select the Location" size="lg" @ok="handleOk">
      <div style="height: 600px; overflow: auto; border: 1px solid black;">
        <l-map :zoom="14" :center="selected" v-resize="onResize">
          <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"/>
          <l-marker :lat-lng.sync="selected" :draggable="true"/>
        </l-map>
      </div>
      {{selected}}
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
      }
    },
    props: ['coordinates'],
    methods: {
      checkCoordinates() {
        const coordinateFormat = this.coordinates.longitude.match(/(\d+\.\d+),(\d+\.\d+)/);
        if (coordinateFormat) {
          this.coordinates.longitude = coordinateFormat[1];
          this.coordinates.latitude = coordinateFormat[2];
        }
      },
      onResize() {
        this.$refs.map.mapObject.invalidateSize();
      },
      handleOk(){
        this.coordinates.longitude = this.selected.lng;
        this.coordinates.latitude = this.selected.lat;
      },
      showModal () {
        this.$refs.myModalRef.show();
        setTimeout(function() { window.dispatchEvent(new Event('resize')) }, 250);
      },
    },
  };
</script>
<style>
  @import "../../node_modules/leaflet/dist/leaflet.css";
</style>
