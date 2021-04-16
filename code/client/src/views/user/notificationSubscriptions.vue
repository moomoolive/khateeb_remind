<template>
    <div>
        <loading>

            <div v-if="subscriptions.length > 0" class="subscriptions-container">
                <div
                    v-for="(subscription, subscriptionIndex) in subscriptions"
                    :key="subscriptionIndex"
                    class="subscription-container"
                >
                    
                    <div class="device-number">
                        <span class="device-number-text">
                            Device #{{ subscriptionIndex + 1 }}
                        </span>
                    </div>
                    
                    <img 
                        :src="require(`@/assets/logos/${browserLogo(subscription.browserBrand)}`)" 
                        class="browser-logo"
                        alt="internet browser logo"
                    >

                    <div v-if="subscription.deviceId === deviceId" class="current-device">
                        Current Device
                    </div>

                    <div 
                        v-if="subscription.active" 
                        class="current-device purple"
                    >
                        {{ `Since: ${new Date(subscription.updatedAt).toLocaleString('en-US', { month: "short", year: "numeric" })}` }}
                    </div>

                    <div 
                        v-if="!subscription.active" 
                        class="current-device red"
                    >
                        Deactivated
                    </div>

                    <div class="device-info-text">
                        {{ utils.stringFormat(subscription.deviceBrand) }} {{ /unknown/i.test(subscription.deviceBrand) ? " Brand": "" }}
                    </div>

                    <div class="device-info-text">
                        {{ utils.stringFormat(subscription.deviceType) }}
                    </div>

                    <div>
                        <button 
                            :class="`unsubscribe-button ${subscription.active ? 'red' : 'green'}`" 
                            @click="unsubscribe(subscription)"
                        >
                            {{ subscription.active ? 'Deactivate' : 'Activate' }}
                        </button>
                    </div>

                </div>
            </div>
            
            <div v-else>
                <msg-with-pic 
                    :msg="`You aren't recieving notifications for any devices yet`"
                    :gif="`twirlingPlane`"
                />
                <div class="no-notifications-text">
                    This may be because your browser doesn't support them or you've declined to allow
                    Khateeb Remind to send you notifications. If you still want notifications, try
                    manually allowing this website to send notification in your browser settings.
                </div>
            </div>

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import msgWithPic from '@/components/general/msgWithPic.vue'

import localStorageHelpers from '@/libraries/localStorageManagement/main.js'

export default {
    name: "notificationSubscriptions",
    components: {
        loading,
        msgWithPic
    },
    data() {
        return {
            subscriptions: [],
            deviceId: localStorageHelpers.get("deviceId")
        }
    },
    methods: {
        async getSubscriptions() {
            this.subscriptions = await this.$API.pwa.getSubscriptions()
        },
        async unsubscribe({ active=false, deviceId="1234" }) {
            if (active) {
                const confirm = await this.utils.confirm(`Are you sure you want to unsubscribe? You will no longer recieve notifications to this device!`)
                if (!confirm)
                    return
            }
            const res = await this.$API.pwa.updateSubscriptionStatus({ status: !active, deviceId })
            const index = this.subscriptions.findIndex(s => s.deviceId === res.deviceId)
            this.subscriptions.splice(index, 1, res)
        },
        browserLogo(name="Chrome mobile") {
            if (/chrome|google/gi.test(name))
                return 'chrome.png'
            else if (/firefox|mozilla/gi.test(name))
                return 'firefox.png'
            else if (/safari|apple/gi.test(name))
                return 'safari.png'
            else if (/edge|microsoft/gi.test(name))
                return 'edge.png'
            else
                return 'genericBrowser.png'
        }
    },
    created() {
        this.getSubscriptions()
    }
}
</script>

<style lang="scss" scoped>
.no-notifications-text {
    width: 80%;
    max-width: 1000px;
    font-size: 15px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
}

.subscriptions-container {
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
    width: 80%;
    max-width: 1000px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
}

.subscription-container {
    width: 80%;
    max-width: 350px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
    background: getColor('silver');
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.browser-logo {
    width: 60%;
    margin-bottom: 30px;
}

.device-number {
    background: getColor('offWhite');
    height: 40px;
    margin-bottom: 20px;
    font-size: 17px;
    text-align: left;
    font-weight: bold;
    border-top-right-radius: 7px;
    border-top-left-radius: 7px;
    display: flex;
    justify-content: center;
    align-content: center;
}

.device-number-text {
    margin-top: 8px;
}

.device-info-text {
    font-size: 17px;
    margin-bottom: 20px;
}

.unsubscribe-button {
    width: 65%;
    height: 4.5vh;
    max-height: 40px;
    min-height: 30px;
    font-size: 14px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.current-device {
    font-size: 13px;
    padding-top: 3px;
    padding-bottom: 3px;
    width: 120px;
    border-radius: 7px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
    font-weight: bold;
    color: getColor("offWhite");
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    background: getColor("green");
    &.purple {
        background: getColor("purple");
    }
    &.red {
        background: getColor("red");
    }
}

@media screen and (max-width: $phoneWidth) {

    .subscriptions-container {
        flex-direction: column;
    }
}
</style>