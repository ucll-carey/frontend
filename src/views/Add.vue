<template>
  <div class="add">
    <AddQuiz/>
  </div>
</template>

<script>
// @ is an alias to /src
import AddQuiz from '@/components/AddQuiz.vue'

export default {
  name: 'add',
  components: {
    AddQuiz,
  }
}
</script>
