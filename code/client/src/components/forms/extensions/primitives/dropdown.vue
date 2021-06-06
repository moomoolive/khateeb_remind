<template>
    <div>
        <select 
            v-model="currentlySelected"
            :id="createDropdownNameHash()"
            @change="toMain()"
        >
            <option
                v-for="(option, index) in selectOptions"
                :key="index"
                :value="value(option)"
            >
                {{ display(option) }}
            </option>
        </select>
    </div>
</template>

<script>
import formValidationHelpers from '@/libraries/formValidation/main.js'

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
            currentlySelected: this.options.default || null
        }
    },
    methods: {
        display(option) {
            if (this.options.display !== undefined)
                return option[this.options.display]
            else
                return option
        },
        value(option) {
            if (this.options.value !== undefined)
                return option[this.options.value]
            else
                return option
        },
        startValue() {
            if (this.options.value !== undefined)
                return this.selectOptions[0][this.options.value]
            else
                return this.selectOptions[0]
        },
        toMain(options) {
            this.$emit('changed', { val: this.currentlySelected, ...options})
        },
        createDropdownNameHash() {
            return formValidationHelpers.createFormElementNameHash("dropdown")
        }
    },
    computed: {
        selectOptions() {
            if (this.options.selectOptions && this.options.selectOptions.length > 0)
                return this.options.selectOptions
            let defaultVal = this.options.value || this.options.display ? {} : 'none'
            if (this.options.value)
                defaultVal[this.options.value] = 'none'
            if (this.options.display)
                defaultVal[this.options.display] = 'None'
            return [defaultVal]
        }
    },
    watch: {
        currentlySelected() {
            this.toMain()
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.currentlySelected)
                this.currentlySelected = this.startValue()
        })
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
    min-height: 33px;
    font-size: 17px;
    color: get-color("off-white");
    background-color: get-color("grey", 1);
    &:focus {
        background-color: get-color("grey", 0.5);
    }
    position: relative;
    z-index: 0;
}
</style>