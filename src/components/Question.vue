<template>
  <b-card bg-variant="dark" text-variant="white">
    <h3>{{question.question}}</h3>
    <div v-for="(option, i) in options" :key="i">
      <div
        :id="`option${i}`"
        v-bind:class="{
        'btn btn-secondary': (selectedAnswer === -1),
        'btn btn-success': (selectedAnswer === i && question.correctAnswer === i),
        'btn btn-danger': (selectedAnswer === i && question.correctAnswer !== i),
        'btn btn-disabled': (selectedAnswer > -1 && selectedAnswer !== question.answers[i])
        }"
        @click="selectOption(option.value)">
        {{option.text}}
      </div>
    </div>
    <div class="answerInfo">{{info}}</div>
  </b-card>
</template>

<script>
  export default {
    name: "Question",
    props: ['question', 'getNextQuestion'],
    data() {
      return {
        options: [],
        info: '',
        selectedAnswer: -1
      }
    },
    mounted() {
      this.options = this.question.answers.map((answer, index) => ({
        text: `${(index + 10).toString(36).toUpperCase()}. ${answer}`,
        value: index
      }));
    },
    watch: {
      question() {
        this.options = this.question.answers.map((answer, index) => ({
          text: `${(index + 10).toString(36).toUpperCase()}. ${answer}`,
          value: index
        }));
        this.selectedAnswer = -1;
        this.info = '';
      }
    },
    methods: {
      selectOption(index) {
        if (this.selectedAnswer < 0) {
          this.selectedAnswer = index;
          if (index === this.question.correctAnswer) {
            this.info = 'Correct! ';
            // document.getElementById('option' + index).className = "btn btn-success";
          } else {
            this.info = 'Wrong... ';
            // document.getElementById('option' + index).className = "btn btn-danger";
          }
          this.info += this.question.extraInformation;
          this.options.forEach(option => {
            if (option.value !== index) {
              // document.getElementById('option' + option.value).className = "btn btn-disabled"
            }
          });
          setTimeout(() => {
            this.question.answered = true;
            this.question.selectedAnswer = index;
            this.getNextQuestion();
          }, 5 * 1000);
        }
      }
    }
  }
</script>

<style scoped>
  h3 {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .btn {
    margin: 0.2rem 0;
  }

  .btn-disabled {
    color: black;
    background: #f1f1f1;
    border: 0.05rem solid #bdbdbd;
  }

  .btn-success, .btn-success:hover {
    color: black;
    background: #bef1af;
    border: 0.05rem solid #9bc691;
  }

  .btn-danger, .btn-danger:hover {
    color: black;
    background: #f1b7b8;
    border: 0.05rem solid #c69596;
  }

  .answerInfo {
    margin-top: 1rem;
  }
</style>