<template>
  <b-container class="bv-example-row">
    <h2>Add city game</h2>
    <b-form @submit="onSubmit" @reset="onReset">

      <b-form-group label="Name of the game" 
                    label-for="inputName" 
                    description="">
        <b-form-input id="inputName"
                      type="text"
                      v-model="form.name"
                      required
                      placeholder="Enter a fun name"/>
      </b-form-group>

      <b-form-group
                    label="City name"
                    label-for="cityNameInput">
        <b-form-input id="cityNameInput"
                      type="text"
                      v-model="form.city.name"
                      required
                      placeholder="Enter the city name, eg: Leuven"/>
      </b-form-group>

      <b-form-group label="City coordinates">
        <b-row>
          <b-col>
            <b-form-input type="text" step="0.0000001"
                          v-model="form.city.coordinates.longitude"
                          required @change="checkCoordinates"
                          placeholder="Longitude, eg: 50.884089"/>
          </b-col>
          <b-col>
            <b-form-input type="text" step="0.0000001"
                          v-model="form.city.coordinates.latitude"
                          required placeholder="Latitude, eg: 4.6353902"/>
          </b-col>
        </b-row>
      </b-form-group>

      <b-form-group label="Description of the game" 
                    label-for="inputDescription" 
                    description="">
        <b-form-textarea id="inputDescription"
          rows="3"
          v-model="form.description"
          required
          placeholder=""/>
      </b-form-group>

      <p>
        <b-button @click="addQuestion">
          <fas icon="plus" />
          Add Question
        </b-button>
      </p>

      <ul>
        <li v-for="(item, index) in form.questions" :key="index">
          <b-button @click="removeQuestion(index)">
            <fas icon="trash" />
          </b-button>

          <b-form-group label="Question">
            <b-form-input type="text" v-model="item.question" required/>
          </b-form-group>

        </li>
      </ul>

<!--
      <b-form-group>
        <b-form-checkbox-group v-model="form.checked" id="exampleChecks">
          <b-form-checkbox value="me">Check me out</b-form-checkbox>
          <b-form-checkbox value="that">Check that out</b-form-checkbox>
        </b-form-checkbox-group>
      </b-form-group>
      -->
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        city: {
          name: '',
          coordinates: { longitude: null, latitude: null },
        },
        description: '',
        questions: [{
          coordinates: { longitude: '50.3', latitude: '0.2' },
          question: 'How much is 1+1?',
          answers: ['1', '2', '3'],
          correctQuestionIndex: 2,
        }],
      },
    };
  },
  methods: {
    addQuestion() {
      this.form.questions.push({
        coordinates: { longitude: null, latitude: null },
        question: '',
        answers: [],
        correctQuestionIndex: 0,
      });
    },
    removeQuestion(index) {
      this.form.questions.splice(index, 1);
    },
    checkCoordinates() {
      const coordinateFormat = this.form.city.coordinates.longitude.match(/(\d+\.\d+),(\d+\.\d+)/);
      if (coordinateFormat) {
        this.form.city.coordinates.longitude = coordinateFormat[1];
        this.form.city.coordinates.latitude = coordinateFormat[2];
      }
    },
    onSubmit(evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    },
    onReset(evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.form.name = '';
      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => this.show = true);
    },
  },
};
</script>