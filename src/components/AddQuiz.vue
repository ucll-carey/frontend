<template>
<b-container class="bv-example-row">
    <h2>Add city game</h2>
    <b-form @submit="onSubmit">

        <b-form-group label="Name of the game" label-for="inputName" description="">
            <b-form-input id="inputName" type="text" v-model="form.name" required placeholder="Enter a fun name" />
        </b-form-group>

        <b-form-group label="City name" label-for="cityNameInput">
            <b-form-input id="cityNameInput" type="text" v-model="form.city.name" required placeholder="Enter the city name, eg: Leuven" />
        </b-form-group>

        <b-form-group label="City coordinates">
            <coordinates :coordinates.sync="form.city.coordinates" />
        </b-form-group>

        <b-form-group label="Description of the game" label-for="inputDescription" description="">
            <b-form-textarea id="inputDescription" rows="3" v-model="form.description" required placeholder="" />
        </b-form-group>

        <ul class="questions">
            <li v-for="(item, i) in form.questions" :key="i">
                <b-button @click="removeQuestion(i)">
                    <fas icon="trash" />
                </b-button>

                <b-form-group label="Question coordinates">
                    <coordinates :coordinates.sync="item.coordinates" />
                </b-form-group>
                <b-form-group label="Question">
                    <b-form-input type="text" v-model="item.question" required />
                </b-form-group>
                <ul class="answers">
                    <li v-for="(answer, j) in item.answers" :key="j">
                        <b-input-group>
                            <b-input-group-prepend is-text>
                                <input type="radio" :value="j" v-model="item.correctQuestionIndex" />
                </b-input-group-prepend>
                                <b-form-input type="text" v-model="answer.value" :ref="`question${i}answer${j}`" />
                                <b-input-group-append>
                                    <b-btn variant="outline-secondary" @click="removeAnswer(item, j)">
                                        <fas icon="trash" />
                                    </b-btn>
                                </b-input-group-append>
                        </b-input-group>
                    </li>
                    <li class="last">
                        <b-btn variant="link" @click="addAnswer(item)">
                            <fas icon="plus" />
                            Add Answer
                        </b-btn>
                    </li>
                </ul>
                <b-form-group label="Extra information about answer">
                    <b-form-textarea rows="3" v-model="item.information" />
                </b-form-group>
            </li>
            <li class="last">
                <b-button variant="link" @click="addQuestion">
                    <fas icon="plus" />
                    Add Question
                </b-button>
            </li>

        </ul>
        <b-button type="submit" variant="primary">Submit</b-button>
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
            console.info('would submit:', this.form);
            const data = {
                city: this.form.city.name,
                cityCoordinate: {
                    latitude: parseFloat(this.form.city.coordinates.latitude),
                    longitude: parseFloat(this.form.city.coordinates.longitude)
                },
                description: this.form.description,
                name: this.form.name,
                questions: this.form.questions.map(item => ({
                    answerInfo: item.information,
                    answers: item.answers.map(answer => answer.value),
                    coordinate: {
                        latitude: parseFloat(item.coordinates.latitude),
                        longitude: parseFloat(item.coordinates.longitude)
                    },
                    correctAnswer: item.correctQuestionIndex,
                    question: item.question,
                }))
            };
            axios
                .post('http://localhost:8080/api/game/', data)
                .then(response => {
                    console.log('succesful', response);
                })
                .catch(error => {
                    console.log(error)
                    this.errored = true
                })
                .finally(() => this.loading = false)
        },
    },
};
</script>
