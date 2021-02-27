<template>
    <div>
        <tag-circle 
            :info="tag(jummah)"
        />
    </div>
</template>

<script>
import tagCircle from '@/components/general/tagCircle.vue'

export default {
    name: "jummahTimingTag",
    components: {
        tagCircle
    },
    props: {
        jummah: {
            type: Object,
            required: true
        },
        viewingMonthIsCurrentPastOrFuture: {
            type: String,
            required: true
        },
        viewingWeekIsCurrentPastOrFuture: {
            type: String,
            required: true
        }
    },
    methods: {
        tag(timing) {
            switch(this.viewingMonth) {
                case 'past':
                    if (timing.confirmed)
                        return {
                            words: 'Complete',
                            color: 'green',
                            icon: '✔️'
                        }
                    else
                        return {
                            words: 'Missed',
                            color: 'red',
                            icon: '❌'
                        }
                case 'future':
                    return {
                        words: 'Future',
                        color: 'blue',
                        icon: '📅'
                    }
                case 'current':
                    if (this.currentWeek === 'current') {
                        if (timing.confirmed) {
                            return {
                                words: 'Confirmed',
                                color: 'green',
                                icon: '👍'
                            }
                        } else {
                            if (timing.khateebPreference[0].notified)
                                return {
                                    words: 'Notified',
                                    color: 'purple',
                                    icon: '📱'
                                }
                            else
                                return {
                                    words: 'Pending',
                                    color: 'purple',
                                    icon: '⏱️'
                                }
                        }
                    }
                    else if (this.currentWeek === 'future')
                        return {
                            words: 'Future',
                            color: 'blue',
                            icon: '📅'
                        }
                    else {
                        if (timing.confirmed)
                            return {
                                words: 'Complete',
                                color: 'green',
                                icon: '✔️'
                            }
                        else
                            return {
                                words: 'Missed',
                                color: 'red',
                                icon: '❌'
                            }
                    }
                default:
                    return {
                        words: 'Pending',
                        color: 'purple',
                        icon: '⏱️'
                    }
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>