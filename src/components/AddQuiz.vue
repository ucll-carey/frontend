<template>
  <b-container class="form-container">
    <h2>Add city game</h2>
    <b-form @submit="onSubmit">
      <b-card bg-variant="dark" text-variant="white">
        <h3>Game info</h3>
        <b-row>
          <b-col sm="6">
            <b-form-group label="Name of the game" label-for="inputName" description="">
              <b-form-input id="inputName" type="text" v-model="form.name" placeholder="Enter a fun name" required/>
            </b-form-group>
          </b-col>
          <b-col sm="5" offset-sm="1">
            <b-form-group label="City name" label-for="cityNameInput">
              <b-form-input id="cityNameInput" type="text" v-model="form.city.name"
                            placeholder="Enter the city name, eg: Leuven" required/>
            </b-form-group>
          </b-col>
        </b-row>

        <b-form-group label="City coordinates">
          <coordinates :coordinates.sync="form.city.coordinates"/>
        </b-form-group>

        <b-form-group label="Description of the game" label-for="inputDescription" description="">
          <b-form-textarea id="inputDescription" rows="3" v-model="form.description" required placeholder=""/>
        </b-form-group>
      </b-card>

      <b-card bg-variant="dark" text-variant="white">
        <h3>Questions</h3>
        <div>
          <b-card v-for="(item, i) in form.questions" :key="i" class="question-card" text-variant="dark">
            <b-row>
              <b-col sm="11">
                <h4>Question {{i + 1}} </h4>
              </b-col>
              <b-col sm="1" class="remove-button-col">
                <b-button @click="removeQuestion(i)">
                  <fas icon="trash" size="xs"/>
                </b-button>
              </b-col>
            </b-row>

            <b-form-group label="Question">
              <b-form-input type="text" v-model="item.question" required/>
            </b-form-group>

            <b-form-group label="Question coordinates">
              <coordinates :coordinates.sync="item.coordinates"/>
            </b-form-group>

            <b-form-group label="Answers">
            </b-form-group>
            <ul class="answers">
              <li v-for="(answer, j) in item.answers" :key="j">
                <b-input-group>
                  <b-input-group-prepend is-text>
                    <input type="radio" :value="j" v-model="item.correctQuestionIndex"/>
                  </b-input-group-prepend>
                  <b-form-input type="text" v-model="answer.value" :ref="`question${i}answer${j}`"/>
                  <b-input-group-append>
                    <b-btn variant="outline-secondary" @click="removeAnswer(item, j)">
                      <fas icon="trash"/>
                    </b-btn>
                  </b-input-group-append>
                </b-input-group>
              </li>
              <li class="last">
                <b-btn variant="link" @click="addAnswer(item)">
                  <fas icon="plus" class="button-icon"/>
                  Add Answer
                </b-btn>
              </li>
            </ul>

            <b-form-group label="Extra information about answer">
              <b-form-textarea rows="3" v-model="item.information"/>
            </b-form-group>
          </b-card>
        </div>
        <div class="new-question-button">
          <b-button variant="link" @click="addQuestion">
            <fas icon="plus" class="button-icon"/>
            Add Question
          </b-button>
        </div>
      </b-card>
      <b-button type="submit" variant="primary" class="submit-button">Submit</b-button>
    </b-form>
  </b-container>
</template>

<script>
  import coordinates from '@/components/Coordinates.vue'
  import axios from 'axios';

  export default {
    components: {
      coordinates,
    },
    data() {
      return {
        loading: false,
        form: {
          name: '',
          city: {
            name: '',
            coordinates: {
              longitude: null,
              latitude: null
            },
          },
          description: '',
          questions: [],
        },
      };
    },
    methods: {
      addQuestion() {
        this.form.questions.push({
          coordinates: {
            longitude: null,
            latitude: null
          },
          question: '',
          answers: [],
          correctQuestionIndex: 0,
          information: '',
        });
      },
      removeQuestion(index) {
        this.form.questions.splice(index, 1);
      },
      addAnswer(question) {
        question.answers.push({
          value: ''
        });
      },
      removeAnswer(question, index) {
        question.answers.splice(index, 1);
        if (question.correctQuestionIndex === index) {
          question.correctQuestionIndex = null;
        }
      },
      onSubmit(evt) {
        evt.preventDefault();
        this.loading = true;
        const data = {
          name: this.form.name,
          location: this.form.city.name,
          coordinates: {
            lat: parseFloat(this.form.city.coordinates.latitude),
            lon: parseFloat(this.form.city.coordinates.longitude)
          },
          description: this.form.description,
          questions: this.form.questions.map(item => ({
            question: item.question,
            coordinates: {
              lat: parseFloat(item.coordinates.latitude),
              lon: parseFloat(item.coordinates.longitude)
            },
            answers: item.answers.map(answer => answer.value),
            correctAnswer: item.correctQuestionIndex,
            extraInformation: item.information,
          }))
        };
        axios
          .post('http://localhost:8080/games', data)
          .then(response => {
            console.log('succesful', response);
            this.$router.push('/');
          })
          .catch(error => {
            console.log(error);
            this.errored = true
          })
          .finally(() => this.loading = false)
      },
    },
  };
</script>

<style>
  h2 {
    text-align: center;
  }

  h4 {
    padding-top: 1rem;
  }

  .form-group {
    margin-top: 2rem;
    /*font-weight: bold;*/
  }

  .card {
    margin-top: 2rem;
    margin-bottom: 3rem;
    border-radius: 0.3rem !important;
  }

  .question-card {
    margin: 1rem;
  }

  .remove-button-col {
    text-align: right;
  }

  .answers {
    list-style: none;
    padding-left: 0;
  }

  .answers li {
    margin-bottom: 0.5rem;
  }

  .button-icon {
    margin-right: 0.5rem;
  }

  .new-question-button .btn-link {
    color: white !important;
  }

  .submit-button {
    margin-bottom: 2rem;
  }

</style>
