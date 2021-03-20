<template>
    <div>
        <div>
            <button 
                @click="changeLocation('all')"
                :class="`location-btns ${selectedLocation === 'all' ? 'active-controls' : ''}`"
            >
                {{  locations.length > 1 ? 'All' : 'All Locations' }}
            </button>
        </div>
        <div v-show="locations.length > 1">
            <button  
                v-for="(location, locationIndex) in locations" 
                :key="locationIndex"
                :class="`location-btns ${selectedLocation === location._id ? 'active-controls' : ''}`"
                @click="changeLocation(location._id)"
            >
                {{ location.name }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "monthlyScheduleLocationsButtons",
    props: {
        locations: {
            type: Array,
            required: true
        },
        selectedLocation: {
            type: String,
            required: true
        }
    },
    methods: {
        changeLocation(id) {
            this.$emit('change-location', id)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/scss/jummahSchedule/buttons.scss';

.location-btns {
    width: 30%;
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 10px;
}

@media screen and (max-width: $phoneWidth) {
    .location-btns {
        width: 85%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 1vh;
    }
}
</style>