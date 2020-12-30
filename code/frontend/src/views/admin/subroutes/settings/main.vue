<template>
    <div>
        <collapsable-box
            :headline="`Prayer Locations & Timings`"
        >
            <template v-slot:content>
                <location-timing />
            </template>
        </collapsable-box>
        <!--- --->
        <collapsable-box
            :headline="`Admin Details`"
        >
            <template v-slot:content>
                <admin-identity />
            </template>
        </collapsable-box>
        <!--- --->
        <collapsable-box
            :headline="`Text Service`"
        >
            <template v-slot:content>
                <text-service />
            </template>
        </collapsable-box>
    </div>
</template>

<script>
import adminIdentity from './subviews/adminDetails/main.vue'
import locationTiming from './subviews/locationTiming.vue'
import textService from './subviews/textService/main.vue' 

export default {
    name: "settings",
    components: {
        adminIdentity,
        locationTiming,
        textService
    }
}
</script>

<style lang="scss" scoped>

</style>