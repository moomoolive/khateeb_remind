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
                        <tag-circle class="tag" :info="tagLoader(notification)"/>
                        <span class="needs-attention" v-if="notification.urgent">
                            ⚠️
                        </span>
                    </div>

                    <div class="notification-msg">
                        <span class="notification-date purple">
                            {{ utils.dynamicDisplayDate(notification.createdAt) }}
                        </span><br><br>
                        {{ notification.msg }}
                    </div>

                </div>
            </div>

            <div v-else class="empty-notifications-container">
                <msg-with-pic
                    class="empty-notifications-msg" 
                    :gif="`twirlingPlane`"
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
            const words = this.utils.stringFormat(notification.tag)
            let val = { color: 'blue', words, icon: '📭' }
            switch(words) {
                case 'Jummah':
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
            }
            return val
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
    margin-right: 7%;
    font-size: 18px;
    position: relative;
}

.scroller-container {
    max-height: 375px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.empty-notifications-container {
    background-color: getColor("grey");
    padding-bottom: 10px;
}

.notification-container {
    height: 15%;
    border-bottom: getColor("silver") solid 1px;
    border-top: getColor("silver") solid 1px;
    padding-top: 15px;
    padding-bottom: 15px;
    background-color: getColor("grey");
    @include floatingBoxShadow(0.4);
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
    @include centerMargin();
    text-align: left;
    padding-top: 6px;
    font-size: 16px;
    padding-bottom: 12px;
    color: getColor("offWhite");
}

.notification-date {
    font-size: 12px;
}

.tag {
    margin-left: 20px;
    margin-bottom: 5px;
    float: left;
}

@media screen and (max-width: $phoneWidth) {

    .needs-attention {
        font-size: 14px;
    }

    .tag {
        margin-left: 15px;
    }
}

</style>