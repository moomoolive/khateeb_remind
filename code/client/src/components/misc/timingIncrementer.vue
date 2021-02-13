<template>
    <div>
        <table>
            <tr>
                <th>
                    <button @click="incrementHours(1)">
                        +
                    </button>
                    <p>{{ hour }}</p>
                    <button 
                        class="red"
                        @click="incrementHours(-1)"
                    >
                        -
                    </button>
                </th>
                <th>
                    <button @click="incrementMinutes(1)">
                        +
                    </button>
                    <p>{{ minutes }}</p>
                    <button
                        class="red"
                        @click="incrementMinutes(-1)"
                    >
                        -
                    </button>
                </th>
                <th>
                    <p>{{ amOrPM }}</p>
                </th>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: 'timingIncrementer',
    props: {
        dateString: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            inputData: null
        }
    },
    methods: {
        incrementHours(hours) {
            this.inputData.setHours(this.inputData.getHours() + hours)
            this.toDateObject(this.inputData)
        },
        incrementMinutes(minutes) {
            this.inputData.setMinutes(this.inputData.getMinutes() + minutes)
            this.toDateObject(this.inputData)
        },
        toDateObject(date) {
            this.inputData = new Date(this._.deepCopy(date))
        }
    },
    computed: {
        hour() {
            const hours = this.inputData.getHours()
            return hours > 12 ? hours - 12 : hours
        },
        minutes() {
            const mins = this.inputData.getMinutes()
            return mins < 10 ? `0${mins}` : mins
        },
        amOrPM() {
            return this.inputData.getHours() > 11 ? 'PM' : 'AM'
        }
    },
    watch: {
        inputData(newVal) {
            this.$emit('changed', newVal.toUTCString())
        }
    },
    created() {
        this.toDateObject(this.dateString)
    }
}
</script>

<style lang="scss" scoped>
button {
    margin: 0;
}

table {
    margin-left: auto;
    margin-right: auto;
}

th {
    $padding: 1vh;
    padding-left: $padding;
    padding-right: $padding;
}

</style>