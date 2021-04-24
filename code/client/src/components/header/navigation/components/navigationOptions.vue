<template>
    <div v-on-clickaway="close">
        
        <div v-if="utils.validAuthentication({ level: 1 })">
            
            <div class="menu-item" @click="redirect('/khateeb/')">
                <p>Schedule</p>
            </div>
            
            <div class="menu-item" @click="redirect('/khateeb/announcements')">
                <p>Announcements</p>
            </div>
            
            <div class="menu-item" @click="redirect('/khateeb/my-khutbahs')">
                <p>My Khutbahs</p>
            </div>

        </div>

        <div v-if="utils.validAuthentication({ min: 2, max: 3 })">
            
            <div class="menu-item" @click="redirect('/institutionAdmin/schedule')">
                <p>Set Schedule</p>
            </div>
            
            <div class="menu-item" @click="redirect('/institutionAdmin/announcements')">
                <p>Announcements</p>
            </div>
            
            <div class="menu-item" @click="redirect('/institutionAdmin')">
                <p>Admin Central</p>
            </div>

        </div>

        <div v-if="utils.validAuthentication({ min: 4 })" >
            
            <div class="menu-item" @click="redirect('/sysAdmin')">
                <p>Admin Central</p>
            </div>

        </div>

        <div class="menu-item" @click="tutorials()">
            <p>Tutorials</p>
        </div>

        <div
            v-if="deferredPrompt && !$store.state.user.isBrowsingOnPWA"
            class="menu-item get-the-app" 
            @click="downloadApp()"
        >
            <p class="alternate-text-color">Download the App</p>
        </div>
        
        <div class="menu-item caution" @click="logout()">
            <p class="alternate-text-color">Logout</p>
        </div>

    </div>
</template>

<script>
import { VuePwaInstallMixin, BeforeInstallPromptEvent } from 'vue-pwa-install'
import { mixin as clickaway } from 'vue-clickaway'

import notificationHelpers from '@/libraries/notifications/main.js'

export default {
    name: "navigationOptions",
    mixins: [VuePwaInstallMixin, clickaway],
    props: {
        activeMenu: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            deferredPrompt: BeforeInstallPromptEvent || null,
            firstOpened: false
        }
    },
    methods: {
        async downloadApp() {
            this.$emit('close-nav')
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
            if (choice.outcome === 'accepted') {
                this.utils.alert(`The app has finished downloading!`, 'success')
                this.deferredPrompt = null
            }
        },
        stashPwaPrompt(event) {
            event.preventDefault()
            this.deferredPrompt = event
        },
        redirect(path) {
            this.$emit('redirect', path)
        },
        tutorials() {
            notificationHelpers.tutorial('general', 1)
            this.close()
        },
        close() {
            if (this.activeMenu && this.firstOpened)
                this.$emit('close-nav')
        },
        async logout() {
            this.close()
            const confirm = await this.utils.confirm(`Are you sure you want to logout?`)
            if (!confirm)
                return
            this.$store.dispatch('user/logout')
        },
    },
    watch: {
        activeMenu(newVal, oldVal) {
            if (newVal && !oldVal){
                const oneTenthOfASecondInMilliseconds = 100
                window.setTimeout(() => this.firstOpened = true, oneTenthOfASecondInMilliseconds)
            }
            else if (!newVal && oldVal)
                this.firstOpened = false
        }
    },
    created() {
        this.$on('canInstall', this.stashPwaPrompt)
    }
}
</script>

<style lang="scss" scoped>
p {
    font-size: 18px;
    font-weight: bold;
    text-align: left;
    color: getColor("offWhite");
}

.menu-item {
    background-color: themeRGBA("grey", 0.9);
    cursor: default;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 10px;
    padding-right: 10px;
    
    &:hover {
        background-color: lighten(themeRGBA("grey", 1), 20%);
        
    }
    
    > :hover {
        &:after {
            content: "  >";
        }
    }
}

.get-the-app {
    background-color: themeRGBA("green", 0.9) !important;
    color: black !important;
    &:hover {
      background-color: lighten(themeRGBA("green", 1), 20%) !important;
    }
}

.caution {
    background-color: themeRGBA("yellow", 0.9) !important;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    &:hover {
      background-color: lighten(themeRGBA("yellow", 1), 20%) !important;
    }
}

.alternate-text-color {
    color: black;
}

@media screen and (max-width: $phoneWidth) {
      
      p {
        font-size: 16px;
        text-align: center;
      }
      
      .menu-item {
        
      }
}

</style>