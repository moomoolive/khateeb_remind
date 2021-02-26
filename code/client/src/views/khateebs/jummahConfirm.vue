<template>
    <div>
        <loading :loadingTime="1000">
            <div v-if="exists">
                <div v-if="!confirmed">
                    <div class="confirm-container" v-if="jummahMeta">
                        <div class="confirm-action-box">
                            <p>
                                Are you able to give the following khutbah insha'Allah?<br><br>
                                <span class="purple">{{ jummahMeta.time }}</span><br>
                                at<br>
                                <span class="orange">{{ jummahMeta.locationName }}</span><br>
                                located at<br>
                                <span class="turq">{{ jummahMeta.address }}</span><br>
                                on<br>
                                <span class="blue">{{ jummahMeta.jummahDate }}</span><br>
                            </p>
                            <button
                                @click="confirm()"
                            >
                                Confirm
                            </button>
                            <button 
                                class="red"
                                @click="cancel()"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <msg-with-pic 
                        :msg="`Someone else has already taken this Jummah prayer. Try again next week!`"
                        :gif="`sadCatStanding`"
                    />
                </div>
            </div>
            <div v-else>
                <msg-with-pic
                    :msg="`This notification doesn't exist, has been deleted, or you've already done any associated actions with it`"
                    :gif="`sadCat`"
                />
            </div>
            <button 
                v-if="!exists || confirmed"
                @click="_.toHomePage()"
            >
                Back to Home
            </button>
        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import msgWithPic from '@/components/general/msgWithPic.vue'

export default {
    name: 'jummahConfirm',
    components: {
        loading,
        msgWithPic
    },
    data() {
        return {
            params: this.$route.params,
            requestPackage: null,
            exists: true,
            confirmed: false,
            jummahMeta: null
        }
    },
    methods: {
        async getConfirmationPackage() {
            try {
                const jummahID = this.params.jummahID.split('=')[1]
                const notificationID = this.params.notificationID.split('=')[1]
                const data = await this.$API.khateeb.confirmJummahPackage(jummahID, notificationID)
                if (data === 'non-existent' || data.notification.actionPerformed)
                    this.exists = false
                else
                    this.processNotificationPackage(data)
            } catch(err) {
                console.log(err)
            }
        },
        async processNotificationPackage(usrPackage) {
            this.requestPackage = usrPackage
            if (!this.requestPackage.jummah.confirmed)
                return this.createJummahMeta(this.requestPackage)
            this.confirmed = true
            this.sendInfoToAPI()
        },
        createJummahMeta(info) {
            const meta = {}
            const hour = info.timing.hour
            const displayHour = hour > 12 ? hour - 12 : hour
            const amOrPm = hour > 11 ? 'PM' : 'AM'
            const min = info.timing.minute
            meta.time = `${displayHour}:${min} ${amOrPm}`
            const date = new Date()
            date.setMonth(info.jummah.month)
            const month = date.toLocaleString('en-US', { month: 'long' })
            const weekOf = info.jummah.weekOf
            const year = info.jummah.year
            const displayDate = `${month} ${weekOf}, ${year}`
            meta.jummahDate = displayDate
            meta.locationName = info.location.name
            meta.address = info.location.address
            this.jummahMeta = meta
        },
        async cancel() {
            const confirm = await this._.confirm(`Are you sure you cannot make it?`)
            if (confirm)
                this.updateJummahStatus(false)
        },
        confirm() {
            this.requestPackage.jummah.confirmed = true
            this.updateJummahStatus(true)
        },
        updateJummahStatus(confirm) {
            const user = this.$store.getters['user/allInfo']
            const found = this.requestPackage.jummah.khateebPreference.find(preference => preference.khateebID === user._id)
            const index = this.requestPackage.jummah.khateebPreference.map(preference => preference.khateebID).indexOf(user._id)
            found.confirmed = confirm
            found.responded = true
            found.notified = true
            this.sendInfoToAPI(index)
        },
        async sendInfoToAPI(preferenceIndicator) {
            try {
                this.requestPackage.notification.actionPerformed = true
                this.$store.dispatch('markNotificationActionAsComplete', this.requestPackage.notification._id)
                const confirmedPackage = {
                    jummah: this.requestPackage.jummah,
                    notification: this.requestPackage.notification,
                    preferenceIndicator
                }
                const res = await this.$API.khateeb.confirmJummah(confirmedPackage)
                this._.toHomePage()
                this._.alert(`Successfully updated your jummah status!`, 'success')
            } catch(err) {
                console.log(err)
            }
        }
    },
    created() {
        this.getConfirmationPackage()
    }
}
</script>

<style lang="scss" scoped>
button{
    max-width: 150px;
    font-size: 16px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
}

.confirm-action-box {
    width: 80%;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
    background-color: getColor('grey');
    border-radius: 7px;
    padding-top: 20px;
    padding-bottom: 20px;
    max-height: 400px;
    height: 60%;
}

.confirm-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
}

p {
    color: getColor("offWhite");
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    font-size: 25px;
}

span {
    &.purple {
        color: getColor('purple');
    }
    &.orange {
        color: getColor("orange");
    }
    &.blue {
        color: getColor("blue");
    }
    &.turq {
        color: getColor("turquoise");
    }
}

@media screen and (max-width: $phoneWidth) {
    button {
        font-size: 2.1vh;
    }
    p {
        font-size: 3vh;
    }
}
</style>