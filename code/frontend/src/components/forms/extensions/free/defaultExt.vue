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
        defaultValidators: {
            type: Object,
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
        process($event) {
            const state = this.valid($event.val)
            const msgs = this.invalidMsgs(state)
            const info = {
                ...$event,
                state,
                msgs
            }
            this.$emit('changed', info)
        },
        valid(data) {
            if (this.options.minLength)
                return this.defaultValidators.minLength(data, this.options.minLength)
            else
                return this.defaultValidators.minLength(data, 1)
        },
        invalidMsgs(state) {
            if (!state) {
                const msg = this.options.minLength ? `${this._.stringFormat(this.name)} cannot be less than ${this.options.minLength} characters` : `${this._.stringFormat(this.name)} cannot be empty`
                return [msg]
            } else
                return []
        }
    }
}
</script>