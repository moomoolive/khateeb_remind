<template>
    <div>
        <div class="button-label no-jummahs">
            No Jummahs to Show This Month
        </div>
        <button 
            class="purple display-button"
            :disabled="futureBuildMaximum"
            @click="$emit('build-schedule')"
        >
            {{ futureBuildMaximum ? 'X' : '+' }}
        </button>
        <div class="button-label under-button-text">
            {{ underButtonLabel }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'noJummahsKhateeb',
    components:{

    },
    props: {
        monthsFromCurrent: {
            type: Number,
            required: true
        }
    },
    computed: {
        futureBuildMaximum() {
            return this.monthsFromCurrent > 1
        },
        underButtonLabel() {
            if (!this.futureBuildMaximum)
                return 'Click to Create'
            else
                return 'Cannot schedule more than one month ahead'
        }
    }
}
</script>

<style lang="scss" scoped>
.under-button-text {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}
</style>