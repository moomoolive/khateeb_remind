<template>
    <div>
        <input-primitive
            :inputType="`text`"
            :default="options.default ? options.default : ''"
            @changed="process($event)"
        />
    </div>
</template>

<script>
import inputPrimitive from '@/components/forms/extensions/primitives/input.vue'

export default {
    name: "formDefaultExt",
    components: {
        inputPrimitive
    },
    props: {
        validators: {
            type: Function,
            required: true
        },
        options: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    methods: {
        async process($event) {
            const validationInfo = await this.validators($event.val)
            this.$emit('changed', { ...$event, ...validationInfo })
        }
    }
}
</script>