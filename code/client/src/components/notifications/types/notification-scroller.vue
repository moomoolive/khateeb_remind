<template>
    <div class="scroller-container">
        <loading :textColor="`off-white`">
            
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
                        <div v-if="notification.institutionID" class="institution-name">
                            <span class="blue">
                                {{ notification.institutionID.abbreviatedName }}
                            </span>
                        </div>
                        <div>
                            <span class="notification-date purple">
                                {{ _utils.dynamicDisplayDate(notification.createdAt) }}
                            </span>
                        </div>
                        <br>
                        {{ notification.msg }}
                    </div>

                </div>
            </div>

            <div v-else class="empty-notifications-container">
                <general-message
                    class="empty-notifications-msg"
                    :message="`No notifications to show...`"
                    textColor="off-white"
                    iconColor="blue"
                    :fontAwesomeIcon="['fas', 'inbox']"
                />
            </div>

        </loading>
    </div>
</template>

<script>
import tagCircle from '@/components/general/tagCircle.vue'
import loading from '@/components/general/loadingScreen.vue'
import generalMessage from '@/components/misc/generalMessage.vue'

export default {
    name: "notificationScroller",
    components: {
        tagCircle,
        loading,
        generalMessage
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
            const words = this._utils.stringFormat(notification.tag)
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
    padding-bottom: 40px;
}

.notification-container {
    height: 15%;
    border-bottom: get-color("silver") solid 1px;
    border-top: get-color("silver") solid 1px;
    padding-top: 15px;
    padding-bottom: 15px;
    background-color: get-color("grey");
    @include floating-box-shadow(0.4);
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
    @include center-margin();
    text-align: left;
    font-size: 16px;
    margin-top: 0 !important;
    padding-bottom: 12px;
    color: get-color("off-white");
}

.notification-date, .institution-name {
    font-size: 12px;
    @include alternate-font();
}


.tag {
    margin-left: 20px;
    margin-bottom: 5px;
    float: left;
}

@media screen and (max-width: $phone-width) {

    .needs-attention {
        font-size: 14px;
    }

    .tag {
        margin-left: 15px;
    }
}

</style>