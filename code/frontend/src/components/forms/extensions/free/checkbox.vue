<template>
    <div>
        <input type="checkbox" style="display: inline;" v-model="data">
    </div>
</template>

<script>
export default {
    name: 'formCheckbox',
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
            data: this.options.default || false
        }
    },
    methods: {
        toMain(options) {
            this.$emit('changed', { val: this.data, ...options })
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

<style>

</style>