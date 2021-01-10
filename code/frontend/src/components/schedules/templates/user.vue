<template>
    <div>
        <loading-screen>
            <Schedule
                v-if="currentSchedule"
                :type="`user`"
                :currentSchedule="currentSchedule"
            >
                <template #header="props">
                    <user-header
                        :display="props.display"
                        :week="props.week"
                        :lastUpdated="props.lastUpdated"
                    />
                </template>
                <template #controls="props">
                    <user-controls
                        :fridayDates="props.fridayDates"
                        :display="props.display"
                        :currentSchedule="props.currentSchedule"
                        :weekOf="props.weekOf"
                        @change="props.change($event)"
                    />
                </template>
            </Schedule>
        </loading-screen>
    </div>
</template>

<script>
import Schedule from '@/components/schedules/scheduleRenderer.vue'
import userHeader from '@/components/schedules/renderedComponents/headers/user.vue'
import userControls from '@/components/schedules/renderedComponents/controls/user.vue'
import loadingScreen from '@/components/userInterface/components/loadingScreen.vue'

export default {
    name: 'userSchedule',
    components: {
        Schedule,
        userHeader,
        userControls,
        loadingScreen
    },
    props: {
        currentSchedule: {
            type: Object,
            required: false
        }
    }
}
</script>

<style>

</style>