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

                <div class="institution-signup-link-container ">
                    <div class="copy-link-container">
                        <div class="copy-link-header " @click="toggleKhateebLinkContainer()">
                            <div>
                                <dropdown-arrow 
                                    :fontSize="13"
                                    :faceDown="showSignupLink"
                                    class="dropdown-arrow"
                                />
                            </div>
                            <div>
                                {{ $store.state.user.institution.abbreviatedName }} Khateeb Signup Link 
                            </div>
                        </div>
                        <collapse-transition>
                            <div v-show="showSignupLink">
                                <button 
                                    :class="`grey copy-link-button ${copiedLink ? 'copied' : ''}`"
                                    @click="copyLink()"
                                > 
                                    📋 {{ copiedLink ? "Copied" : 'Copy' }}
                                </button>
                                <div>
                                    <input type="text" class="copy-link-text" v-model="signupLink">
                                </div>
                            </div>
                        </collapse-transition>
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
                                    :formProps="{
                                        basedOn: khateeb,
                                        buttonText: `Edit ${khateeb.firstName}'s Info`,
                                        backgroundColor: 'none',
                                        readOnly: true
                                    }"
                                    @submitted="editKhateeb($event)"
                                />
                            </div>
                        </collapsable-box>

                    </div>
                </div>
            </div>

            <general-message
                v-else
                :message="`No khateebs have signed up to your institution yet`"
                :fontAwesomeIcon="['far', 'paper-plane']"
            />

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import generalMessage from '@/components/misc/generalMessage.vue'
import collapsableBox from '@/components/general/collapsableBox.vue'
import userFormTemplate from '@/components/forms/templates/user.vue'
import dropdownArrow from '@/components/misc/dropdownArrow.vue'

import datetime from '@/libraries/dateTime/main.js'
import requestHelpers from '@/libraries/requests/helperLib/main.js'

import { CollapseTransition } from "@ivanv/vue-collapse-transition"

export default {
    name: 'khateebs',
    components: {
        loading,
        collapsableBox,
        userFormTemplate,
        CollapseTransition,
        generalMessage,
        dropdownArrow
    },
    data() {
        return {
            khateebs: [],
            locations: [],
            timings: [],
            showKhateebs: true,
            showSearchTools: false,
            query: {},
            signupLink: `https://khateebs.com/create/khateebs?institutionID=${this.$store.state.user.institution._id}`,
            copiedLink: false,
            showSignupLink: false
        }
    },
    methods: {
        toggleKhateebLinkContainer() {
            this.showSignupLink = !this.showSignupLink
        },
        async getAllKhateebs() {
            this.khateebs = await this._api.khateebs.getKhateebs()
        },
        copyLink() {
            this.copiedLink = true
            this.$copyText(this.signupLink)
            const fiveSecondsInMilliseconds = 5_000
            window.setTimeout(() => this.copiedLink = false, fiveSecondsInMilliseconds)
        },
        async getActiveLocationsAndTimings() {
            const [locations, timings] = await this._api.chainedRequests.getActiveLocationsAndTimings()
            this.timings = timings
            this.locations = locations
        },
        compileAvailableTimes(availableTimingsIdArray) {
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
            // eslint-disable-next-line no-unused-vars
            for (const [_, msgs] of Object.entries(locationMsgObject)) {
                msgs.push('\n')
                msg += msgs.reduce((total, msg) => `${total}\n${msg}`)
            }
            return msg
        },
        createReadableTime(timingInfo) {
            const time = new Date()
            time.setHours(timingInfo.hour, timingInfo.minute, 0, 0)
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
            const unavailableDatesThisMonth = copy.unavailableDates
                .map(d => d.date)
                .filter(date => datetime.sameMonthSameYear(new Date(), new Date(date)))
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
            else
                return [{ words: `Last Active: ${this._utils.dynamicDisplayDate(khateeb.lastLogin)}`, color: 'goodNews', symbol: '☀️' }]
        },
        async editKhateeb($event) {
            const res = await this._api.khateebs.updateExistingKhateeb($event)
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
            const confirm = await this._utils.confirm(`Are you sure you want to permenantly delete this khateeb?`)
            if (!confirm)
                return
            const res = await this._api.khateebs.deleteKhateeb(id)
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
        },
        timingsLocations() {
            return this.locations
                .map(l => this.timings.filter(t => t.locationID === l._id))
        }
    },
    watch: {
        showSearchTools(newVal) {
            if (!newVal)
                this.resetSearch()
        }
    },
    async created() {
        this.resetSearch()
        await this.getActiveLocationsAndTimings()
        this.getAllKhateebs()
    },
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
    @include flexboxDefault();
    width: 80%;
    max-width: 800px;
    @include centerMargin();
}

p {
    margin: 0;
    text-align: center;
    font-size: 18px;
}

select {
    width: 150px;
    margin-left: 20px;
    margin-right: 20px;
    margin: 5px;
    border: none;
    outline: none;
    height: 40px;
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
    width: 200px;
    height: 40px;
    margin-left: 10px;
    margin-right: 10px;
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
    height: 50px;
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

.institution-signup-link-container {
    width: 83%;
    display: flex;
    justify-content: flex-end;
    max-width: 1050px;
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 15px;
    margin-top: 15px;
    @include centerMargin();
}

.copy-link-container {
    width: 190px;
    background: getColor("silver");
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    @include normalBorderRounding();
    @include floatingBoxShadow();
}

.copy-link-text {
    height: 40px;
    width: 150px;
    font-size: 15px;
    @include floatingBoxShadow();

    &:focus {
        color: getColor("green");
        background: getColor("grey");
        font-weight: bold;
    }
}

.copy-link-header {
    font-size: 16px;
    font-weight: bold;
    @include flexboxDefault();
}

.copy-link-button {
    font-size: 13px;
    color: black;
    width: 90px;
    height: 40px;
    border-radius: 7px;
    @include floatingBoxShadow();
    margin-bottom: 10px;
    color: getColor("blue");
    font-weight: bold;

    &.copied {
        color: getColor("green");
    }
}

.dropdown-arrow {
    margin-right: 10px;
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
            height: 40px;
        }

        select {
            font-size: 13px;
            width: 120px;
            height: 30px;
        }
        
        input {
            height: 30px;
            width: 200px;
            font-size: 30px;
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

        .copy-link-header {
            font-size: 14px;
        }

        .dropdown-arrow {
            height: 12px;
        }

        .copy-link-container {
            width: 170px;
        }

}
</style>