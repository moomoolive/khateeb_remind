<template>
    <div>
        <img :src="require('@/assets/logos/twillio.png')">
        <form-main 
            :structure="structure"
            :backgroundColor="`none`"
            :basedOn="settings"
            @submitted="$emit('submitted', $event)"
        />
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'

export default {
    name: "textSettings",
    components: {
        formMain
    },
    props: {
        settings: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            structure: {
                textAllowed: {
                    type: 'checkbox',
                    required: true
                },
                twilioUser: {
                    required: true,
                    tag: 'encrypted'
                },
                twilioKey: {
                    type: 'protected',
                    toggle: true,
                    required: true,
                    tag: 'encrypted'
                },
                twilioPhoneNumber: {
                    required: true,
                    minLength: 12
                },
            }
        }
    }
}
</script>

<style lang="scss" scoped>
img {
    width: 80%;
}
</style>