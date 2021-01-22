<template>
    <div>
        <input :type="protect ? 'password' : 'text'" v-model="protectedData" @input="toMain()">
        <span 
            :style="`opacity: ${protect ? '1': '0.3'};`" 
            @click="protect = !protect"
        >
            👁️
        </span>
    </div>
</template>

<script>
export default {
    name: "formProtectedExt",
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
    data() {
        return {
            protect: true,
            protectedData: ''
        }
    },
    methods: {
        toMain(options) {
            this.$emit('changed', { val: this.protectedData, state: this.valid, msgs: this.invalidMsg })
        }
    },
    computed: {
        buttonText() {
            return this.protect ? 'show' : 'hide'
        },
        valid() {
            if (this.options.minLength)
                return this.defaultValidators.minLength(this.protectedData, this.options.minLength)
            else
                return this.defaultValidators.minLength(this.protectedData, 1)
        },
        invalidMsg() {
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
span {
    position: absolute;
    right: 10.5vh;
    font-size: 2.5vh;
    z-index: 1;
    opacity: 01;
    margin-top: auto;
    margin-bottom: auto;
    &:hover {
        cursor: pointer;
    }
}

</style>