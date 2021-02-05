<template>
    <div class="scroller-container">
        <loading
            :loadingTime="900"
        >
            <div 
                v-for="(notification, index) in allNotifications" :key="index"
                :class="`notification-container ${notificationPosition(index)}`"
            >       
                <div>
                    <tag-circle
                        class="tag" 
                        :info="tagLoader(notification)"
                    />
                    <span class="needs-attention" v-if="notification.actionLink && !notification.actionPerformed">
                        ⚠️
                    </span>
                </div>
                <div class="notification-msg">
                    {{ notification.msg }}
                </div>
                <div>
                    <button 
                        v-if="!!notification.actionLink"
                        :disabled="notification.actionPerformed"
                        :class="`actions-btn ${notification.actionPerformed ? 'green' : 'darkRed'}`"
                        @click="pushToActionPage(notification.actionLink)"
                    >
                        {{  notification.actionPerformed ? notification.completedButtonText || 'Completed' : notification.buttonText }}
                    </button>
                </div>
            </div>
        </loading>
    </div>
</template>

<script>
import tagCircle from '@/components/userInterface/components/tagCircle.vue'
import loading from '@/components/userInterface/components/loadingScreen.vue'

export default {
    name: "notificationScroller",
    components: {
        tagCircle,
        loading
    },
    props: {
        options: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            
        }
    },
    methods: {
        tagLoader(notification) {
            const tag = notification.tag ? notification.tag : notification.__t
            const name = this._.stringFormat(tag)
            let val = { color: 'blue' }
            switch(name) {
                case 'Jummah':
                    if (!notification.actionPerformed)
                        val.color = "red"
                    else
                        val.color = "purple"
                    val.icon = '🤲'
                    break
                case 'Welcome':
                    val.color = 'green'
                    val.icon = '🖐️'
                    break
                case 'Feature':
                    val.icon = '💎'
                    break
                case 'Message':
                    val.icon = '✉️'
                    break
                case 'Khateebs':
                    val.icon = "🕌"
                    break
            }
            val.words = name
            return val
        },
        notificationPosition(index) {
            const notificationCount = this.allNotifications.length
            let position = ''
            if (index === 0)
                position += 'first '
            if (index === notificationCount - 1)
                position += 'last'
            return position
        },
        pushToActionPage(link) {
            if (this.$router.currentRoute.fullPath !== 'link')
                this.$router.push(link)
            this.$store.dispatch('closeNotification')
        }
    },
    computed: {
        allNotifications() {
            return this.$store.state.notificationsFromServer
        }
    }
}
</script>

<style lang="scss" scoped>

.needs-attention {
    float: right;
    margin-right: 2%;
    font-size: 18px;
    position: relative;
}

.scroller-container {
    max-height: 500px;
    overflow-y: scroll;
    overflow-x: hidden;
    ::-webkit-scrollbar {
        width: 12px;
    }
    
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
        border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
    }
}

.notification-container {
    height: 15%;
    background: white;
    border-bottom: getColor("silver") solid 1px;
    border-top: getColor("silver") solid 1px;
    padding-top: 3.5%;
    padding-bottom: 3.5%;
    background-color: getColor("grey");
    box-shadow: rgba(0, 0, 0, 0.4) 0px 3px 8px;
    display: flex;
    flex-direction: column;
    &.first {
        border-top: none;
    }
    &.last {
        border-bottom: none;
    }
}

.notification-msg {
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
    padding-top: 2%;
    padding-bottom: 5%;
    color: getColor("offWhite");
}

.actions-btn {
    width: 85%;
    height: 7%;
    border-radius: 0;
    margin-bottom: 0;
    font-size: 17px;
}

.tag {
    width: 40%;
    margin-left: 6%;
    margin-bottom: 2%;
    padding-top: 0.1%;
    padding-bottom: 1.4%;
    float: left;
}

@media screen and (max-width: $phoneWidth) {
    .scroller-container {
        max-height: 50vh;
    }
    .actions-btn {
        font-size: 2.4vh;
    }
    .needs-attention {
        font-size: 2.4vh;
    }
}

</style>