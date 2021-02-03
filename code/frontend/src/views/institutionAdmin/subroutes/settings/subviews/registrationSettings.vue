<template>
    <div>
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
    name: "registrationSettings",
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
                autoConfirmRegistration: {
                    type: "checkbox",
                    required: true
                }
            }
        }
    }
}
</script>

<style>

</style>