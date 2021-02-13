<template>
    <div>
        <p><pre>{{ display(options.default) }}</pre></p>
    </div>
</template>

<script>
export default {
    name: 'formReadOnlyPrimitive',
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    methods: {
        display(data) {
            if (typeof data !== 'boolean') {
                return this.displayType(data)
            }
            if (data)
                return '✔️'
            else
                return '❌' 
        },
        displayType(data) {
            if (!this.options.format)
                return data
            else
                return this[this.options.format + 'Format'](data)
        },
        phoneNumberFormat(data) {
            data = data.toString()
            const area = data.slice(0, 3)
            const first3 = data.slice(3, 6)
            const last4 = data.slice(6, 10)
            const country = '+1' //hardcoded
            return `${country} ${area}-${first3}-${last4}`
        }
    }
}
</script>

<style lang="scss" scoped>
p {
    margin: 0;
    width: 89%;
    margin-top: 6px;
    color: black;
    margin-left: auto;
    margin-right: auto;
    font-size: 18px;
    text-align: left;
    color: getColor("offWhite");
}

div {
    cursor: not-allowed;
}

@media screen and (max-width: $phoneWidth) {
    p {
        font-size: 2.4vh;
        margin-top: 1vh;
    }
}
</style>