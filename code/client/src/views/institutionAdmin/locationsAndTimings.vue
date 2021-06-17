<template>
    <div>

        <div>
            <button 
                class="purple back-to-schedule"
                @click="$router.push('/institutionAdmin/schedule')"
            >
                Back to Schedule
            </button>
        </div>

        <general-popup-container 
            v-show="showEditDefaultKhateebsContainer"
            :closeOnClickAway="false" 
            @close="closePopup()"
        >
            <div 
                v-if="defaultKhateebsArray.length === 5" 
                class="default-khateebs-container"
            >
                <div 
                    v-for="(defaultKhateebsForWeek, index) in defaultKhateebsArray" 
                    :key="index"
                >
                    
                    <div class="default-khateebs-week-text" @click="changeDefaultKhateebsSelectedWeek(index)">
                        <span class="default-week-open-indicator">
                            {{ selectedDefaultKhateebsWeek === index ? '-' : '+' }}
                        </span>
                         Week {{ index + 1 }}{{ index === defaultKhateebsArray.length - 1 ? " (if applicable)" : "" }}
                    </div>

                    <div 
                        v-if="selectedDefaultKhateebsWeek === index" 
                        class="default-khateebs-weekly-container"
                    >

                        <div v-for="x in 2" :key="x">
                            <div class="default-khateebs-input-text">
                                {{ x === 1 ? 'Main Khateeb' : 'Backup' }}
                            </div>
                            <select
                                v-model="timings
                                    .find(t => t._id === defaultKhateebsInfo)
                                    .defaultKhateebs[index][x === 1 ? 'mainKhateeb' : 'backup' ]
                                " 
                                class="default-khateebs-input"
                                @change="defaultKhateebChanged(x === 1 ? 'mainKhateeb' : 'backup')"
                            >
                                <option :value="_config.nullId">None</option>
                                <option
                                    v-for="
                                        (khateeb, khateebIndex) in 
                                        khateebs
                                            .filter(k => {
                                                if (k.availableTimings.length < 1)
                                                    return true
                                                else
                                                    return k.availableTimings.find(t => t === defaultKhateebsInfo)
                                            })
                                            .filter(k => {
                                                return k._id !== defaultKhateebsArray[selectedDefaultKhateebsWeek][x === 1 ? 'backup' : 'mainKhateeb']
                                            })
                                    " 
                                    :key="khateebIndex"
                                    :value="khateeb._id"
                                >
                                    {{ khateebName(khateeb) }}
                                </option>
                            </select>
                        </div>

                    </div>

                </div>
            </div>

            <div v-else>
                There was a problem displaying default khateebs
            </div>

        </general-popup-container>

        <loading>

            <div class="locations-container">

                <collapsable-box
                    v-for="(location, locationIndex) in locations.filter(l => Object.keys(l).length > 0)"
                    :key="locationIndex"
                    :headline="location.name"
                    :closeOnClickAway="!showEditDefaultKhateebsContainer"
                    class="location-container"
                >
                    
                    <p>Location Name</p>
                    <input 
                        type="text" 
                        v-model="location.name"
                        minlength="1"
                        @input="updateLocation(location, locationIndex)" 
                    ><br>

                    <p>Location Address</p>
                    <input 
                        type="text"
                        minlength="1" 
                        v-model="location.address"
                        @input="updateLocation(location, locationIndex)"
                    ><br>

                    <div 
                        v-for="(timing, timingIndex) in timings.filter(t => t.locationID === location._id)" 
                        :key="timingIndex"
                    >
                        <div class="prayer-timing">
                            
                            <p class="timing-label">
                                Prayer Time {{ timingIndex + 1 }}
                            </p>
                            
                            <timing-mutator
                                class="timing-mutator-container"
                                :timing="timing"
                                @changed="incrementTime($event, timing)"
                            />

                            <div>
                                <button 
                                    class="purple edit-default-khateebs-button"
                                    @click="showDefaultKhateebs(timing)"    
                                >
                                    Edit Default Khateebs
                                </button>
                            </div>

                            <div>
                                <button 
                                    class="red timing-btns extra-margin"
                                    @click="deleteTiming(timing)"
                                >
                                    🗑️
                                </button>
                            </div>

                        </div>
                    </div>
                    
                    <div>
                        <button
                            class="timing-btns large green" 
                            @click="addTiming(location)"
                        >
                            New Timing
                        </button>
                    </div>

                    <div>
                        <button
                            class="red timing-btns large"
                            @click="deleteLocation(location)"
                        >
                            Delete this Location
                        </button>
                    </div>

                </collapsable-box>

            </div>

            <div>
                <button 
                    class="add-location-btn dark-blue"
                    @click="addNewLocation()"
                >
                    +
                </button>
            </div>

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import collapsableBox from '@/components/general/collapsableBox.vue'
import timingMutator from '@/components/general/timingMutator.vue'
import generalPopupContainer from '@/components/notifications/generalPopup.vue'

import requestHelpers from '@/libraries/requests/helperLib/main.js'
import khateebHelpers from '@/libraries/khateebs/main.js'

export default {
    name: 'editLocationAndTimings',
    components: {
        collapsableBox,
        loading,
        timingMutator,
        generalPopupContainer
    },
    data() {
        return {
            locations: [],
            timings: [],
            khateebs: [],
            showEditDefaultKhateebsContainer: false,
            defaultKhateebsInfo: this._config.nullId,
            selectedDefaultKhateebsWeek: -1,
            cachedTimings: []
        }
    },
    methods: {
        khateebName(khateeb) {
            return khateebHelpers.khateebName(khateeb)
        },
        defaultKhateebChanged(role="mainKhateeb") {
            const targetData = this.timings
                .find(t => t._id === this.defaultKhateebsInfo)
                .defaultKhateebs[this.selectedDefaultKhateebsWeek]
            if (!this.newPreferenceChangeIsAllowed(targetData, role))
                return this.overwriteTimingsWithCache()
            this.updateTiming(this.defaultKhateebsTiming)
            
        },
        overwriteTimingsWithCache() {
            this.timings = this._utils.deepCopy(this.cachedTimings)
        },
        newPreferenceChangeIsAllowed(newPreferences={}, role="mainKhateeb") {
            if (newPreferences.mainKhateeb === newPreferences.backup && newPreferences[role] !== this._config.nullId) {
                this._utils.alert(`Main and backup khateeb cannot be the same`)
                return false
            }
            const khateeb = this.khateebs.find(k => k._id === newPreferences[role])
            if (khateeb && khateeb.availableTimings.length > 0 && !khateeb.availableTimings.find(t => t === this.defaultKhateebsTiming._id)) {
                this._utils.alert(`${khateeb.firstName} has specified that he is not available for this timing. You are not allowed to schedule him as a default khateeb here.`)
                return false
            }
            return true
        },
        async updateTiming(updatedTiming={}) {
            const res = await this._api.timings.updateTiming(updatedTiming)
            if (Object.keys(res).length > 0)
                this.timings.splice(this.findIndexById(res._id, "timings"), 1, res)
            else
                this.overwriteTimingsWithCache()
        },
        changeDefaultKhateebsSelectedWeek(index=1) {
            if (this.selectedDefaultKhateebsWeek !== index)
                this.selectedDefaultKhateebsWeek = index
            else
                this.selectedDefaultKhateebsWeek = -1
        },
        async updateLocation(location, index) {
            await this._utils.delayedRequest(
                'locations',
                'updateLocation',
                { 
                    arguments: [location],
                    additionalIdentifiers: [index.toString()]
                }
            )
        },
        async incrementTime(incrementInfo={}, timing={}) {
            const index = this.findIndexById(timing._id)
            this.timings[index][incrementInfo.type] += incrementInfo.increment
            await this._utils.delayedRequest(
                'timings', 
                'updateTiming', 
                { 
                    arguments: [this.timings[index]],
                    additionalIdentifiers: [index.toString()]
                }
            )
        },
        showDefaultKhateebs(timing={}) {
            this.defaultKhateebsInfo = timing._id
            this.showEditDefaultKhateebsContainer = true
        },
        closePopup() {
            const oneHundredMilliseconds = 100
            return window.setTimeout(() => {
                this.showEditDefaultKhateebsContainer = false
                this.selectedDefaultKhateebsWeek = -1
                this.defaultKhateebsInfo = this._config.nullId
            }, oneHundredMilliseconds)
        },
        async addNewLocation() {
            const length = this.locations.length + 1
            const { location, timing } = await this._api.locations.createNewLocation({ name: `Unknown Location ${length}`, address: `Unknown Address ${length}` })
            this.timings.push(timing)
            this.locations.push(location)
        },
        async addTiming(location) {
            const target = this.timings.find(t => t.locationID === location._id) || { hour: 12, minute: 29 }
            const newTiming = await this._api.timings.createNewTiming({ 
                locationID: location._id,
                minute: target.minute === 59 ? 0 : target.minute + 1,
                hour: target.minute === 59 ? target.hour + 1 : target.hour
            })
            this.timings.push(newTiming)
        },
        async deleteTiming(timing) {
            if (this.timings.filter(t => timing.locationID === t.locationID).length < 2)
                return this._utils.alert(`You must have at least one timing per location!`)
            const confirm = await this._utils.confirm(`Are you sure you want delete this timing?`)
            if (confirm) {
                const res = await this._api.timings.deleteTiming(timing._id)
                if (requestHelpers.dataWasDeleted(res)) 
                    this.timings.splice(this.findIndexById(timing._id), 1)
            }
        },
        async deleteLocation(location) {
            if (this.locations.length < 2) {
                return this._utils.alert(`You must have at least one location`)
            }
            const confirm = await this._utils.confirm(`Are you sure you want to delete this location?`)
            if (confirm) {
                const res = await this._api.locations.deleteLocation(location._id)
                if (requestHelpers.dataWasDeleted(res)) {
                    this.locations.splice(this.findIndexById(location._id, 'locations'), 1)
                    this.timings = this.timings.filter(t => t.locationID !== location._id)
                }
            }
        },
        findIndexById(id="123456789012345678901234", data="timings") {
            return this[data].findIndex(d => d._id === id)
        },
        async getLocationsAndTimings() {
            const [locations, timings] = await this._api.chainedRequests.getActiveLocationsAndTimings()
            this.locations = locations
            this.timings = timings
        },
        async getKhateebs() {
            this.khateebs = await this._api.khateebs.getKhateebs()
        }
    },
    computed: {
        defaultKhateebsTiming() {
            if (this.defaultKhateebsInfo !== this._config.nullId)
                return this.timings[this.findIndexById(this.defaultKhateebsInfo, "timings")]
            else
                return {}
        },
        defaultKhateebsArray() {
            if (Object.keys(this.defaultKhateebsTiming).length > 0)
                return this.defaultKhateebsTiming.defaultKhateebs
            else
                return []
        }
    },
    watch: {
        timings(newVal) {
            this.cachedTimings = this._utils.deepCopy(newVal)
        }
    },
    created() {
        this.getLocationsAndTimings()
        this.getKhateebs()
    }
}
</script>

<style lang="scss" scoped>
.location-container {
    max-width: $singular-collapsable-box-max-width;
    @include center-margin();
}

.locations-container {
    margin-top: 25px;
    width: 90%;
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
}

.default-khateebs-container {
    overflow-x: hidden;
    overflow-y: scroll;
}

p {
    color: get-color("off-white");
    font-size: 19px;
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 7px;
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
    color: get-color("off-white");
    margin-right: auto;
    margin-left: auto;
    font-size: 17px;
    background-color: get-color("grey", 1);
    &:focus {
        background-color: get-color("grey", 0.5);
    }
    position: relative;
    z-index: 0;
    margin-bottom: 30px;
}

.prayer-timing {
    margin-top: 35px;
    margin-bottom: 35px;
    width: 65%;
    margin-left: auto;
    margin-right: auto;
    max-width: 250px;
    background: get-color("blue");
    border-radius: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15%;
    padding-right: 15%;
}

.timing-label {
    color: black;
    margin-bottom: 20px;
}

.timing-mutator-container {
    width: 100%;
}

button {
    max-height: 45px;
}

.edit-default-khateebs-button {
    margin-top: 15px;
    margin-bottom: 15px;
    max-width: 200px;
    height: 30px;
    font-size: 15px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.default-khateebs-weekly-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

.default-khateebs-input-text {
    color: get-color("purple");
    font-size: 16px;
    margin-bottom: 3px;
}

.default-khateebs-input {
    width: 105px;
    margin-bottom: 12px;
    margin-left: 8px;
    margin-right: 8px;
    height: 30px;
    border: none;
    outline: none;
    border-radius: 4px;
    background: get-color("silver");
    color: get-color("purple");
}

.default-khateebs-week-text {
    color: get-color("off-white");
    font-size: 18px;
    text-align: left;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
}

.default-week-open-indicator {
    color: get-color("blue");
}

.timing-btns {
    max-height: 42px;
    font-size: 19px;
    &.extra-margin {
        margin-top: 15px;
    }
    @include floating-box-shadow();
}

.add-location-btn {
    margin-top: 30px;
    font-weight: bold;
    width: auto;
    max-width: 600px;
    max-height: 70px;
    font-size: 19px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.back-to-schedule {
    font-size: 20px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

@media screen and (max-width: $phone-width) {
     p {
         font-size: 17px;
     }

     .timing-btns {
        font-size: 16px;
    }

    .prayer-timing {
        margin-top: 5vh;
        margin-bottom: 5vh;
        padding-top: 1.5vh;
        padding-bottom: 1.5vh;
    }

    input {
        font-size: 12px;
    }

    .back-to-schedule {
        font-size: 15px;
    }
}
</style>