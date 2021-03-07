<template>
    <div class="scroller-container">
        <loading
            :loadingTime="900"
            :textColor="`white`"
        >
            <div v-if="allNotifications.length > 0">
                <div 
                    v-for="(notification, index) in allNotifications" :key="index"
                    :class="`notification-container`"
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
                        <span class="notification-date">{{ utils.dynamicDisplayDate(notification.createdAt) }}</span><br><br>
                        {{ notification.msg }}
                    </div>
                    <div>
                        <button 
                            v-if="!!notification.actionLink"
                            :disabled="notification.actionPerformed"
                            :class="`actions-btn ${notification.actionPerformed ? 'green' : 'darkRed'}`"
                            @click="pushToActionPage(notification)"
                        >
                            {{  notification.actionPerformed ? notification.completedButtonText || 'Completed' : notification.buttonText }}
                        </button>
                    </div>
                </div>
            </div>
            <div
                v-else 
                class="empty-notifications-container"
            >
                <msg-with-pic
                    class="empty-notifications-msg" 
                    :gif="`sadCat`"
                    :msg="`No notifications to show...`"
                    :textColor="`white`"
                />
            </div>
        </loading>
    </div>
</template>

<script>
import tagCircle from '@/components/general/tagCircle.vue'
import loading from '@/components/general/loadingScreen.vue'
import msgWithPic from '@/components/general/msgWithPic.vue'

export default {
    name: "notificationScroller",
    components: {
        tagCircle,
        loading,
        msgWithPic
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
            const name = this.utils.stringFormat(tag)
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
                    if (notification.meta && notification.meta.dropout)
                        val.color = 'red'
                    break
            }
            val.words = name
            return val
        },
        pushToActionPage(notification) {
            const actionLink = notification.actionLink.replace("__ID__", notification._id)
            console.log(actionLink)
            if (this.$router.currentRoute.fullPath !== actionLink)
                this.$router.push(actionLink)
            this.$emit('close')
        }
    },
    computed: {
        allNotifications() {
            return this.$store.state.notifications.fromServer
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

.empty-notifications-container {
    background-color: getColor("grey");
    padding-bottom: 8%;
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
    &:first-child {
        border-top: none;
    }
    &:last-child {
        border-bottom: none;
    }
}

.notification-msg {
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
    padding-top: 2%;
    font-size: 16px;
    padding-bottom: 5%;
    color: getColor("offWhite");
}

.notification-date {
    font-size: 12px;
    color: getColor("purple");
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