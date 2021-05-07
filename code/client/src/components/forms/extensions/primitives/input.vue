<template>
    <div>
        <input 
            :style="`width: ${width}%`"
            :type="inputType" 
            v-model="data" 
            :maxlength="maxChars"
            :placeholder="placeholder"
        >
    </div>
</template>

<script>
export default {
    name: "formInputPrimitive",
    props: {
        inputType: {
            type: String,
            required: true
        },
        default: {
            type: [String, Number, Boolean],
            required: false
        },
        maxChars: {
            type: Number,
            required: false,
            default: 1000
        },
        placeholder: {
            type: String,
            required: false,
            default: ''
        },
        width: {
            type: Number,
            required: false,
            default: 89
        }
    },
    data() {
        return {
            data: this.startVal()
        }
    },
    methods: {
        toMain(options) {
            this.$emit('changed', { val: this.data, ...options })
        },
        startVal() {
            return this.default !== undefined ? this.default : null
        }
    },
    watch: {
        data() {
            this.toMain()
        }
    },
    created() {
        this.toMain({ created: true })
    }

}
</script>

<style lang="scss" scoped>
input {
    border: none;
    outline: none;
    border-radius: 4px;
    height: 3vh;
    max-height: 30px;
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