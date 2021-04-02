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
    width: 98%;
    background: themeRGBA("grey", 0.8);
    margin-left: auto;
    margin-right: auto;
    border-radius: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
    margin-top: 10px;
}

.external-controls {
    width: 80%;
    background: themeRGBA("grey", 0.8);
    margin-left: auto;
    margin-right: auto;
    border-radius: 7px;
    padding-top: 10px;
    padding-bottom: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px;
    margin-top: 10px;
}

.std-controls-container {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
}

@media screen and (max-width: $phoneWidth) {
    .std-controls {
        display: flex;
        flex-direction: column;
        width: 40%;
        height: auto !important;
    }
    .std-controls-container {
        display: flex;
        flex-direction: row;
    }
    .external-controls {
        width: 73%;
    }
}
</style>