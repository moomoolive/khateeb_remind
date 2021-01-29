<template>
    <div class="space">
        <msg-with-pic
            title="Ooops..."
            msg="The page you searched for doesn't exist!"
            gif="personThrowingPlane"
        />
        <div class="button">
            <button @click="toHome()">
                Go to Home
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'pageNotFound',
    methods: {
        toHome() {
            if (this.$store.getters.decodedJWT)
                this.$router.push(`/${this.$store.getters.decodedJWT.__t}/`)
            else {
                this.$router.push('/')
            }
        }
    }
}
</script>

<style>
.button {
    margin-top: 2vh;
}

</style>