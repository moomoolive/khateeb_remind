<template>
    <div class="extContainer">
        <slot></slot>
        <input :type="protect ? 'password': 'text'" v-model="confirmedData" @input="toMain()">
        <span 
            :style="`opacity: ${protect ? '1': '0.3'};`" 
            @click="protect = !protect"
        >
            👁️
        </span>
        <slot name="invalidMsgs"></slot>
    </div>
</template>

<script>
export default {
    name: "formConfirmsExt",
    props: {
        bindedTo: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            confirmedData: '',
            protect: true
        }
    },
    methods: {
        toMain() {
            this.$emit('changed', { state: this.sameAsBind, msgs: [`Not equal to password`] })
        }
    },
    computed: {
        sameAsBind() {
            return this.confirmedData === this.bindedTo
        }
    },
    watch: {
        bindedTo() {
            this.toMain()
        }
    },
    created() {
        this.toMain()
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