<template>
    <div>
        <loading-screen>
            <Schedule
                v-if="currentSchedule && originalSchedule"
                :type="`admin`"
                :currentSchedule="currentSchedule"
                :originalSchedule="originalSchedule"
                :background="`yellow`"
                @schedule-change="$emit('schedule-change', $event)"
            >
                <template #header="props">
                    <admin-header
                        :display="props.display"
                        :week="props.week"
                        @change="props.change($event)"
                    />
                </template>
                <template #controls="props">
                    <admin-controls
                        :fridayDates="props.fridayDates"
                        :display="props.display"
                        :currentSchedule="props.currentSchedule"
                        @change="props.change($event)"
                    />
                </template>
            </Schedule>
        </loading-screen>
    </div>
</template>

<script>
import Schedule from '@/components/schedules/scheduleRenderer.vue'
import adminHeader from '@/components/schedules/renderedComponents/headers/admin.vue'
import adminControls from '@/components/schedules/renderedComponents/controls/admin.vue'
import loadingScreen from '@/components/userInterface/components/loadingScreen.vue'


export default {
    name: 'adminSchedule',
    components: {
        Schedule,
        adminHeader,
        adminControls,
        loadingScreen
    },
    props: {
        currentSchedule: {
            type: Object,
            required: false
        },
        originalSchedule: {
            type: Object,
            required: false
        },
    }
}
</script>

<style>

</style>