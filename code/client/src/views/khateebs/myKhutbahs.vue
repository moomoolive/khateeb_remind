<template>
    <div>
        <loading class="content-container">

            <button class="purple back-to-home-button" @click="utils.toHomePage()">
                Back to Home
            </button>

            <div v-if="khutbahs.length > 0">
                
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

            <msg-with-pic
                v-else 
                :msg="`You haven't been scheduled for a khutbah yet`"
                :gif="`flyingPlanesAllOver`"
            /> 

        </loading>
    </div>
</template>

<script>
import msgWithPic from '@/components/general/msgWithPic.vue'
import myKhutbahsDisplay from '@/components/misc/myKhutbahsDisplay.vue'
import loading from '@/components/general/loadingScreen.vue'

import datetime from '@/libraries/dateTime/main.js'

export default {
    name: "myKhutbahs",
    components: {
        msgWithPic,
        myKhutbahsDisplay,
        loading
    },
    data() {
        return {
            khutbahs: [],
            upcomingFriday: datetime.findUpcomingFriday(),
            timings: [],
            locations: []
        }
    },
    methods: {
        async requestJummahs(query={}) {
            this.khutbahs = await this.$API.jummahs.getJummahs(query)
        },
        async getAllLocationsAndTimings() {
            const [locations, timings] = await this.$API.chainedRequests.getAllLocationsAndTimings()
            this.timings = timings
            this.locations = locations
        },
        sameDateAsUpcomingFriday(candidate=new Date()) {
            return datetime.sameDateMonthAndYear(new Date(candidate), this.upcomingFriday)
        }
    },
    computed: {
        upcomingWeekKhutbahs() {
            return this.khutbahs.filter(k => this.sameDateAsUpcomingFriday(k.date))
        },
        khutbahsInThePast() {
            return this.khutbahs.filter(k => {
                return !this.sameDateAsUpcomingFriday(k.date) && new Date(k.date).getTime() < this.upcomingFriday.getTime()
            })
        },
        khutbahsInTheFuture() {
            return this.khutbahs
                .filter(k => {
                    return !this.sameDateAsUpcomingFriday(k.date) && new Date(k.date).getTime() > this.upcomingFriday.getTime()
                })
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) 
        }
    },
    created() {
        this.requestJummahs({ khateebID: this.$store.getters['user/allInfo']._id })
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
</style>