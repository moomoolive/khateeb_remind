<template>
    <div class="space">
        <msg-with-pic
            title="Ooops..."
            msg="The page you searched for doesn't exist!"
            gif="flyingPlanesAllOver"
        />
        <div class="button">
            <button @click="utils.toHomePage()">
                Go to Home
            </button>
        </div>
    </div>
</template>

<script>
import msgWithPic from '@/components/general/msgWithPic.vue'

export default {
    name: 'pageNotFound',
    components: {
        msgWithPic
    }
}
</script>

<style>
.button {
    margin-top: 2vh;
}

</style>