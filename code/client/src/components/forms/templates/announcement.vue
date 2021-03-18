<template>
    <div>
        <form-main
            v-bind="{
                ...formProps,
                structure
            }" 
            @submitted="$emit('submitted', $event)"
        />
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'

export default {
    name: "annoucementFormTemplate",
    components: {
        formMain
    },
    props: {
        formProps: {
            type: Object,
            required: false,
            default: () => {}
        }
    },
    data() {
        return {
            structure: {
                headline: {
                    required: true
                },
                content: {
                    type: 'textArea',
                    required: true
                },
                important: {
                    type: 'checkbox',
                    required: true,
                    default: false
                },
                urgent: {
                    type: 'checkbox',
                    required: true,
                    default: false
                }
            }
        }
    }
}
</script>

<style>

</style>