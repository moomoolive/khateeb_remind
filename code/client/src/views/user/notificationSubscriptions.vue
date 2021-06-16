<template>
    <div>
        <loading>

            <div class="options-container">
                <div class="permissions-header">
                    Notification Permissions
                </div>
                <div>
                    <div class="option-container">
                        <div class="slider-container">
                            <slider-button :initialState="recieveExternalNotification" @toggled="toggleSetting($event, 'recieveExternalNotification')"/>
                        </div>
                        <div class="slider-text">
                            Email
                        </div>
                    </div>
                    <div :class="`option-container ${recievePWAPush ? '' : 'bottom'}`">
                        <div class="slider-container">
                            <slider-button :initialState="recievePWAPush" @toggled="toggleSetting($event, 'recievePWAPush')"/>
                        </div>
                        <div class="slider-text">
                            Push Messages
                        </div>
                    </div>
                    <collapse-transition :duration="600">
                        <div v-show="recievePWAPush" class="option-container bottom">
                            <div class="slider-container">
                                <slider-button :initialState="showDevicesGettingPWAPush" @toggled="toggleSubscriptionDisplay($event)"/>
                            </div>
                            <div class="slider-text">
                                {{ showDevicesGettingPWAPush ? "Hide" : "Show" }} Devices
                            </div>
                        </div>
                    </collapse-transition>
                </div>
            </div>

            <collapse-transition :duration="600">
                
                <div v-show="showDevicesGettingPWAPush">
                    <div v-if="subscriptions.length > 0">
                        <div class="device-recieving-pwa-header">
                            Devices Recieving Push Messages
                        </div>
                        <div class="subscriptions-container">
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
                                
                                <span :class="browserLogo(subscription.browserBrand).color">
                                    <fa-icon 
                                        :icon="browserLogo(subscription.browserBrand).icon"
                                        class="browser-logo" 
                                    />
                                </span>

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
                                    {{ _utils.stringFormat(subscription.deviceBrand) }} {{ /unknown/i.test(subscription.deviceBrand) ? " Brand": "" }}
                                </div>

                                <div class="device-info-text">
                                    {{ _utils.stringFormat(subscription.deviceType) }}
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
                    </div>
                    
                    <div class="no-sub-container" v-else>
                        
                        <general-message
                            class="no-notifications-msg"
                            :message="`No Devices Recieving Push Messages`"
                            iconColor="yellow"
                            :fontAwesomeIcon="['fas', 'bell']"
                        />

                        <div class="no-notifications-text">
                            Either your browser doesn't support web push notifications 
                            or you've restricted Khateeb Remind's notification permissions. <br><br>
                            If you still want push notifications, try manually allowing Khateeb Remind 
                            to send notification through your browser settings.
                        </div>
                    </div>
                </div>

            </collapse-transition>

        </loading>
    </div>
</template>

<script>
import loading from '@/components/general/loadingScreen.vue'
import generalMessage from '@/components/misc/generalMessage.vue'
import sliderButton from '@/components/misc/sliderButton.vue'

import { CollapseTransition } from "@ivanv/vue-collapse-transition"

import localStorageHelpers from '@/libraries/localStorageManagement/main.js'

export default {
    name: "notificationSubscriptions",
    components: {
        loading,
        generalMessage,
        CollapseTransition,
        sliderButton
    },
    data() {
        return {
            subscriptions: [],
            deviceId: localStorageHelpers.get("deviceId"),
            showDevicesGettingPWAPush: false
        }
    },
    methods: {
        async getSubscriptions() {
            this.subscriptions = await this._api.pwa.getSubscriptions()
        },
        toggleSubscriptionDisplay(newVal=true) {
            this.showDevicesGettingPWAPush = newVal
        },
        async unsubscribe({ active=false, deviceId="1234" }) {
            if (active) {
                const confirm = await this._utils.confirm(`Are you sure you want to unsubscribe? You will no longer recieve notifications to this device!`)
                if (!confirm)
                    return
            }
            const res = await this._api.pwa.updateSubscriptionStatus({ status: !active, deviceId })
            const index = this.subscriptions.findIndex(s => s.deviceId === res.deviceId)
            this.subscriptions.splice(index, 1, res)
        },
        browserLogo(name="Chrome mobile") {
            if (/chrome|google/gi.test(name))
                return { icon: ['fab', 'chrome'], color: 'green' }
            else if (/firefox|mozilla/gi.test(name))
                return { icon: ['fab', 'firefox-browser'], color: 'dark-red' }
            else if (/edge|microsoft/gi.test(name))
                return { icon: ['fab', 'edge-legacy'], color: 'blue' }
            else if (/safari|apple/gi.test(name))
                return { icon: ['fab', 'safari'], color: 'blue' }
            else
                return { icon: ['fas', 'globe'], color: 'orange' }
        },
        async toggleSetting(newVal=true, key="recievePWAPush") {
            const update = { }
            update["settings." + key] = newVal
            const res = await this._api.user.updateInfo(update)
            if (!res.data) {
                return this._utils.alert(`There was a problem updating your profile`)
            }
        }
    },
    computed: {
        recieveExternalNotification() {
            return this.$store.state.user.userInfo.settings.recieveExternalNotification
        },
        recievePWAPush() {
            return this.$store.state.user.userInfo.settings.recievePWAPush
        }
    },
    created() {
        this.getSubscriptions()
    }
}
</script>

<style lang="scss" scoped>
.no-notifications-text {
    margin-top: 30px;
    width: 80%;
    max-width: 600px;
    font-size: 16px;
    margin-bottom: 20px;
    @include center-margin();
}

.options-container {
    margin-top: 20px;
    width: 80%;
    max-width: 650px;
    @include light-border-rounding();
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 9px;
    padding-right: 9px;
    @include center-margin();
}

.slider-container {
    margin-left: 10px;
    width: 40%;
    text-align: left;
}

.slider-text {
    width: 45%;
    margin-right: 10px;
    margin-left: 15%;
    text-align: right;
    font-size: 18px;
}

.permissions-header {
    font-size: 27px;
    margin-bottom: 50px;
}

.option-container {
    width: 100%;
    background: get-color("off-white");
    padding-top: 12px;
    padding-bottom: 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    @include floating-box-shadow();

    &:first-child {
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;
        border-top: none;
        border-bottom: 1px get-color('grey', 0.5) solid;
    }

    &:last-child {
        border-top: 1px get-color('grey', 0.5) solid;
        border-bottom: none;
    }

    &.bottom {
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
    }
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
    background: get-color('silver');
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-radius: 7px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.browser-logo {
    font-size: 120px;
    margin-bottom: 40px;
}

.no-notifications-msg {
    margin-top: 30px;
}

.device-number {
    background: get-color('off-white');
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
    color: get-color("off-white");
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    background: get-color("green");
    &.purple {
        background: get-color("purple");
    }
    &.red {
        background: get-color("red");
    }
}

.device-recieving-pwa-header {
    margin-top: 30px;
    margin-bottom: 30px;
    font-size: 35px;
    font-weight: bold;
}

@media screen and (max-width: $phone-width) {

    .subscriptions-container {
        flex-direction: column;
    }

    .show-subscriptions-button {
        font-size: 14px;
    }

    .slider-text {
        font-size: 15px;
    }

    .device-recieving-pwa-header {
        font-size: 24px;
    }

    .option-container {
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .permissions-header {
        font-size: 22px;
        margin-bottom: 30px;
    }

}
</style>