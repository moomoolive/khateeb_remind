<template>
    <div v-if="showProfileSettings">
        <collapsable-box
            class="user-setting"
            :headline="`Change Username`"
        >
            <form-main 
                :structure="{
                    username: {
                        required: true,
                        validators: 'username'
                    }
                }"
                :backgroundColor="`none`"
                :basedOn="{ username: $store.getters['user/allInfo'].username }"
                :buttonText="`Change Username`"
                @submitted="updateInfo($event)"
            />
        </collapsable-box>
        <collapsable-box
            class="user-setting"
            :headline="`Change Password`"
        >
            <form-main
                :structure="{
                    password: {
                        required: true,
                        minLength: 6
                    }
                }"
                :bindedExts="['confirms']"
                :backgroundColor="`none`"
                :buttonText="`Change Password`"
                @submitted="updateInfo($event)"
            />
        </collapsable-box>
        <collapsable-box
            class="user-setting"
            :headline="`Profile Details`"
        >
            <user-form-template 
                :userType="$store.getters['user/type']"
                :formProps="{
                    backgroundColor: 'none',
                    buttonText: 'Update Profile'
                }"
                @submitted="updateInfo($event)"
            />
        </collapsable-box>
        <collapsable-box
            v-if="_.validAuthentication({ level: 1 })"
            class="user-setting"
            :headline="`Available Timings`"
            :tagDetails="availableTimingsTag"
        >
            <selection-picker
                v-if="availableTimingsSelection.length > 0"
                :options="availableTimingsSelection"
                :currentlySelected="availableTimings"
                @changed="updateInfo({ availableTimings: $event }, false)"
            />
        </collapsable-box>
        <collapsable-box
            v-if="_.validAuthentication({ level: 1 })"
            class="user-setting"
            :headline="`Unavailable Dates`"
        >
            <calendar
                :originalVal="$store.getters['user/allInfo'].unavailableDates" 
                @changed="updateInfo($event, false)"
            />
        </collapsable-box>
        <collapsable-box
            v-if="_.validAuthentication({ max: 2 })"
            class="user-setting"
            :headline="`Danger Zone`"
            :buttonColor="`red`"
            :bodyColor="`silver`"
        >
            <button class="yellow delete-account" @click="deleteAccount()">Delete My Account</button>
        </collapsable-box>
    </div>
</template>

<script>
import collapsableBox from '@/components/general/collapsableBox.vue'
import formMain from '@/components/forms/main.vue'
import selectionPicker from '@/components/general/selectionPicker.vue'
import calendar from './subviews/calendar.vue'
import userFormTemplate from '@/components/forms/templates/user.vue'

export default {
    name: 'userHome',
    components: {
        collapsableBox,
        formMain,
        selectionPicker,
        calendar,
        userFormTemplate
    },
    data() {
        return {
            showProfileSettings: true,
            locations: [],
            timings: []
        }
    },
    methods: {
        async updateInfo($event, rerender=true) {
            try {
                const res = await this.$API.user.updateInfo($event)
                this.storeToken(res.token)
                if (rerender) {
                    this.rerenderProfileSettings()
                    this._.alert(`Successfully updated`, 'success')
                }
            } catch(err) {
                console.log(err)
            }
        },
        storeToken(token) {
            this.$store.dispatch('user/updateToken', token)
        },
        rerenderProfileSettings() {
            this.showProfileSettings = false
            this.$nextTick(() => { this.showProfileSettings = true })
        },
        async deleteAccount() {
            try {
                const confirm = await this._.confirm(`Are you sure you want to permenantly delete your account?`)
                if (!confirm)
                    return
                const res = await this.$API.user.deleteAccount()
                console.log(res)
                this.$store.dispatch('user/logout')
                this._.toHomePage()
                this._.alert(`Successfully delete account`, 'success')
            } catch(err) {
                console.log(err)
            }
        },
        async getAvailableTimings() {
            try {
                const [locations, timings] = await this.$API.chainedRequests.getActiveLocationsAndTimings()
                this.locations = locations
                this.timings = timings
            } catch(err) {
                console.log(err)
            }
        },
        createTimingSelectionOptions(location) {
            const associatedTimings = this.timings.filter(timing => timing.locationID === location._id)
            return associatedTimings
                .map(timing => {
                    let time = new Date()
                    time.setHours(timing.hour, timing.minute, 0, 0)
                    return {
                        display: [location.name, time.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })],
                        val: timing._id,
                        extraInfo: `Address: ${location.address}`
                    }
                })
        }
    },
    computed: {
        availableTimings() {
            if (this.$store.getters['user/type'] === 'khateeb')
                return this.$store.getters['user/allInfo'].availableTimings
            else
                return []

        },
        availableTimingsTag() {
            if (this.availableTimings.length < 1)
                return [{
                    words: 'Available for All Times',
                    symbol: '⌚',
                    color: 'goodNews'
                }]
            else
                return null
        },
        availableTimingsSelection() {
            if (this.locations.length < 1 || this.timings.length < 1)
                return []
            return this.locations
                .map(location => this.createTimingSelectionOptions(location))
                .reduce((allOptions, locationOption) => [...allOptions, ...locationOption], [])
            
        }
    },
    created() {
        if (this._.validAuthentication({ level: 1 }))
            this.getAvailableTimings()
    }
}
</script>

<style lang="scss" scoped>

.user-setting {
    width: 80%;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    max-height: 1500px;
}

.delete-account {
    width: 80%;
    height: 6vh;
    max-height: 60px;
    font-size: 20px;
    color: red;
}

@media screen and (max-width: $phoneWidth) {
    .delete-account {
        font-size: 3vh;
    }
}
</style>