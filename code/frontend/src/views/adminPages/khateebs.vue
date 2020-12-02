<template>
    <div>
        khateebs <br>
        {{ khateebData }}
    </div>
</template>

<script>
import API from '../../utils/apiCalls.js'

export default {
    name: 'khateebs',
    data() {
        return {
            khateebData: null
        }
    },
    async created() {
        this.khateebData = await API.getKhateebs(this.$store.state.JWT_TOKEN)
    }
}
</script>

<style lang="scss" scoped>

</style>