<template>
    <div></div>
</template>

<script>
import localStorageManagement from '@/libraries/localStorageManagement/main.js'
import notificationHelpers from '@/libraries/notifications/main.js'

export default {
    name: "tutorialPrompter",
    props:{
        tutorials: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            targetStorageKey: 'seenTutorials'
        }
    },
    methods: {
        tutorialKey({ category, number }) {
            return `${category}-${number}`
        },
        isTutorialEligibleForPrompting(listOfSeenTutorials, tutorialKey) {
            if (!listOfSeenTutorials)
                return true
            else
                return !listOfSeenTutorials[tutorialKey]
        },
        markAsPrompted(listOfSeenTutorials, tutorialKey) {
            let seenTutorials
            if (!listOfSeenTutorials)
                seenTutorials = {}
            else
                seenTutorials = { ...listOfSeenTutorials }
            seenTutorials[tutorialKey] = true
            return seenTutorials
        }
    },
    mounted() {
        this.$nextTick(() => {
            if (this.tutorials === undefined || this.tutorials.length < 1)
                return
            let seenTutorialList = localStorageManagement.get(this.targetStorageKey)
            const oneSecondInMilliseconds = 1_000
            this.tutorials.forEach(tutorial => {
                const tutorialKey = this.tutorialKey(tutorial)
                if (this.isTutorialEligibleForPrompting(seenTutorialList, tutorialKey)) {
                    window.setTimeout(
                        () => { notificationHelpers.tutorial(tutorial.category, tutorial.number, true) },
                        oneSecondInMilliseconds
                    )
                    seenTutorialList = this.markAsPrompted(seenTutorialList, tutorialKey)
                }
            })
            localStorageManagement.commit(this.targetStorageKey, seenTutorialList)
        })
    }
}
</script>