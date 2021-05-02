<template>
    <div>
        <div class="std-controls-container">
            
            <locations-button-group 
                class="std-controls"
                :locations="locations"
                :selectedLocation="selectedLocation"
                @change-location="$emit('change-location', $event)"
            />

            <switch-weeks-button-group 
                class="std-controls"
                :selectedDate="selectedDate"
                @change-week="$emit('change-week', $event)"
            />

        </div>

    </div>
</template>

<script>
import locationsButtonGroup from './buttonGroups/locations.vue'
import switchWeeksButtonGroup from './buttonGroups/weeks.vue'

export default {
    name: 'standardMonthlyScheduleControls',
    components: {
        locationsButtonGroup,
        switchWeeksButtonGroup,
    },
    props: {
        locations: {
            type: Array,
            required: true
        },
        selectedLocation: {
            type: String,
            required: true
        },
        viewingMonthIsCurrentPastOrFuture: {
            type: String,
            required: true
        },
        selectedDate: {
            type: Date,
            required: true
        }
    }
}
</script>

<style lang="scss" scoped>
.std-controls {
    background: get-color("grey", 0.8);
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 7px;
    padding-top: 10px;
    max-width: 180px;
    min-width: 100px;
    padding-bottom: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
}

.std-controls-container {
    max-width: 400px;
    margin-right: 20px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
}

@media screen and (max-width: $phone-width) {
    
    .std-controls {
        width: 40%;
    }

    .std-controls-container {
        margin-right: 0px;
        height: auto !important;
    }
}
</style>