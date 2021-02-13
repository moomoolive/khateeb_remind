<template>
    <div>
        <input-primitive
            class='right' 
            :inputType="`checkbox`"
            :width="4"
            :default="options.default || false"
            @changed="process($event)" 
        />
    </div>
</template>

<script>
import inputPrimitive from '@/components/forms/extensions/primitives/input.vue'

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