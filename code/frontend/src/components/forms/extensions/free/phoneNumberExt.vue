<template>
    <div>
        <input 
            type="text" 
            v-model="areaCode" 
            placeholder="area" 
            maxlength="3" 
            @input="toMain()"
        > -
        <input
            type="text" 
            v-model="first3" 
            maxlength="3" 
            placeholder="123"
            @input="toMain()"
        > -
        <input 
            class="last" 
            type="text" 
            v-model="last4" 
            maxlength="4" 
            placeholder="4567"
            @input="toMain()"
        >
    </div>
</template>

<script>
export default {
    name: "formPhoneNumberExt",
    data() {
        return {
            areaCode: '',
            first3: '',
            last4: ''
        }
    },
    methods: {
        maxNumChars(target, max, $event) {
            const val = $event.target.value
            if (val.length <= max)
                this[target] = val
            this.$forceUpdate()
        },
        toMain(options) {
            const info = {
                val: this.completeNumberInt,
                state: this.readyToSubmit,
                msgs: [`Phone Number must be 9 numeric characters`],
                ...options
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
        }
    },
    created() {
        this.toMain({ created: true })
    }
}
</script>

<style scoped>

input {
    width: 7vh;
}

.last {
    width: 9vh;
}

</style>