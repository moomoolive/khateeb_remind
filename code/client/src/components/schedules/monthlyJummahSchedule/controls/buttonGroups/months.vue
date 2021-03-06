<template>
    <div>
        <button class="yellow" @click="changeMonth(-1)">
            Last Month
        </button>
        <button class="blue" @click="changeMonth(1)">
            Next Month
        </button>
        <collapse-transition :duration="500">
            <div v-show="showBackToCurrentMonthButton">
                <button class="orange" @click="$emit('back-to-current')">Back to Current Month</button>
            </div>
        </collapse-transition>
    </div>
</template>

<script>
import { CollapseTransition } from "@ivanv/vue-collapse-transition"

export default {
    name: "jummahScheduleChangeMonthButtons",
    components: {
        CollapseTransition
    },
    props: {
        viewingMonthIsCurrentPastOrFuture: {
            type: String,
            required: true
        }
    },
    methods: {
        changeMonth(increment) {
            this.$emit('change-month', increment)
        }
    },
    computed: {
        showBackToCurrentMonthButton() {
            return this.viewingMonthIsCurrentPastOrFuture !== 'current'
        }
    }
}
</script>

<style lang="scss" scoped>

</style>