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
        /><p>-</p>

        <input-primitive 
            class="phone-section"
            :inputType="`text`"
            :maxChars="3"
            :width="25"
            :placeholder="`123`"
            :default="first3"
            @changed="toVal('first3', $event)"
        /><p>-</p>

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
        inputPrimitive,
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
            this.$emit('changed', {
                ...options,
                val: this.completeNumberInt,
                state: this.readyToSubmit,
                msgs: this.invalidMsg
            })
        } 
    },
    computed: {
        completeNumber() {
            return this.areaCode + this.first3 + this.last4
        },
        readyToSubmit() {
            return this.utils.isNumeric(this.completeNumber) && this.completeNumber.length === 10 && this.no0AtChar0
        },
        completeNumberInt() {
            return parseInt(this.completeNumber)
        },
        no0AtChar0() {
            return this.completeNumber[0] !== '0'
        },
        invalidMsg() {
            const msgs = []
            if (!this.utils.isNumeric(this.completeNumber))
                msgs.push(`Must be Numeric`)
            if (!this.completeNumber.length !== 10)
                msgs.push(`Must Be 10 Digits`)
            if (!this.no0AtChar0)
                msgs.push(`You cannot have a zero as the first digit`)
            return msgs
        }
    },
    created() {
        if (this.options.default) {
            const startVal = this.options.default.toString()
            this.areaCode = startVal.slice(0, 3)
            this.first3 = startVal.slice(3, 6)
            this.last4 = startVal.slice(6, 10)
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

p {
    font-size: 19px;
    font-weight: bold;
    margin: 2px;
    display: inline;
}

@media screen and (max-width: $phoneWidth) {
    p {
        font-size: 2vh;
    }
}

</style>