<template>
    <div>
        <loading class="content-container">

            <button class="purple back-to-home-button" @click="_utils.toHomePage()">
                Back to Home
            </button>

            <div v-if="allKhutbahs.length > 0">

                <div v-if="defaultKhateebsWithUser.length > 0">
                    
                    <button class="my-regularly-scheduled-khutbahs-button" @click="openDefaultKhateebsPopup()">
                        Your Regularly Scheduled Khutbahs
                    </button>

                    <general-popup-container 
                        v-show="showDefaultKhateebsPopup"
                        :closeOnClickAway="false"
                        @close="closeDefaultKhateebsPopup()"
                    >
                        <div
                            v-for="(khutbah, khutbahIndex) in defaultKhateebsWithUser"
                            :key="khutbahIndex"
                            class="my-regularly-scheduled-khutbahs-text"
                        >
                            
                            <div>
                                Location: {{ locations.find(l => l._id === khutbah.locationId).name }}
                            </div>

                            <div>
                                Time: {{ timingDisplay(khutbah.timingId) }}
                            </div>

                            <div>
                                Role: {{ khutbah.isBackup ? "Backup" : 'Main Khateeb' }}
                            </div>

                            <div>
                                Every <span class="red">{{ khutbahWeekText(khutbah.week) }}</span> week of each month{{ khutbah.week === 4 ? ' (if applicable)' : '' }}
                            </div>

                        </div>
                    </general-popup-container>
                
                </div>
                
                <my-khutbahs-display 
                    :header="`Your Khutbahs this Week`"
                    :khutbahs="upcomingWeekKhutbahs" 
                    :containerColor="`green`"
                    :timings="timings"
                    :locations="locations"  
                />

                <my-khutbahs-display
                    :header="`Future Khutbahs`" 
                    :khutbahs="khutbahsInTheFuture" 
                    :containerColor="`blue`"
                    :timings="timings"
                    :locations="locations" 
                />

                <my-khutbahs-display
                    :header="`Khutbahs You've Given`" 
                    :khutbahs="khutbahsInThePast" 
                    :containerColor="`orange`"
                    :timings="timings"
                    :locations="locations"  
                />

            </div>

            <general-message
                v-else
                :message="`You haven't been scheduled for a khutbah yet`"
                :fontAwesomeIcon="['fas', 'calendar-times']"
            />

        </loading>
    </div>
</template>

<script>
import generalMessage from '@/components/misc/generalMessage.vue'
import myKhutbahsDisplay from '@/components/misc/myKhutbahsDisplay.vue'
import loading from '@/components/general/loadingScreen.vue'
import generalPopupContainer from '@/components/notifications/generalPopup.vue'

import datetime from '@/libraries/dateTime/main.js'
import jummahHelpers from '@/libraries/jummahs/main.js'
import timingHelpers from '@/libraries/timings/main.js'

export default {
    name: "myKhutbahs",
    components: {
        generalMessage,
        myKhutbahsDisplay,
        loading,
        generalPopupContainer
    },
    data() {
        return {
            khutbahs: [],
            upcomingFriday: datetime.findUpcomingFriday(),
            timings: [],
            locations: [],
            allKhutbahsUntilTheEndOfNextMonthNotFromUser: [],
            showDefaultKhateebsPopup: false,
            userInfo: {
                availableTimings: [],
                unavailableDates: []
            }
        }
    },
    methods: {
        openDefaultKhateebsPopup() {
            this.showDefaultKhateebsPopup = true
        },
        closeDefaultKhateebsPopup() {
            this.showDefaultKhateebsPopup = false
        },
        timingDisplay(timingId="1234") {
            const timing = this.timings.find(t => t._id === timingId)
            return timingHelpers.timingDisplay(timing)
        },
        async getScheduleRestrictions() {
            const res = await this._api.user.getScheduleRestrictions()
            this.userInfo = res
        },
        async requestJummahsForCurrentUser() {
            this.khutbahs = await this.requestJummahs({ khateebID: this.currentUserId })
        }, 
        async requestJummahs(query={}) {
            const data = await this._api.jummahs.getJummahs(query)
            return data 
        },
        async requestJummahsUpUntilTheEndOfNextMonth() {
            this.allKhutbahsUntilTheEndOfNextMonthNotFromUser = await this.requestJummahs({ 
                date: this.createQueryRangeFromThisFridayToNextMonth(), 
                khateebID: { $ne: this.currentUserId } 
            })
        },
        async getAllLocationsAndTimings() {
            const [locations, timings] = await this._api.chainedRequests.getAllLocationsAndTimings()
            this.timings = timings
            this.locations = locations
        },
        sameDateAsUpcomingFriday(candidate=new Date()) {
            return datetime.sameDateMonthAndYear(new Date(candidate), this.upcomingFriday)
        },
        createQueryRangeFromThisFridayToNextMonth() {
            const startDate = jummahHelpers.fridayToFridayDBFormat(this.upcomingFriday)
            const nextMonth = new Date(this.upcomingFriday)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            const { $lt } = jummahHelpers.createMonthlyRequestRange(nextMonth)
            return {
                $gte: startDate,
                $lt
            }
        },
        khutbahWeekText(index=0) {
            switch(index + 1) {
                case 1:
                    return '1st'
                case 2:
                    return '2nd'
                case 3:
                    return '3rd'
                case 4:
                    return '4th'
                case 5:
                    return '5th'
                default:
                    return '1st'
            }
        }
    },
    computed: {
        allUserJummahsPlusUpcomingJummahUntilTheEndOfNextMonth() {
            return [...this.khutbahs, ...this.allKhutbahsUntilTheEndOfNextMonthNotFromUser]
        },
        upcomingWeekKhutbahs() {
            return this.allKhutbahs.filter(k => this.sameDateAsUpcomingFriday(k.date))
        },
        khutbahsInThePast() {
            return this.allKhutbahs.filter(k => {
                return !this.sameDateAsUpcomingFriday(k.date) && new Date(k.date).getTime() < this.upcomingFriday.getTime()
            })
        },
        khutbahsInTheFuture() {
            return this.allKhutbahs
                .filter(k => {
                    return !this.sameDateAsUpcomingFriday(k.date) && new Date(k.date).getTime() > this.upcomingFriday.getTime()
                })
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) 
        },
        activeTimings() {
            return this.timings.filter(t => t.active)
        },
        defaultKhateebsWithUser() {
            return this.activeTimings
                .map(t => ({ default: t.defaultKhateebs.map((d, index) => ({ index, data: { ...d, timingId: t._id, locationId: t.locationID } })) }))
                .reduce((total, timingInfo) => [...total, ...timingInfo.default], [])
                .filter(t => t.data.mainKhateeb === this.currentUserId || t.data.backup === this.currentUserId)
                .map(t => ({ ...t.data, week: t.index, isBackup: t.data.backup === this.currentUserId }))
        },
        upcomingKhutbahsFromDefaultKhateebs() {
            return Object.keys(this.allFridaysThisMonthAndNext)
                .map(m => {
                    return this.defaultKhateebsWithUser
                        .map(t => {
                            return {
                                updatedAt: t.updatedAt,
                                locationID: t.locationId,
                                timingID: t.timingId,
                                date: new Date(this.allFridaysThisMonthAndNext[m][t.week]),
                                isBackup: t.isBackup,
                                isGivingKhutbah: !t.isBackup,
                                fromDefaults: true,
                                notified: false
                            }
                        })
                        // filter out unavailable dates
                        .filter(t => {
                            return !this.userInfo.unavailableDates
                                .find(e => datetime.sameDateMonthAndYear(e.date, t.date))
                        })
                        // filter out khutbahs already taken by other khateebs
                        .filter(t => {
                            return !this.allUserJummahsPlusUpcomingJummahUntilTheEndOfNextMonth
                                .find(k => {
                                    return k.locationID === t.locationID && 
                                        k.timingID === t.timingID && 
                                        datetime.sameDateMonthAndYear(new Date(k.date), new Date(t.date))
                                })
                        })
                })
                .reduce((total, m) => [...total, ...m], [])
        },
        currentUserId() {
            return this.$store.state.user.userInfo._id
        },
        allFridaysThisMonthAndNext() {
            const thisMonth = new Date(this.upcomingFriday)
            const nextMonth = new Date(thisMonth)
            nextMonth.setMonth(nextMonth.getMonth() + 1)
            return {
                thisMonth: datetime.allUpcomingFridays(thisMonth, true),
                nextMonth: datetime.allUpcomingFridays(nextMonth, true)
            }
        },
        allKhutbahs() {
            return [...this.khutbahs, ...this.upcomingKhutbahsFromDefaultKhateebs]
        }
    },
    created() {
        this.getScheduleRestrictions()
        this.requestJummahsForCurrentUser()
        this.requestJummahsUpUntilTheEndOfNextMonth()
        this.getAllLocationsAndTimings()
    }
}
</script>

<style lang="scss" scoped>
.back-to-home-button {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    max-height: 50px;
    max-width: 200px;
    margin-bottom: 30px;
}

.content-container {
    margin-top: 20px;
    margin-bottom: 20px;
}

.my-regularly-scheduled-khutbahs-text {
    color: get-color("off-white");
    text-align: left;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    margin-bottom: 20px;
}

.my-regularly-scheduled-khutbahs-button {
    margin-top: 30px;
    margin-bottom: 30px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>