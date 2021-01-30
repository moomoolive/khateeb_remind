<template>
    <div>
        <form-main 
            :structure="structure"
            :backgroundColor="`none`"
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
    data() {
        return {
            structure: {
                textAllowed: {
                    type: 'checkbox',
                    required: true
                },
                twilioUser: {
                    required: true
                },
                twilioKey: {
                    type: 'protected',
                    required: true
                }
            }
        }
    }
}
</script>

<style>

</style>