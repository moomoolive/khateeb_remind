<template>
    <div>
        <textarea v-model="data" @input="toMain()"></textarea>
    </div>
</template>

<script>
export default {
    name: 'formTextAreaExt',
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
    data() {
        return {
            data: ''
        }
    },
    methods: {
        toMain(options) {
            this.$emit('changed', { val: this.data, state: this.valid, msgs: this.invalidMsgs, ...options })
        }
    },
    computed: {
        valid() {
            if (this.options.minLength)
                return this.defaultValidators.minLength(this.data, this.options.minLength)
            else
                return this.defaultValidators.minLength(this.data, 1)
        },
        invalidMsgs() {
            if (!this.valid) {
                const msg = this.options.minLength ? `${this._.stringFormat(this.name)} cannot be less than ${this.options.minLength} characters` : `${this._.stringFormat(this.name)} cannot be empty`
                return [msg]
            } else
                return []
        }
    },
    created() {
        this.toMain({ created: true })
    }
}
</script>

<style>

</style>