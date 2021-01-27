<template>
    <div>
        <select 
            v-model="currentlySelected"
            @change="toMain()"
        >
            <option
                v-for="(option, index) in options.selectOptions"
                :key="index"
                :value="value(option)"
            >
                {{ display(option) }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
    name: "formDropdownPrimitive",
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            currentlySelected: this.startValue()
        }
    },
    methods: {
        display(option) {
            if (typeof this.options.display !== "undefined")
                return option[this.options.display]
            else
                return option
        },
        value(option) {
            if (typeof this.options.value !== 'undefined')
                return option[this.options.value]
            else
                return option
        },
        startValue() {
            if (typeof this.options.value !== 'undefined')
                return this.options.selectOptions[0][this.options.value]
            else
                return this.options.selectOptions[0]
        },
        toMain(options) {
            this.$emit('changed', { val: this.currentlySelected, ...options})
        }
    },
    created() {
        this.toMain({ created: true })
    }

}
</script>

<style lang="scss" scoped>
select {
    width: 89%;
    text-align: left;
    border: none;
    outline: none;
    height: 4vh;
    max-height: 40px;
    font-size: 1.5vh;
    background-color: themeRGBA("grey", 1);
    &:focus {
        background-color: themeRGBA("grey", 0.5);
    }
    position: relative;
    z-index: 0;
}
</style>