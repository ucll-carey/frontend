<template>
  <b-row>
    <b-col>
      <b-form-input type="text" step="0.0000001" v-model="coordinates.longitude" required @change="checkCoordinates" placeholder="Longitude, eg: 50.884089" />
    </b-col>
    <b-col>
      <b-form-input type="text" step="0.0000001" v-model="coordinates.latitude" required placeholder="Latitude, eg: 4.6353902" />
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: ['coordinates'],
  methods: {
    checkCoordinates() {
      const coordinateFormat = this.coordinates.longitude.match(/(\d+\.\d+),(\d+\.\d+)/);
      if (coordinateFormat) {
        this.coordinates.longitude = coordinateFormat[1];
        this.coordinates.latitude = coordinateFormat[2];
      }
    },
  },
};
</script>