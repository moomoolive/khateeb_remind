<template>
    <div class="phone-number-container" v-if="init">
        <input-primitive 
            class="phone-section"
            :inputType="`text`"
            :maxChars="3"
            :width="24"
            :placeholder="`Area Code`"
            :default="areaCode"
            @changed="toVal('areaCode', $event)"
        /> -
        <input-primitive 
            class="phone-section"
            :inputType="`text`"
            :maxChars="3"
            :width="25"
            :placeholder="`123`"
            :default="first3"
            @changed="toVal('first3', $event)"
        /> -
        <input-primitive 
            class="phone-section"
            :inputType="`text`"
            :maxChars="4"
            :width="35"
            :placeholder="`4567`"
            :default="last4"
            @changed="toVal('last4', $event)"
        />
    </div>
</template>

<script>
import inputPrimitive from '@/components/forms/extensions/primitives/input.vue'

export default {
    name: "formPhoneNumberExt",
    components: {
        inputPrimitive
    },
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            areaCode: '',
            first3: '',
            last4: '',
            init: false
        }
    },
    methods: {
        toVal(target, $event) {
            this[target] = $event.val
            delete $event.val
            this.process($event)

        },
        process(options) {
            const info = {
                ...options,
                val: this.completeNumberInt,
                state: this.readyToSubmit,
                msgs: this.invalidMsg
            }
            this.$emit('changed', info)
        } 
    },
    computed: {
        completeNumber() {
            return this.areaCode + this.first3 + this.last4
        },
        readyToSubmit() {
            return this._.isNumeric(this.completeNumber) && this.completeNumber.length === 10
        },
        completeNumberInt() {
            return parseInt(this.completeNumber)
        },
        invalidMsg() {
            if (!this.readyToSubmit)
                return [`Phone number must be 9 numeric characters`]
            else
                return []
        }
    },
    created() {
        if (this.options.default) {
            const startVal = this.options.default.toString()
            this.areaCode = startVal.slice(0, 4)
            this.first3 = startVal.slice(4, 7)
            this.last4 = startVal.slice(7, 10)
        }
        this.init = true
    }
}
</script>

<style lang="scss" scoped>

.phone-number-container {
    width: 89%;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
}

.phone-section {
    display: inline;
}

input {
    width: 7vh;
}

.last {
    width: 9vh;
}

</style>