<template>
    <div>
        <div v-if="struct">
            <collapsable-box
                v-for="(location, id) in struct"
                :key="id"
                :headline="location.name"
            >
                <p>Location Name</p>
                <input 
                    type="text" 
                    v-model="location.name" 
                    @input="changeLocationInfo('name', location)"
                ><br>
                <p>Location Address</p>
                <input 
                    type="text" 
                    v-model="location.address" 
                    @input="changeLocationInfo('address', location)"
                ><br>
                <div v-for="(timing, index) in location.timings" :key="index">
                    <p>Prayer Time {{ index + 1 }}</p>
                    <timing-mutator
                        :timing="timing"
                        @changed="increment($event)"
                    />
                    <button 
                        class="red"
                        @click="deleteTiming(timing, location)"
                    >
                        🗑️
                    </button>
                </div>
                <button @click="addTiming(location.timings, id)">
                    Add
                </button><br>
                <button 
                    class="red"
                    @click="deleteLocation(id)"
                >
                    Delete this Location
                </button>
            </collapsable-box>
            <div>
                <button @click="addNewLocation()">
                    Add New Location
                </button>
            </div>
            <div>
                <button 
                    class="grey" 
                    :disabled="!readyToSubmit"
                    @click="save()"
                >
                    Update Locations and Timings
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import timingMutator from '@/components/userInterface/components/timingMutator.vue'

import equal from 'fast-deep-equal'

export default {
    name: "locationAndTimingsSetting",
    components: {
        timingMutator
    },
    props: {
        timings: {
            type: Array,
            required: true
        },
        locations: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            struct: null,
            originalStruct: null,
            updatedLocations: null,
            updatedTimings: null
        }
    },
    methods: {
        changeLocationInfo(attribute, location) {
            const target = this.updatedLocations.find(loc => loc._id === location._id)
            target[attribute] = location[attribute]
        },
        addTiming(previousTimings, id) {
            const last = previousTimings[previousTimings.length - 1]
            let newest = this._.deepCopy(last)
            delete newest._id; delete newest.createdAt; delete newest.updatedAt;
            newest.minute ++
            this.updatedTimings.push(newest)
            delete this.struct[id].timings
            this.buildStruct(this.updatedTimings)
        },
        ArrayToObject(array, keyNameProperty) {
            const obj = {}
            array.forEach(elem => { obj[elem[keyNameProperty]] = elem })
            return obj
        },
        buildStruct(timingsArray) {
            this.struct = this.ArrayToObject(this.locations, '_id')
            timingsArray.forEach(timing => {
                if (!this.struct[timing.locationID].timings)
                    this.struct[timing.locationID].timings = []
                this.struct[timing.locationID].timings.push(timing)
            })
        },
        increment($event) {
            let index
            let found
            for (let i = 0; i < this.updatedTimings.length; i++) {
                if (this.updatedTimings[i]._id === $event.timing._id) {
                    index = i
                    found = this.updatedTimings[i]
                    break
                }
            }
            found[$event.type] += $event.increment
            this.$set(this.updatedTimings, index, found)
        },
        async save() {
            const confirm = await this._.confirm(`Are you sure you want make these changes?`)
            if (confirm)
                this.$emit('submitted', { locations: this.updatedLocations, times: this.updatedTimings })
        },
        addNewLocation() {
            const n = this.updatedLocations.length + 1
            const newest = {
                institutionID: this.updatedLocations[0].institutionID,
                name: `Unknown Location ${n}`,
                address: `Unknown Address ${n}`
            }
            this.$emit('new-location', [...this.updatedLocations, newest])
        },
        async deleteLocation(id) {
            const confirm = await this._.confirm(`Are you sure you want to permenantly delete this location?`)
            if (Object.keys(this.struct).length > 1 && confirm)
                this.$emit('delete', { type: 'location', id })
        },
        async deleteTiming(timing, location) {
            const confirm = await this._.confirm(`Are you sure you want make these changes?`)
            if (location.timings.length > 1 && confirm)
                this.$emit('delete', { type: 'timing', id: timing._id })
        },
        updatedStructDependencies() {
            this.updatedLocations = this._.deepCopy(this.locations)
            this.updatedTimings = this._.deepCopy(this.timings)
        },
        createDisplay() {
            this.updatedStructDependencies()
            this.buildStruct(this.updatedTimings)
            this.originalStruct = this._.deepCopy(this.struct)
        }
    },
    computed: {
        readyToSubmit() {
            return !equal(this.struct, this.originalStruct)
        }
    },
    watch: {
        timings() {
            this.createDisplay()
        }
    },
    created() {
        this.createDisplay()
    }
}
</script>

<style>

</style>