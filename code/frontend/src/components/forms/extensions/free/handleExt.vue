<template>
    <div>
        <input type="text" v-model="handleData" @input="toMain()">
    </div>
</template>

<script>
export default {
    name: "formHandleExt",
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
            handleData: ''
        }
    },
    methods: {
        toMain(options) {
            this.$emit('changed', { val: this.handleData, state: this.valid, msgs: this.invalidMsg })
        }
    },
    computed: {
        valid() {
            const len = this.defaultValidators.minLength(this.handleData, 1)
            const noAtSymbolChar0 = this.handleData[0] !== '@'
            return len && noAtSymbolChar0
        },
        invalidMsg() {
            if (!this.valid)
                return [`Handle cannot contain '@' as the first letter and must be at least one charcter`]
            else
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