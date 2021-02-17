<template>
    <div>
        <loading>
            <msg-with-pic 
                v-show="khateebCount < 1"
                :msg="`No khateebs have signed up to your institution yet`"
                :gif="`twirlingPlane`"
            />
            <div v-if="khateebCount > 0">
                <div class="search-tools">
                    <div>
                        <button class="yellow" @click="showSearchTools = !showSearchTools">
                            🔍 {{ showSearchTools ? 'Close' : 'Open' }} Search Tools
                        </button>
                    </div>
                    <div v-show="showSearchTools">
                        <div>
                            <p class="search-results"><u>{{ filteredKhateebsCount }}</u> Search Results</p>
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
                <div 
                    v-for="(twoKhateebs, index) in filteredKhateebsArraysOfTwo"
                    :key="index"
                    class="two-khateeb-container"
                >
                    <div 
                        v-for="(khateeb, khateebNo) in twoKhateebs"
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
                                <button v-if="!khateeb.confirmed" @click="confirmKhateeb(khateeb._id)">
                                    <p>Confirm {{ khateeb.firstName }}'s Application</p>
                                </button>
                                <form-main
                                    v-if="khateeb.confirmed"
                                    :basedOn="khateeb" 
                                    :structure="structure"
                                    :buttonText="`Edit ${khateeb.firstName}'s Info`"
                                    :backgroundColor="`none`"
                                    @submitted="editKhateeb($event)"
                                />
                            </div>
                        </collapsable-box>
                    </div>
                </div>
            </div>  
        </loading>
    </div>
</template>

<script>
import loading from '@/components/userInterface/components/loadingScreen.vue'
import collapsableBox from '@/components/userInterface/components/collapsableBox.vue'
import formMain from '@/components/forms/main.vue'

export default {
    name: 'khateebs',
    components: {
        loading,
        collapsableBox,
        formMain
    },
    data() {
        return {
            khateebs: [],
            khateebsWithReadableAvailableTimings: [],
            khateebsInArraysOfTwos: [],
            locations: [],
            timings: [],
            query: {
                confirmed: 'any',
                active: 'any',
                firstName: '',
                lastName: '',
            },
            showSearchTools: false,
            structure: {
                dropouts: {
                    type: 'readOnly',
                    required: true
                },
                handle: {
                    type: 'readOnly',
                    required: true,
                },
                confirmed: {
                    type: 'readOnly',
                    required: true
                },
                title: {
                    type: "readOnly",
                    required: true,
                },
                firstName: {
                    type: "readOnly",
                    required: true
                },
                lastName: {
                    type: "readOnly",
                    required: true
                },
                phoneNumber: {
                    type: 'readOnly',
                    format: 'phoneNumber',
                    required: true
                },
                availableTimings: {
                    type: 'readOnly',
                    required: true
                },
                unavailableDates: {
                    type: 'readOnly',
                    required: true,
                    alias: 'Unavailable Days this Month'
                },
                active: {
                    type: 'checkbox',
                    required: true
                }
            }
        }
    },
    methods: {
        // many=true$confirmed=false
        async getAllKhateebs() {
            try {
                const data = await this.$API.khateebs.get('many=true')
                //const data = await this.$API.institutionAdmin.getKhateebs()
                this.khateebs = data
                this.khateebsWithReadableAvailableTimings = await this.createReadableTimingsAndUnavailableDates(data)
                this.khateebsInArraysOfTwos = this.toArraysOfTwo(data)
            } catch(err) {
                console.log(err)
            }
        },
        async createReadableTimingsAndUnavailableDates(data) {
            data = this._.deepCopy(data)
            const khateebs = await this.substituteTimingIDsWithTimingInformation(data)
            return this.createReadableUnavailableDates(khateebs)
        },
        createReadableUnavailableDates(khateebs) {
            let msg = ""
            khateebs.forEach(khateeb => {
                if (khateeb.unavailableDates.length < 1)
                    msg += "👍 Available for all"
                else {
                    const month = new Date().getMonth()
                    const year = new Date().getFullYear()
                    const unavailableThisMonth = khateeb.unavailableDates.filter(date => {
                        const dateObject = new Date(date.date)
                        return dateObject.getMonth() === month && dateObject.getFullYear() === year
                    })
                    unavailableThisMonth.forEach(unavailableDate => {
                        const date = new Date(unavailableDate.date)
                        msg += `📅 ${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}\n`
                    })
                }
                khateeb.unavailableDates = msg
            })
            return khateebs
        },
        async substituteTimingIDsWithTimingInformation(khateebs) {
            try {
                this.locations = await this.$API.institutionAdmin.getLocations('all')
                this.timings = await this.$API.institutionAdmin.getTimings("all", "all")
                khateebs.forEach(khateeb => {
                    if (khateeb.availableTimings.length < 1)
                        return khateeb.availableTimings = "👍 Available for\n   all timings"
                    else
                        khateeb.availableTimings = this.createReadableTiming(khateeb)
                })
                return khateebs
            } catch(err) {
                console.log()
            }
        },
        createReadableTiming(khateeb) {
            let msg = ''
            const locations = {}
            khateeb.availableTimings.forEach(availableTiming => {
                const timingMeta = this.timings.find(timing => timing._id === availableTiming)
                const locationMeta = this.locations.find(location => location._id === timingMeta.locationID)
                if (!locations[locationMeta._id])
                    locations[locationMeta._id] = [locationMeta.name]
                let time = new Date()
                time.setHours(timingMeta.hour, timingMeta.minute, 0, 0)
                const readableTime = time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                locations[locationMeta._id].push(`⌚ ${readableTime}`)
            })
            for (let [location, msgs] of Object.entries(locations) ) {
                msgs.push(`\n`)
                msg += msgs.reduce((total, msg) => `${total}\n${msg}`)
            }
            return msg
        },
        resetSearch() {
            this.query.active = 'any'; this.query.confirmed = 'any';
            this.query.firstName = ''; this.query.lastName = '';
        },
        khateebTag(khateeb) {
            if (!khateeb.confirmed)
                return [{ words: 'Registration Pending', color: 'important', symbol: '⏳' }]
            const tags = []
            if (!khateeb.active)
                tags.push({ words: 'Inactive', color: 'urgent', symbol: '📪' })
            const tag = { words: `Last Active ${this._.dynamicDisplayDate(khateeb.lastLogin)}`, color: 'goodNews', symbol: '☀️' }
            tags.push(tag)
            return tags
        },
        toArraysOfTwo(array) {
            const arrayOfTwos = []
            let chopped = []
            for (let i = 0; i < array.length; i++) {
                chopped.push(array[i])
                const even = i % 2
                if (even) {
                    arrayOfTwos.push(chopped)
                    chopped = []
                }
            }
            arrayOfTwos.push(chopped)
            return arrayOfTwos
        },
        async confirmKhateeb(id) {
            try {
                const res = await this.$API.institutionAdmin.confirmKhateeb({ _id: id })
                this.$store.dispatch('adminSavedChangesScreen', true)
            } catch(err) {
                console.log(err)
            }
        },
        async editKhateeb($event) {
            try {
                const preppedData = {
                    _id: $event._id,
                    phoneNumber: $event.phoneNumber,
                    active: $event.active,
                    availableTimings: []
                }
                const res = await this.$API.institutionAdmin.updateExistingKhateeb(preppedData)
                this.$store.dispatch('adminSavedChangesScreen', true)
            } catch(err) {
                console.log(err)
            }
        },
        async deleteKhateeb(id) {
            try {
                const confirm = await this._.confirm(`Are you sure you want to permenantly delete this khateeb?`)
                if (!confirm)
                    return
                const res = await this.$API.khateebs.delete({ queryFilters: `_id=${id}` })
                console.log(res)
                //const deleted = await this.$API.institutionAdmin.deleteKhateeb({ _id: id })
                //this.$store.dispatch('adminSavedChangesScreen', true)
            } catch(err) {
                console.log(err)
            }
        }
    },
    computed: {
        khateebCount() {
            return this.khateebs.length
        },
        filteredKhateebs() {
            if (!this.searchQuery)
                return this.khateebsWithReadableAvailableTimings
            let filtered
            for (let [queryField, queryVal] of Object.entries(this.searchQuery)) {
                let toBeSearched = filtered ? filtered : this.khateebsWithReadableAvailableTimings
                if (queryField === 'firstName' || queryField === 'lastName')
                    filtered = toBeSearched.filter(khateeb => khateeb[queryField].toLowerCase().includes(queryVal.toLowerCase()))
                else
                    filtered = toBeSearched.filter(khateeb => khateeb[queryField] === queryVal)
            }
            return filtered
        },
        filteredKhateebsArraysOfTwo() {
            return this.toArraysOfTwo(this.filteredKhateebs)
        },
        filteredKhateebsCount() {
            return this.filteredKhateebs.length
        },
        searchQuery() {
            let query
            for (let [key, value] of Object.entries(this.query)) {
                if (value !== '' && value !== 'any') {
                    if (!query)
                        query = {}
                    query[key] = value
                }
            }
            return query
        }
    },
    watch: {
        showSearchTools(newVal) {
            if (!newVal)
                this.resetSearch()
        }
    },
    created() {
        this.getAllKhateebs()
    }
}
</script>

<style lang="scss" scoped>
.two-khateeb-container {
    display: flex;
    flex-direction: row;
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
      .two-khateeb-container {
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