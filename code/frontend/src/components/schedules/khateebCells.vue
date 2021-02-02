<template>
    <div>
        <p v-if="handle"><span>@{{ handle }}</span></p>
        <p>{{ display }}</p>
        <tag-box v-if="updated" :info="`new`" />
    </div>
</template>

<script>
export default {
    name: 'khateebKhateebCells',
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
            if (first.khateebID === 'TBD')
                return first.khateebID
            else if (!first.notified || first.notified && !first.responded || first.notified && first.responded && first.confirmed)
                return this.khateebs.find(khateeb => khateeb._id === first.khateebID)
            else {
                for (let i = 1; i < khateebPreference; i++) {
                    const preference = khateebPreference[i]
                    if (preference.notified && preference.responded && preference.confirmed)
                        return this.khateebs.find(khateeb => khateeb._id === preference.khateebID)
                }
                return 'TBD'
            }
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
            const user = new Date(this.$store.state.lastVisit)
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