<template>
    <div>
        <textarea v-model="data" @input="toMain()"></textarea>
    </div>
</template>

<script>
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

<style lang="scss" scoped>
textarea {
    border: none;
    outline: none;
    width: 89%;
    border-radius: 4px;
    height: 13vh;
    max-height: 300px;
    font-size: 1.5vh;
    color: getColor("offWhite");
    background-color: themeRGBA("grey", 1);
    &:focus {
        background-color: themeRGBA("grey", 0.5);
    }
    position: relative;
    z-index: 0;
}
</style>