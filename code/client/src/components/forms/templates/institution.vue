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
    name: "institutionFormTemplate",
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
                name: {
                    required: true
                },
                abbreviatedName: {
                    required: true
                },
                timezone: {
                    type: "dropdown",
                    required: true,
                    selectOptions: ["America/Edmonton", "America/Vancouver"]
                },
                country: {
                    type: "dropdown",
                    required: true,
                    selectOptions: ["Canada", "United States", "Mexico"]
                }  
            }
        }
    }
}
</script>

<style>

</style>