<template>
    <div>
        <button
            @click="sendText()"
        >
            Check if text service is Online
        </button>
        <h3 v-if="pushed">A text should arrive shortly! If it doesn't arrive in the next few minutes<br>
        try checking if the backend is connected to a text provider.</h3>
    </div>
</template>

<script>
export default {
    name: 'textService',
    data() {
        return {
            pushed: false
        }
    },
    methods: {
        async sendText() {
            this.pushed = true
            await this.$API.checkTextService()  
        }
    }
}
</script>

<style>

</style>