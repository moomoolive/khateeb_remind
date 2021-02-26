<template>
    <div>
        <p v-if="handle"><span>@{{ handle }}</span></p>
        <p>{{ display }}</p>
        <tag-box v-if="updated && khateebData !== 'TBD'" :info="`new`" />
    </div>
</template>

<script>
import tagBox from '@/components/general/tagBox.vue'

export default {
    name: 'khateebKhateebCells',
    components: {
        tagBox
    },
    props: {
        timing: {
            type: Object,
            required: true
        },
        khateebs: {
            type: Array,
            required: true
        }
    },
    methods: {
        findDisplay(khateebPreference) {
            const first = khateebPreference[0]
            if (first.khateebID === 'TBD' && !this.timing.confirmed)
                return first.khateebID
            else if (!first.notified)
                return this.findKhateeb(first.khateebID)
            else {
                for (let i = 0; i < khateebPreference.length; i++) {
                    const preference = khateebPreference[i]
                    if (this.preferenceHasConfirmed(preference))
                        return this.findKhateeb(preference.khateebID)
                }
                return 'TBD'
            }
        },
        preferenceHasConfirmed(preference) {
            return preference.notified && preference.responded && preference.confirmed
        },
        findKhateeb(khateebID) {
            return this.khateebs.find(khateeb => khateeb._id === khateebID)
        },
        organizeDisplay(displayVal) {
            if (displayVal === 'TBD')
                return displayVal
            else
                return `${displayVal.title.toLowerCase() !== 'none' ? `${displayVal.title} ` : ''}${displayVal.firstName} ${displayVal.lastName}`
        },
    },
    computed: {
        updated() {
            const user = new Date(this.$store.state.user.lastLogin)
            const update = new Date(this.timing.updatedAt)
            return user.getTime() < update.getTime()
        },
        khateebData() {
            return this.findDisplay(this.timing.khateebPreference)
        },
        display() {
            return this.organizeDisplay(this.khateebData)
        },
        handle() {
            if (this.khateebData === 'TBD')
                return null
            else
                return this.khateebData.handle
        }
    }
}
</script>

<style lang="scss" scoped>

p {
    font-size: 19px;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 95%;
}

span {
    color: getColor('blue');
}

@media screen and (max-width: $phoneWidth) {
    p {
        font-size: 2.5vh;
        padding-top: 1vh;
        padding-bottom: 1vh;
    }

}

</style>