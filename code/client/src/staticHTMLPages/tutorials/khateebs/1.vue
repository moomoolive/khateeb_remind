<template>
    <div>
        <h1>Getting Started</h1>
        <p>
            Welcome to Khateeb Remind! Here's some tips for getting started:
        </p>
        <p>
            If you ever want to change your available timings or let your khateeb manager know that you're unavailable on a certain date, head to "My Profile"
        </p>
        <img :src="require(`@/assets/tutorials/myProfile.gif`)">
        <p>
            To change your timings click 'Available Timings' and select which timings you are available for. By default you are set to available for all timings.
        </p>
        <img :src="require(`@/assets/tutorials/general1/selectUnselect.gif`)">
        <p>
            To let your khateeb manager know that you're unavailable on certain dates, click on 'Unavailable Dates'. Click the jummahs which you're unavailable for and you should see a red dot appear under it. Click on it again to make yourself available again for that day. By default you are available for all days.
        </p>
        <img :src="require(`@/assets/tutorials/khateebs/setUnavailableDates.gif`)">
        <button @click="toMyProfile()">
            To My Profile
        </button>
    </div>
</template>

<script>
export default {
    name: "tutorialKhateebs1",
    methods: {
        toMyProfile() {
            this.$router.push('/user')
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/scss/tutorialStyles.scss";

button {
    margin-top: 20px;
    max-width: 120px;
    font-size: 15px;
    max-height: 40px;
}

</style>