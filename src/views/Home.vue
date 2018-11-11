<template>
  <div class="home">
    <AddQuiz/>
  </div>
</template>

<script>
// @ is an alias to /src
import AddQuiz from '@/components/AddQuiz.vue'

export default {
  name: 'home',
  components: {
    AddQuiz,
  }
}
</script>
