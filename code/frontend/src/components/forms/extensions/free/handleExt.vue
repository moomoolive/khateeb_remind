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
    name: "formHandleExt",
    components: {
        inputPrimitive
    },
    props: {
        options: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        defaultValidators: {
            type: Object,
            required: true
        }
    },
    methods: {
        process($event) {
            const state = this.valid($event.val)
            const msgs = this.invalidMsg(state)
            const info = {
                ...$event,
                state,
                msgs
            }
            this.$emit('changed', info)
        },
        valid(data) {
            const len = this.defaultValidators.minLength(data, 1)
            const noAtSymbolChar0 = data[0] !== '@'
            return len && noAtSymbolChar0
        },
        invalidMsg(state) {
            if (!state)
                return [`Handle cannot contain '@' as the first letter and must be at least one charcter`]
            else
                return []
        }
    }
}
</script>

<style>

</style>