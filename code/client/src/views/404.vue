<template>
    <div class="space">
        <msg-with-pic
            title="Ooops..."
            msg="The page you searched for doesn't exist!"
            gif="personThrowingPlane"
        />
        <div class="button">
            <button @click="_.toHomePage()">
                Go to Home
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'pageNotFound'
}
</script>

<style>
.button {
    margin-top: 2vh;
}

</style>