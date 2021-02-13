<template>
    <div>
        <div v-if="struct">
            <collapsable-box
                v-for="(location, id) in struct"
                :key="id"
                class="location-container"
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
                    <div class="prayer-timing">
                        <p class="timing-label">Prayer Time {{ index + 1 }}</p>
                        <timing-mutator
                            :timing="timing"
                            @changed="increment($event)"
                        />
                        <button 
                            class="red timing-btns"
                            @click="deleteTiming(timing, location)"
                        >
                            🗑️
                        </button>
                    </div>
                </div>
                <button
                    class="timing-btns" 
                    @click="addTiming(location.timings, id)"
                >
                    Add
                </button><br>
                <button 
                    class="red delete-location-btn"
                    @click="deleteLocation(id)"
                >
                    Delete this Location
                </button>
            </collapsable-box>
            <div class="outside-location-btns-container">
                <button
                    class="outside-location-btns"
                    @click="addNewLocation()"
                >
                    Add New Location
                </button>
                <button 
                    class="grey outside-location-btns" 
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
            updatedTimings: null,
            newTimingsCreatedThisSession: 0
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
            newest._id = `newTiming${this.newTimingsCreatedThisSession}` 
            delete newest.createdAt; delete newest.updatedAt; delete newest.__v;
            newest.new = true
            newest.minute++
            this.updatedTimings.push(newest)
            delete this.struct[id].timings
            this.buildStruct(this.updatedTimings)
            this.newTimingsCreatedThisSession++
            
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
            else
                this._.alert(`You must have at least one location at your institution`)
        },
        async deleteTiming(timing, location) {
            const confirm = await this._.confirm(`Are you sure you want make these changes?`)
            const hasNotBeenLoggedToSystemYet = timing._id.slice(0, -1) === 'newTiming'
            if (hasNotBeenLoggedToSystemYet) {
                const position = this.updatedTimings.map(time => time._id).indexOf(timing._id)
                this.updatedTimings.splice(position, 1)
                this.$store.dispatch('adminSavedChangesScreen', true)
            }
            else if (location.timings.length > 1 && confirm)
                this.$emit('delete', { type: 'timing', id: timing._id })
            else
                this._.alert('You must have at least one timing per location')
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

<style lang="scss" scoped>
.location-container {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
}

p {
    color: getColor("offWhite");
    font-size: 19px;
    font-weight: bold;
    margin-top: 2vh;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

input {
    border: none;
    outline: none;
    border-radius: 4px;
    height: 5vh;
    max-height: 55px;
    width: 80%;
    color: getColor("offWhite");
    margin-right: auto;
    margin-left: auto;
    font-size: 1.5vh;
    background-color: themeRGBA("grey", 1);
    &:focus {
        background-color: themeRGBA("grey", 0.5);
    }
    position: relative;
    z-index: 0;
}

.prayer-timing {
    margin-top: 35px;
    margin-bottom: 35px;
    width: 65%;
    margin-left: auto;
    margin-right: auto;
    background: getColor("blue");
    border-radius: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15%;
    padding-right: 15%;
}

.timing-label {
    color: black;
}

button {
    max-height: 45px;
}

.delete-location-btn {
    width: 95%
}

.timing-btns {
    max-width: 70px;
    max-height: 42px;
    font-size: 19px;
}

.outside-location-btns {
    width: 90%;
    height: 6vh;
    max-height: 60px;
    margin-bottom: 15px;
}

.outside-location-btns-container {
    padding-top: 15px;
    padding-bottom: 15px;
}

@media screen and (max-width: $phoneWidth) {
     p {
         font-size: 2.6vh;
         margin-top: 2vh;
     }
     .prayer-timing {
        margin-top: 5vh;
        margin-bottom: 5vh;
        padding-top: 1.5vh;
        padding-bottom: 1.5vh;
    }
    .outside-location-btns-container {
        padding-top: 1.9vh;
        padding-bottom: 1.9vh;
    }
    .outside-location-btns {
        margin-bottom: 3vh;
    }

    .timing-btns {
        max-width: 70px;
        max-height: 42px;
        font-size: 2.5vh;
    }

}
</style>