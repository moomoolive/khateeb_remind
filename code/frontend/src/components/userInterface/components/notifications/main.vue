<template>
    <div class="notifications-container">
        <div class="topAnchor">
            <span @click="close()">Close</span>
        </div>
        <div class="content">
            <component
                :is="notificationInfo.type"
                :options="notificationInfo.options"
            />
        </div>
    </div>
</template>

<script>
export default {
    name: "notificationsMain",
    components: {
        'alert': () => import('./types/alert.vue')
    },
    methods: {
        close() {
            this.$store.dispatch('closeNotification')
        }
    },
    computed: {
        notificationInfo() {
            return this.$store.state.notifications
        }
    }
}
</script>

<style lang="scss" scoped>
.notifications-container {
    margin-top: 23vh;
    margin-left: 10vw;
    background: black;
    width: 80%;
    height: 35vh;
    border-radius: 4px;
    overflow: hidden;
    background: linear-gradient(
        to right bottom,
        themeRGBA("green", 0.2),
        themeRGBA("green", 0.3)
    );
}

.topAnchor {
    margin-bottom: 0;
    height: 4.5vh;
    background-color: getColor("silver");
}

span {
    margin: 0;
    padding: 1px 2px 1px 2px;
    text-align: left !important;
    position: absolute;
    top: 0.8vh;
    left: 2vw;
    border-radius: 4px;
    color: getColor("offWhite");
    background-color: getColor("red");
    font-weight: bold;
    font-size: 2vh;
}
</style>