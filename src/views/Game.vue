<template>
<b-container v-if="game">
    <h2>{{ game.name }}</h2>
</b-container>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            loading: false,
            game: null,
        }
    },
    mounted() {
        this.loading = true;
        axios
            .get('http://localhost:8080/api/game/' + this.$route.params.id)
            .then(response => {
                this.game = response.data
            })
            .catch(error => {
                console.log(error)
                this.errored = true
            })
            .finally(() => this.loading = false)
    }
}
</script>
