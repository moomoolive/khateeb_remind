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
            let info = { ...$event }
            try {
                const validationInfo = await this.validators($event.val)
                info = {
                    ...$event,
                    ...validationInfo
                }
            } catch(err) {
                console.log(err)
                this.$router.push('/')
                this._.alert(`There was a problem with our servers, try signing up later`)
            }
            this.$emit('changed', info)
        }
    }
}
</script>