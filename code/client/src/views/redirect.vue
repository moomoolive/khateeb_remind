<template>
    <div>
        <loading :loadingTime="1500">
        </loading>
    </div>
</template>

<script>
import loading from '@/components/userInterface/components/loadingScreen.vue'

export default {
    name: 'redirect',
    components: {
        loading
    },
    methods: {
        async getURLRedirect(shortURLExtension) {
            try {
                const res = await this.$API.misc.redirect(shortURLExtension)
                if (res.msg)
                    this._.alert(res.msg)
                console.log(res)
                return res.url
            } catch(err) {
                console.log(err)
                this._.toHomepage()
            }
        }
    },
    async created() {
        const url = await this.getURLRedirect(this.$router.currentRoute.params.shortCode)
        window.location.replace(url)
    }
}
</script>

<style>

</style>