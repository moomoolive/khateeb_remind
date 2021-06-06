<template>
    <div>
        <input-primitive
            class='right' 
            :inputType="`checkbox`"
            :id="createCheckboxNameHash()"
            :width="4"
            :default="options.default || false"
            @changed="process($event)" 
        />
    </div>
</template>

<script>
import inputPrimitive from '@/components/forms/extensions/primitives/input.vue'

import formValidationHelpers from '@/libraries/formValidation/main.js'

export default {
    name: 'formCheckbox',
    components: {
        inputPrimitive
    },
    props: {
        options: {
            type: Object,
            required: true
        },
    },
    methods: {
        process($event) {
            this.$emit('changed', $event)
        },
        createCheckboxNameHash() {
            return formValidationHelpers.createFormElementNameHash("checkbox")
        }
    }
}
</script>

<style lang="scss" scoped>
.right {
    text-align: left;
    width: 89%;
    margin-left: auto;
    margin-right: auto;
}
</style>