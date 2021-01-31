<template>
    <div>
        <formMain
            :structure="structure"
            :basedOn="institution"
            :bindedExts="['states']"
            :backgroundColor="`none`"
            :buttonText="`Update Institution`"
            @submitted="$emit('submitted', $event)"
        />
    </div>
</template>

<script>
import formMain from '@/components/forms/main.vue'

export default {
    name: "institutionDetailsSetting",
    components: {
        formMain
    },
    props: {
        institution: {
            type: Object,
            required: true
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