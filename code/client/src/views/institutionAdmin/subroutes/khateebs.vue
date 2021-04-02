<template>
    <div>
        <loading>
            <div v-if="khateebs.length > 0">
                <div class="search-tools">
                    <div>
                        <button class="yellow" @click="showSearchTools = !showSearchTools">
                            🔍 {{ showSearchTools ? 'Close' : 'Open' }} Search Tools
                        </button>
                    </div>
                    <div v-show="showSearchTools">
                        <div>
                            <p class="search-results"><u>{{ filteredKhateebs.length }}</u> Search Results</p>
                        </div>
                        <div>
                            <button class="red reset-search" @click="resetSearch()">
                                Reset Search
                            </button>
                        </div>
                        <div class="input-container">
                            <div>
                                <p>Confirmed</p>
                                <select v-model="query.confirmed">
                                    <option value="any">Any</option>
                                    <option :value="true">Confirmed</option>
                                    <option :value="false">Pending Confirmation</option>
                                </select>
                            </div>
                            <div>
                                <p>Active</p>
                                <select v-model="query.active">
                                    <option value="any">Any</option>
                                    <option :value="true">Active</option>
                                    <option :value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="input-container">
                            <div>
                                <p>First Name</p>
                                <input type="text" v-model="query.firstName">
                            </div>
                            <div>
                                <p>Last Name</p>
                                <input type="text" v-model="query.lastName">
                            </div>
                        </div>
                        <div>

                        </div>
                    </div>
                </div>
                <div v-if="showKhateebs" class="khateebs-container">
                    <div 
                        v-for="(khateeb, khateebNo) in filteredKhateebs"
                        :key="khateebNo"
                        class="khateeb-container"
                    >
                        
                        <collapsable-box
                            :headline="`${khateeb.firstName} ${khateeb.lastName}`"
                            :tagDetails="khateebTag(khateeb)"
                        >
                            <div>
                                <button class="red" @click="deleteKhateeb(khateeb._id)">
                                    <p v-if="khateeb.confirmed">Delete {{ khateeb.firstName }} from System</p>
                                    <p v-if="!khateeb.confirmed">Reject {{ khateeb.firstName }}'s Application</p>
                                </button>
                                <button 
                                    v-if="!khateeb.confirmed" 
                                    @click="editKhateeb({ _id: khateeb._id, confirmed: true })"
                                >
                                    <p>Confirm {{ khateeb.firstName }}'s Application</p>
                                </button>
                                <user-form-template 
                                    v-if="khateeb.confirmed"
                                    :userType="`khateeb`"
                                    :editableKhateebFormat="true"
                                    :formProps="{
                                        basedOn: khateeb,
                                        buttonText: `Edit ${khateeb.firstName}'s Info`,
                                        backgroundColor: 'none'
                                    }"
                                    @submitted="editKhateeb($event)"
                                />
                            </div>
                        </collapsable-box>

                    </div>
                </div>
            </div>

            <msg-with-pic 
                v-else
                :msg="`No khateebs have signed up to your institution yet`"
                :gif="`twirlingPlane`"
            />

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import collapsableBox from '@/components/general/collapsableBox.vue'
import msgWithPic from '@/components/general/msgWithPic.vue'
import userFormTemplate from '@/components/forms/templates/user.vue'

import datetime from '@/libraries/dateTime/main.js'
import requestHelpers from '@/libraries/requests/helperLib/main.js'

export default {
    name: 'khateebs',
    components: {
        loading,
        collapsableBox,
        msgWithPic,
        userFormTemplate
    },
    data() {
        return {
            khateebs: [],
            locations: [],
            timings: [],
            showKhateebs: true,
            showSearchTools: false,
            query: {}
        }
    },
    methods: {
        async getAllKhateebs() {
            this.khateebs = await this.$API.khateebs.getKhateebs()
        },
        async getActiveLocationsAndTimings() {
            const [locations, timings] = await this.$API.chainedRequests.getActiveLocationsAndTimings()
            this.locations = locations
            this.timings = timings
        },
        compileAvailableTimes(availableTimingsIdArray) {
            console.log(availableTimingsIdArray)
            const locations = {}
            availableTimingsIdArray.forEach(availableTiming => {
                const { timingInfo, locationInfo } = this.findLocationAndTimingInfo(availableTiming)
                if (!locations[locationInfo._id])
                    locations[locationInfo._id] = [locationInfo.name]
                locations[locationInfo._id].push(`⌚ ${this.createReadableTime(timingInfo)}`)
            })
            return this.compileAllLocationMsgsIntoOne(locations)
        },
        compileAllLocationMsgsIntoOne(locationMsgObject) {
            let msg = ''
            for (const [location, msgs] of Object.entries(locationMsgObject)) {
                msgs.push('\n')
                msg += msgs.reduce((total, msg) => `${total}\n${msg}`)
            }
            return msg
        },
        createReadableTime(timingInfo) {
            const time = new Date()
            time.setHour(timingInfo.hour, timingInfo.minute, 0, 0)
            return time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        },
        findLocationAndTimingInfo(timingId) {
            const timingInfo = this.timings.find(timing => timing._id === timingId)
            const locationInfo = this.locations.find(location => location._id === timingInfo.locationID)
            return { timingInfo, locationInfo }
        },
        createReadableAvailableTimings(khateeb) {
            const copy = { ...khateeb }
            const isAvailableForAllTimings = copy.availableTimings.length < 1
            copy.availableTimings = isAvailableForAllTimings ? "👍 Available for all" : this.compileAvailableTimes(copy.availableTimings)
            return copy
        },
        createReadbleUnAvailableDates(khateeb) {
            const copy = { ...khateeb }
            const unavailableDatesThisMonth = copy.unavailableDates.filter(date => datetime.sameMonthSameYear(new Date(), new Date(date)))
            const isAvailableForAllDates = unavailableDatesThisMonth.length < 1
            copy.unavailableDates = isAvailableForAllDates ? "👍 Available for all" : this.compileUnavailableDates(unavailableDatesThisMonth)
            return copy
        },
        compileUnavailableDates(unavailableDatesArray) {
            return unavailableDatesArray
                .map(date => `📅 ${new Date(date).toLocaleString('en-US', { month: 'short' })} ${new Date(date).getDate()}`)
                .reduce((total, date) => `${total}\n${date}`)
        },
        resetSearch() {
            this.query.active = 'any'; this.query.confirmed = 'any';
            this.query.firstName = ''; this.query.lastName = '';
        },
        khateebTag(khateeb) {
            if (!khateeb.confirmed)
                return [{ words: 'Registration Pending', color: 'important', symbol: '⏳' }]
            else if (!khateeb.active)
                return [{ words: 'Inactive', color: 'urgent', symbol: '📪' }]
            else
                return [{ words: `Last Active: ${this.utils.dynamicDisplayDate(khateeb.lastLogin)}`, color: 'goodNews', symbol: '☀️' }]
        },
        async editKhateeb($event) {
            const res = await this.$API.khateebs.updateExistingKhateeb($event)
            this.khateebs.splice(this.findKhateebIndex(res._id), 1, res)
            this.rerenderView()
        },
        findKhateebIndex(id) {
            return this.khateebs.findIndex(khateeb => khateeb._id === id)
        },
        rerenderView() {
            this.showKhateebs = false
            this.$nextTick(() => { this.showKhateebs = true })
        },
        async deleteKhateeb(id) {
            const confirm = await this.utils.confirm(`Are you sure you want to permenantly delete this khateeb?`)
            if (!confirm)
                return
            const res = await this.$API.khateebs.deleteKhateeb(id)
            if (requestHelpers.dataWasDeleted(res))
                this.khateebs.splice(this.findKhateebIndex(id), 1)
        },
        khateebFilter(noFilterValue="any", valueKey="active", queryParams={}) {
            if (queryParams[valueKey] !== noFilterValue)
                return (khateeb) => khateeb[valueKey] === queryParams[valueKey]
            else
                return (khateeb) => khateeb
        },
        khateebFilterWithQuery(noFilterValue="any", valueKey="active") {
            return this.khateebFilter(noFilterValue, valueKey, this.query)
        }
    },
    computed: {
        filteredKhateebs() {
            return this.khateebsWithReadableMeta
                .filter(this.khateebFilterWithQuery('', "firstName"))
                .filter(this.khateebFilterWithQuery('', "lastName"))
                .filter(this.khateebFilterWithQuery('any', 'active'))
                .filter(this.khateebFilterWithQuery('any', 'confirmed'))
        },
        khateebsWithReadableMeta() {
            return this.khateebs
                .map(this.createReadableAvailableTimings)
                .map(this.createReadbleUnAvailableDates)
        }
    },
    watch: {
        showSearchTools(newVal) {
            if (!newVal)
                this.resetSearch()
        }
    },
    created() {
        this.resetSearch()
        this.getAllKhateebs()
        this.getActiveLocationsAndTimings()
    }
}
</script>

<style lang="scss" scoped>
.khateebs-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 90%;
    max-height: 300px;
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
    max-height: 1500px;
    height: auto;
    align-items: center;
    justify-content: center;
}

.khateeb-container {
    width: 45%;
}


p {
    margin: 0;
    margin-left: 5px;
    font-size: 16px;
}

button {
    width: 80%;
    height: 45px;
    border-radius: 0;
}

.input-container {
    width: 80%;
    display: flex;
    flex-direction: row;
    margin-top: 0;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

p {
    margin: 0;
    text-align: center;
    font-size: 18px;
}

select {
    width: 90%;
    max-width: 300px;
    margin: 5px;
    border: none;
    outline: none;
    height: 4vh;
    max-height: 40px;
    font-size: 15px;
    color: getColor("offWhite");
    background-color: themeRGBA("grey", 1);
    &:focus {
        background-color: themeRGBA("grey", 0.5);
    }
    margin-bottom: 20px;
}

input {
    border: none;
    outline: none;
    width: 80%;
    height: 4vh;
    max-height: 40px;
    font-size: 15px;
    color: getColor("offWhite");
    background-color: themeRGBA("grey", 1);
    &:focus {
        background-color: themeRGBA("grey", 0.5);
    }
    margin-bottom: 20px;
}

button {
    width: 80%;
    max-width: 300px;
    max-height: 50px;
    font-size: 18px;
    margin-bottom: 20px;
}

.search-tools {
    padding-bottom: 20px;
}

.search-results {
    font-size: 29px;
    font-weight: bold;
}

.reset-search {
    width: 60%;
    max-width: 240px;
    margin-top: 15px;
}

@media screen and (max-width: $phoneWidth) {
      .khateebs-container {
            flex-direction: column;
        }
        .khateeb-container {
            width: 100%;
        }
        p {
            margin: 0;
            margin-left: 2%;
            font-size: 2.4vh;
        }
        button {
            height: 7vh;
        }
        select {
            font-size: 1.8vh;
            width: 90%;
            margin-bottom: 3vh;
        }
        input {
            height: 4vh;
            width: 90%;
            font-size: 1.8vh;
            margin-bottom: 3vh;
        }
        .input-container {
            margin-top: 1.5vh;
            margin-bottom: 1.5vh;
            flex-direction: column;
            width: 80%;
        }
        
        button {
            font-size: 2.3vh;
            margin-bottom: 3vh;
        }
        .search-results {
            font-size: 5vh;
        }

}
</style>