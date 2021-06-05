<template>
    <div>
        <div :id="createTimingMutatorNameHash()">
            <timing-mutator
                class="mutator-container"
                :timing="time"
                :textColor="options.textColor || 'none'"
                :elementSize="options.size || 'none'"
                @changed="mutateAndEmit($event)"
            />
        </div>
    </div>
</template>

<script>
import timingMutator from '@/components/general/timingMutator.vue'

import formValidationHelpers from '@/libraries/formValidation/main.js'

export default {
    name: "timingMutatorFormPrimitive",
    components: {
        timingMutator
    },
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            time: {
                minute: 50,
                hour: 12
            }
        }
    },
    methods: {
        mutateTime({ type="minute", increment=1 }) {
            this.time[type] += increment
        },
        mutateAndEmit(timingChange={}) {
            this.mutateTime(timingChange)
            this.toMain()
        },
        toMain(options) {
            this.$emit('changed', { val: this.time, ...options })
        },
        setStartValue() {
            if (!this.valueExists)
                return
            if (typeof this.minutesValue === 'number')
                this.time.minute = this.minutesValue
            if (this.hourValue && typeof this.hourValue === 'number')
                this.time.hour = this.hourValue
        },
        createTimingMutatorNameHash() {
            return formValidationHelpers.createFormElementNameHash("timingmutator")
        }
    },
    computed: {
        minutesKey() {
            return this.options.minutesKey || 'minute' 
        },
        valueExists() {
            return this.options.default !== undefined || typeof this.options.default === 'object'
        },
        minutesValue() {
            if (this.valueExists)
                return this.options.default[this.minutesKey]
            else
                return 50
        },
        hourKey() {
            return this.options.hourKey || 'hour'
        },
        hourValue() {
            if (this.valueExists)
                return this.options.default[this.hourKey]
            else
                return 12
        }
    },
    created() {
        this.setStartValue()
        this.toMain({ created: true })
    } 
}
</script>

<style lang="scss" scoped>
.mutator-container {
    margin-top: 5px;
    margin-bottom: 5px;
}
</style>