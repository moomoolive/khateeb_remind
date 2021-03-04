<template>
    <div>
        <collapsable-box
            class="user-setting"
            :headline="`Change Username`"
        >
            <form-main 
                :structure="structure.username"
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
                :structure="structure.password"
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
            <form-main
                :structure="structure.profile"
                :basedOn="$store.getters['user/allInfo']"
                :backgroundColor="`none`"
                :buttonText="`Update Profile`"
                @submitted="updateInfo($event)"
            />
        </collapsable-box>
        <collapsable-box
            v-if="_.validAuthentication(1)"
            class="user-setting"
            :headline="`Available Timings`"
            :tagDetails="availableTimingsTag"
        >
            <selection-picker
                v-if="khateebs.struct"
                :options="khateebs.struct"
                :currentlySelected="khateebs.availableTimings"
                @changed="updateInfo({ availableTimings: $event }, false)"
            />
        </collapsable-box>
        <collapsable-box
            v-if="_.validAuthentication(1)"
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

export default {
    name: 'userHome',
    components: {
        collapsableBox,
        formMain,
        selectionPicker,
        calendar
    },
    data() {
        return {
            structure: {
                password: {
                    password: {
                        required: true,
                        minLength: 6
                    }
                },
                username: {
                    username: {
                        required: true,
                        validators: 'username'
                    },
                },
                profile: {
                    handle: {
                        validators: 'handle',
                        required: true,
                    },
                    firstName: {
                        required: true
                    },
                    lastName: {
                        required: true
                    },
                    phoneNumber: {
                        type: 'phoneNumber',
                        required: true
                    }
                }
            },
            khateebExtras: {
                title: {
                    type: "dropdown",
                    required: true,
                    selectOptions: ['none', 'Shiekh', 'Imam']
                }
            },
            khateebs: {
                struct: null,
                availableTimings: null,
                locations: null
            }
        }
    },
    methods: {
        async updateInfo($event, withMsgAndPush=true) {
            try {
                const res = await this.$API.user.updateInfo($event)
                this.storeToken(res.token)
                if (withMsgAndPush) {
                    this._.alert(`Successfully updated!`, 'success')
                    this._.toHomePage()
                }
            } catch(err) {
                console.log(err)
            }
        },
        storeToken(token) {
            this.$store.dispatch('user/updateToken', token)
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
                this.khateebs.locations = locations
                this.khateebs.availableTimings = timings
                this.khateebs.struct = this.buildStructs(locations)
            } catch(err) {
                console.log(err)
            }
        },
        buildStructs(data) {
            const arrayOfStructs = []
            data.forEach(location => {
                location.timings.forEach(timing => {
                    let time = new Date()
                    time.setHours(timing.hour, timing.minute, 0, 0)
                    time = time.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' })
                    const struct = {
                        display: [location.name, time],
                        val: timing._id,
                        extraInfo: `Address: ${location.address}`
                    }
                    arrayOfStructs.push(struct)
                })
            })
            return arrayOfStructs
        },
        async modifyAvailableTimings($event) {
            try {
                this.khateebs.availableTimings = $event
                const res = await this.$API.user.changeProfile({ availableTimings: $event })
                this.storeToken(res.token)
            } catch(err) {
                console.log(err)
            }
        },
    },
    computed: {
        availableTimingsTag() {
            const tag = [{
                words: 'Available for All Times',
                symbol: '⌚',
                color: 'goodNews'
            }]
            if (!this.khateebs.availableTimings)
                return tag
            else
                return this.khateebs.availableTimings.length < 1 ? tag : null
        }
    },
    created() {
        if (this._.validAuthentication({ level: 1 })) {
            this.structure.profile = { ...this.structure.profile, ...this.khateebExtras }
            this.getAvailableTimings()
        }
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