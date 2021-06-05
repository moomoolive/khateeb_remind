<template>
    <div>
        <textarea 
            v-model="data"
            :id="createTextAreaNameHash()" 
            @input="toMain()"
        ></textarea>
    </div>
</template>

<script>
import formValidationHelpers from '@/libraries/formValidation/main.js'

export default {
    name: 'formTextAreaPrimitive',
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
            data: this.options.default || ''
        }
    },
    methods: {
        toMain(options) {
            this.$emit('changed', { val: this.data, state: this.valid, msgs: this.invalidMsgs, ...options })
        },
        createTextAreaNameHash() {
            return formValidationHelpers.createFormElementNameHash("textarea")
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
                const msg = this.options.minLength ? `${this._utils.stringFormat(this.name)} cannot be less than ${this.options.minLength} characters` : `${this._utils.stringFormat(this.name)} cannot be empty`
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

<style lang="scss" scoped>
textarea {
    border: none;
    outline: none;
    width: 89%;
    border-radius: 4px;
    height: 13vh;
    max-height: 300px;
    font-size: 1.5vh;
    color: get-color("off-white");
    background-color: get-color("grey", 1);
    &:focus {
        background-color: get-color("grey", 0.5);
    }
    position: relative;
    z-index: 0;
}
</style>