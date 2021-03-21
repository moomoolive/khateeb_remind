<template>
    <div>
        <div v-if="utils.validAuthentication({ level: 1 })" class="user-items">
            <div class="menu-item" @click="redirect('/khateeb/')">
                <p class="top-item">Schedule</p>
            </div>
            <div class="menu-item" @click="redirect('/khateeb/announcements')">
                <p>Announcements</p>
            </div>
        </div>
        <div v-if="utils.validAuthentication({ min: 2, max: 3 })" class="user-items">
            <div class="menu-item" @click="redirect('/institutionAdmin/schedule')">
                <p class="top-item">Set Schedule</p>
            </div>
            <div class="menu-item" @click="redirect('/institutionAdmin/announcements')">
                <p>Announcements</p>
            </div>
            <div class="menu-item" @click="redirect('/institutionAdmin')">
                <p>Admin Central</p>
            </div>
        </div>
        <div 
            v-if="utils.validAuthentication({ min: 4 })" 
            class="user-items"
        >
            <div class="menu-item" @click="redirect('/sysAdmin')">
                <p class="top-item">
                    Admin Central
                </p>
            </div>
            <div class="menu-item" @click="redirect('/root/roaming')">
                <p class="top-item">
                    Roaming Mode
                </p>
            </div>
        </div>
        <div class="menu-item" @click="redirect('/user')">
            <p>My Profile</p>
        </div>
        <div
            v-if="!$store.state.user.isBrowsingOnPWA && deferredPrompt" 
            class="menu-item get-the-app" 
            @click="downloadApp()"
        >
            <p class="get-the-app-text">Download the App</p>
        </div>
        <div class="menu-item caution" @click="logout()">
            <p class="caution-text">Logout</p>
        </div>
    </div>
</template>

<script>
import { VuePwaInstallMixin, BeforeInstallPromptEvent } from 'vue-pwa-install'

import notificationHelpers from '@/libraries/notifications/main.js'

export default {
    name: "navigationOptions",
    mixins: [VuePwaInstallMixin],
    data() {
        return {
            deferredPrompt: BeforeInstallPromptEvent || null
        }
    },
    methods: {
        async downloadApp() {
            this.$emit('close-nav')
            const confirm = await notificationHelpers.downloadAppPrompt()
            if (confirm)
                this.promptPwaInstall()
        },
        async promptPwaInstall() {
            if (!this.deferredPrompt) {
                const sixSecondsInMilliseconds = 6_000
                window.setTimeout(() => {
                    window.open("https://mobilesyrup.com/2020/05/24/how-install-progressive-web-app-pwa-android-ios-pc-mac/", "_blank")
                }, sixSecondsInMilliseconds)
                return this.utils.alert(`It looks like you've missed the prompt to download the app, already declined to download the app, or your browser doesn't support web-applications. In a moment, you'll be redirected to a link which shows you how to manually download the app.`)
            }
            this.deferredPrompt.prompt()
            const choice = await this.deferredPrompt.userChoice
            if (choice.outcome === 'accepted')
            this.utils.alert(`The app has finished downloading!`, 'success')
            this.deferredPrompt = null
        },
        stashPwaPrompt(event) {
            event.preventDefault()
            this.deferredPrompt = event
        },
        redirect(path) {
            this.$emit('redirect', path)
        },
        logout() {
            this.$store.dispatch('user/logout')
            this.$emit('close-nav')
            this.$nextTick(() => { this.utils.toHomePage() })
        },
    },
    created() {
        this.$on('canInstall', this.stashPwaPrompt)
    }
}
</script>

<style lang="scss" scoped>
p {
    margin-bottom: 0;
    margin-top: 0;
    margin-right: 0;
    margin-left: 2%;
    padding-top: 1%;
    font-size: 18px;
    font-weight: bold;
    text-align: left;
    color: lighten(getColor("darkBlue"), 50%);
}

.user-items {
    display: inline;
}

.get-the-app {
    background-color: themeRGBA("green", 0.9) !important;
    color: black !important;
    &:hover {
      background-color: lighten(themeRGBA("green", 1), 20%) !important;
    }
}

.get-the-app-text {
  color: black;
}

.caution {
    background-color: themeRGBA("yellow", 0.9) !important;
    &:hover {
      background-color: lighten(themeRGBA("yellow", 1), 20%) !important;
    }
}

.caution-text {
    color: black;
}

.menu-item {
    height: 15%;
    max-height: 45px;
    background-color: themeRGBA("darkBlue", 0.9);
    cursor: default;
    &:hover {
        background-color: lighten(themeRGBA("darkBlue", 1), 20%);
    }
    &.profile-info {
        background-color: getColor("silver");
        font-size: 13px;
    }
}

@media screen and (max-width: $phoneWidth) {
      p {
        font-size: 3vh;
        text-align: center;
      }
      .top-item {
        margin-left: auto;
        margin-right: auto;
        width: 35%;
      }
      .menu-item {
        padding-top: 1vh;
      }
}

</style>