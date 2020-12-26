<template>
    <div>
        <h3 v-if="!hasInitializedLocations">
            You need to create at least one location, with one timing to<br>
            start setting your schedules
        </h3>
        <div v-for="(location, locationIndex) in inputData.options" :key="locationIndex">
            <collapsable-box
                :headline="location.info.name || `Location ${locationIndex + 1}`"
                :options="{
                    inputData: inputData,
                    location: location,
                    locationIndex: locationIndex
                }"
                pathToComponentFromComponents='settings/locationTiming/subcomponents/locationRenderer'
            />
        </div>
        <button
            @click="addNewLocation()"
        >
            Add New Location
        </button>
    </div>
</template>

<script>
import equal from 'fast-deep-equal'

export default {
    name: "locationSettingsMain",
    data() {
        return {
            hasInitializedLocations: true,
            inputData: {
                name: 'locations&Timing',
                options: [ ],
            },
            emptyLocation: {},
            cachedLocations: []
        }
    },
    methods: {
        addNewLocation() {
            const newLocation = this._.deepCopy(this.emptyLocation)
            this.inputData.options.push(newLocation)
        },
        async save() {
            const response = await this.$API.admin.updateSetting(this.inputData)
            if (response === 'Changes successfully made!') {
                    this.$store.dispatch('adminSavedChangesScreen', true)
            }
        },
        loadInPreviousEntries(previousEntries) {
            this.inputData = previousEntries[0]
            this.cachedLocations = this._.deepCopy(this.inputData.options)
        },
        loadInEmpty(emptySchema) {
            this.hasInitializedLocations = false
            this.inputData = emptySchema
        },
        async loadAPIData() {
            const locations =  await this.$API.admin.getSetting('locationAndTimings')
            console.log(locations)
            if (locations.previousEntries[0]) this.loadInPreviousEntries(locations.previousEntries)
            else this.loadInEmpty(locations.emptySchema)
            this.emptyLocation = this._.deepCopy(locations.emptySchema.options[0])
        }
    },
    computed: {
        currentSchedule() {
            return this.inputData.options
        },
        isSame() {
            for (let x = 0; x < this.currentSchedule.length; x++) {
                if (!equal(this.currentSchedule[x], this.cachedLocations[x])) return false
            }
            return true && this.sameNumberOfLocations
        },
        sameNumberOfLocations() {
            return this.currentSchedule.length === this.cachedLocations.length
        },
        emptyNameOrAddress() {
            for (let location of this.inputData.options) {
                let name = location.info.name
                let address = location.info.address
                if (name === '' || address === '') return true
            }
            return false
        },
        isDisabled() {
            return this.isSame || this.emptyNameOrAddress
        }
    },
    created() {
        this.loadAPIData()
    }
}
</script>

<style lang="scss" scoped>

</style>