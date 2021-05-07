<template>
    <div class="space">
        <general-message
            :message="`Ooops...The page you searched for doesn't exist!`"
            :fontAwesomeIcon="['fas', 'question']"
            iconColor="yellow"
        />
        <div>
            <button class="button" @click="_utils.toHomePage()">
                Go to Home
            </button>
        </div>
    </div>
</template>

<script>
import generalMessage from '@/components/misc/generalMessage.vue'

export default {
    name: 'pageNotFound',
    components: {
        generalMessage
    }
}
</script>

<style lang="scss" scoped>
.button {
    margin-top: 40px;
    @include floating-box-shadow();
}

</style>