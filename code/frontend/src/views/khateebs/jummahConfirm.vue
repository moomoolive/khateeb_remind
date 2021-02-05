<template>
    <div>
        <loading :loadingTime="1000">
            {{ requestPackage }}
        </loading>
    </div>
</template>

<script>
import loading from '@/components/userInterface/components/loadingScreen.vue'

export default {
    name: 'jummahConfirm',
    components: {
        loading
    },
    data() {
        return {
            params: this.$route.params,
            requestPackage: null
        }
    },
    methods: {
        async getConfirmationPackage() {
            try {
                const jummahID = this.params.jummahID.split('=')[1]
                const notificationID = this.params.notificationID.split('=')[1]
                this.requestPackage = await this.$API.khateeb.confirmJummahPackage(jummahID, notificationID)
            } catch(err) {
                console.log(err)
            }
        }
    },
    created() {
        this.getConfirmationPackage()
    }
}
</script>

<style>

</style>