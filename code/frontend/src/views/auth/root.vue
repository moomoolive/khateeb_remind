<template>
    <div>
        <div v-show="!finished">
            <user-form
                v-show="showUser"
                :formTitle="`Create Root User`"
                :backgroundColor="`blue-offWhite`"
                @changed="toStepTwo($event)"
            />
            <form-main
                v-show="showAPIkey"
                :formTitle="`Enter Secret Key`"
                :structure="structure"
                :backgroundColor="`blue-offWhite`"
                @submitted="create($event)"
            />
        </div>
        <h1 v-show="finished && msg">{{ msg }}</h1>
    </div>
</template>

<script>
import userForm from '@/components/forms/templates/user.vue'
import formMain from '@/components/forms/main.vue'

export default {
    name: "authRoot",
    components: {
        userForm,
        formMain
    },
    data() {
        return {
            finished: false,
            showUser: true,
            showAPIkey: true,
            structure: {
                secretKey: {
                    type: 'protected',
                    required: true
                }
            },
            msg: null,
            request: { }
        }
    },
    methods: {
        toStepTwo($event) {
            this.request.user = $event
            this.showUser = false
            this.showAPIKey = true
        },
        async create($event) {
            try {
                console.log($event)
                this.request.apiKey = $event.secretKey
                const msg = await this.$API.auth.createRoot(this.request)
                this.msg = msg
                this.finished = true
            } catch(err) {
                console.log(err)
            }
        }
    }
}
</script>

<style>

h1 {
    width: 80%;
    font-size: 4vh;
    margin-left: auto;
    margin-right: auto;
}

</style>